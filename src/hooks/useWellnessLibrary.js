import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';

export const PAGE_SIZE = 24;

const queryKey = (topic, userId) => ['wellness-library', userId || 'anonymous', topic];

export function useWellnessLibrary(topic) {
  const { user, isLoadingAuth } = useAuth();
  return useInfiniteQuery({
    queryKey: queryKey(topic, user?.id),
    enabled: !isLoadingAuth,
    queryFn: async ({ pageParam = 0 }) => {
      const res = await base44.functions.invoke('getWellnessLibrary', {
        skip: pageParam,
        limit: PAGE_SIZE,
        topic,
      });
      if (res.data?.error) throw new Error(res.data.error);
      const ids = res.data.resources.map((resource) => resource.id);
      const personal = user?.id && ids.length
        ? await base44.entities.WellnessResourceRating.filter(
            { created_by_id: user.id, resource_id: { $in: ids } },
            { sort: '-updated_date', limit: 50, fields: ['resource_id', 'rating', 'description'] },
          )
        : { items: [] };
      const mine = new Map();
      personal.items.forEach((rating) => {
        if (!mine.has(rating.resource_id)) mine.set(rating.resource_id, rating);
      });
      return {
        ...res.data,
        ratings: res.data.ratings.map((stat) => ({
          ...stat,
          my_rating: mine.get(stat.resource_id)?.rating || 0,
          my_rating_id: mine.get(stat.resource_id)?.id || null,
          my_note: mine.get(stat.resource_id)?.description || '',
        })),
      };
    },
    initialPageParam: 0,
    getNextPageParam: (last) => (last.has_more ? last.next_skip : undefined),
  });
}

// Only confirmed writes change the visible rating; failed writes never look saved.
export function useRateResource() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const key = ['wellness-library', user?.id || 'anonymous'];
  return useMutation({
    scope: { id: `wellness-ratings-${user?.id}` },
    mutationFn: async ({ resourceId, value, note }) => {
      if (!user?.id) throw new Error('Please sign in to save a rating.');
      if (!Number.isInteger(value) || value < 1 || value > 5) throw new Error('Choose 1–5 stars.');
      const { items } = await base44.entities.WellnessResourceRating.filter(
        { created_by_id: user.id, resource_id: resourceId },
        { sort: '-updated_date', limit: 1 },
      );
      const payload = { rating: value, description: note.trim().slice(0, 1000) };
      const saved = items[0]
        ? await base44.entities.WellnessResourceRating.update(items[0].id, payload)
        : await base44.entities.WellnessResourceRating.create({ resource_id: resourceId, ...payload });
      if (!saved?.id) throw new Error('The rating was not saved. Please try again.');
      return saved;
    },
    onMutate: () => queryClient.cancelQueries({ queryKey: key }),
    onSuccess: async (saved) => {
      // Update every loaded topic, not just the topic visible when saving began.
      await queryClient.cancelQueries({ queryKey: key });
      queryClient.setQueriesData({ queryKey: key }, (data) => data && ({
        ...data,
        pages: data.pages.map((page) => ({ ...page, ratings: page.ratings.map((stat) => {
          if (stat.resource_id !== saved.resource_id) return stat;
          const count = stat.my_rating ? stat.count : stat.count + 1;
          const sum = stat.average * stat.count - (stat.my_rating || 0) + saved.rating;
          return { ...stat, count, average: count ? sum / count : 0,
            my_rating: saved.rating, my_rating_id: saved.id, my_note: saved.description || '' };
        }) })),
      }));
      await queryClient.invalidateQueries({ queryKey: key });
      toast.success('Your rating and note are saved.');
    },
  });
}