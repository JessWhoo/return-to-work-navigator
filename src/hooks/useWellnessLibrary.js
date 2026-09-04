import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';

export const PAGE_SIZE = 24;

const queryKey = (topic) => ['wellness-library', topic];

export function useWellnessLibrary(topic) {
  return useInfiniteQuery({
    queryKey: queryKey(topic),
    queryFn: async ({ pageParam = 0 }) => {
      const res = await base44.functions.invoke('getWellnessLibrary', {
        skip: pageParam,
        limit: PAGE_SIZE,
        topic,
      });
      if (res.data?.error) throw new Error(res.data.error);
      return res.data;
    },
    initialPageParam: 0,
    getNextPageParam: (last) => (last.has_more ? last.next_skip : undefined),
  });
}

// Apply an optimistic rating to the cached aggregate for one resource.
function patchRating(data, resourceId, updater) {
  if (!data) return data;
  return {
    ...data,
    pages: data.pages.map((page) => ({
      ...page,
      ratings: page.ratings.map((r) => (r.resource_id === resourceId ? updater(r) : r)),
    })),
  };
}

export function useRateResource(topic) {
  const queryClient = useQueryClient();
  const key = queryKey(topic);

  return useMutation({
    mutationFn: async ({ resourceId, value, stat }) => {
      if (stat.my_rating_id) {
        await base44.entities.WellnessResourceRating.update(stat.my_rating_id, { rating: value });
        return stat.my_rating_id;
      }
      const created = await base44.entities.WellnessResourceRating.create({ resource_id: resourceId, rating: value });
      return created.id;
    },
    onMutate: async ({ resourceId, value, stat }) => {
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData(key);
      queryClient.setQueryData(key, (data) =>
        patchRating(data, resourceId, (r) => {
          const sum = r.average * r.count - (r.my_rating || 0) + value;
          const count = r.my_rating ? r.count : r.count + 1;
          return { ...r, average: sum / count, count, my_rating: value };
        }),
      );
      return { previous };
    },
    onSuccess: (ratingId, { resourceId }) => {
      queryClient.setQueryData(key, (data) =>
        patchRating(data, resourceId, (r) => ({ ...r, my_rating_id: ratingId })),
      );
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(key, ctx.previous);
      toast.error("Your rating couldn't be saved. Please try again.");
    },
  });
}