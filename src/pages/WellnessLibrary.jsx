import React, { useMemo, useRef, useState } from 'react';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, Search, HeartPulse, X } from 'lucide-react';
import WellnessResourceCard from '@/components/wellness/WellnessResourceCard';
import { useAuth } from '@/lib/AuthContext';
import { toast } from 'sonner';

const TOPICS = [
  { id: 'all', label: 'All Topics' },
  { id: 'fatigue_management', label: 'Fatigue Management' },
  { id: 'legal_rights', label: 'Legal Rights' },
  { id: 'emotional_wellbeing', label: 'Emotional Well-Being' },
  { id: 'workplace_accommodations', label: 'Workplace Accommodations' },
  { id: 'nutrition_movement', label: 'Nutrition & Movement' },
  { id: 'sleep_rest', label: 'Sleep & Rest' },
];

const queryKey = (userId) => ['wellness-library', userId || 'anonymous'];

export default function WellnessLibrary() {
  const { isAuthenticated, isLoadingAuth, user } = useAuth();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [topic, setTopic] = useState('all');
  const pendingRatingsRef = useRef(new Set());

  const libraryQuery = useInfiniteQuery({
    queryKey: queryKey(user?.id),
    enabled: !isLoadingAuth,
    initialPageParam: 0,
queryFn: async ({ pageParam }) => {
  const response = await base44.functions.invoke('getWellnessLibraryPage', { offset: pageParam });
  if (response?.data?.error) throw new Error(response.data.error);
  return response.data;
},
    getNextPageParam: (lastPage) => lastPage.next_offset ?? undefined,
    retry: 2,
  });

  const resources = useMemo(
    () => libraryQuery.data?.pages.flatMap((page) => page.resources) || [],
    [libraryQuery.data],
  );
  const ratingStats = useMemo(() => Object.fromEntries(
    (libraryQuery.data?.pages || []).flatMap((page) => page.rating_summaries)
      .map((summary) => [summary.resource_id, summary]),
  ), [libraryQuery.data]);

  const rateMutation = useMutation({
    mutationFn: async ({ resourceId, rating }) => {
      const response = await base44.functions.invoke('rateWellnessResource', {
        resource_id: resourceId,
        rating,
      });
      if (response?.data?.error) throw new Error(response.data.error);
      return response.data;
    },
    onMutate: async ({ resourceId, rating }) => {
      const key = queryKey(user?.id);
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData(key);
      queryClient.setQueryData(key, (current) => {
        if (!current) return current;
        return {
          ...current,
          pages: current.pages.map((page) => ({
            ...page,
            rating_summaries: page.rating_summaries.map((summary) => {
              if (summary.resource_id !== resourceId) return summary;
              const hadRating = summary.my_rating > 0;
              const count = summary.count + (hadRating ? 0 : 1);
              const sum = summary.average * summary.count - (hadRating ? summary.my_rating : 0) + rating;
              return { ...summary, average: sum / count, count, my_rating: rating };
            }),
          })),
        };
      });
      return { previous, key };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKey(user?.id) });
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) queryClient.setQueryData(context.key, context.previous);
      toast.error('Your rating could not be saved. Your previous rating has been restored.');
    },
    onSettled: (_data, _error, variables) => {
      if (variables?.resourceId) pendingRatingsRef.current.delete(variables.resourceId);
    },
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return resources.filter((resource) => {
      if (topic !== 'all' && resource.topic !== topic) return false;
      return !q || [resource.title, resource.summary, resource.source, resource.topic]
        .join(' ').toLowerCase().includes(q);
    });
  }, [resources, search, topic]);

  const handleRate = (resource, rating) => {
    if (!isAuthenticated) {
      base44.auth.redirectToLogin(window.location.pathname);
      return;
    }
    if (pendingRatingsRef.current.has(resource.id)) return;
    pendingRatingsRef.current.add(resource.id);
    rateMutation.mutate({ resourceId: resource.id, rating });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 border-2 border-emerald-300">
          <HeartPulse className="h-4 w-4 text-emerald-700" />
          <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700">Wellness Library</span>
        </div>
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-emerald-700 via-teal-600 to-violet-700 bg-clip-text text-transparent">Wellness Resource Library</h1>
        <p className="text-lg font-medium text-slate-800 max-w-2xl mx-auto">Search trusted wellness resources by topic, and rate how helpful each one was for fellow survivors.</p>
      </div>

      <Card className="bg-white border-2 border-slate-300 shadow-md">
        <CardContent className="p-5">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
            <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search loaded resources (e.g. fatigue, FMLA, sleep)..." className="pl-12 pr-12 h-12 text-base border-2 border-slate-300 focus-visible:border-emerald-500" />
            {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-slate-100" aria-label="Clear search"><X className="h-4 w-4 text-slate-600" /></button>}
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {TOPICS.map((item) => <button key={item.id} onClick={() => setTopic(item.id)} className={`px-3.5 py-1.5 rounded-full text-sm font-bold border-2 transition-all ${topic === item.id ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-transparent shadow-md' : 'bg-white text-slate-800 border-slate-300 hover:border-emerald-400'}`}>{item.label}</button>)}
          </div>
        </CardContent>
      </Card>

      {libraryQuery.isPending || isLoadingAuth ? (
        <div className="flex justify-center py-16" role="status" aria-label="Loading wellness resources"><div className="w-8 h-8 border-4 border-slate-200 border-t-emerald-600 rounded-full animate-spin" /></div>
      ) : libraryQuery.isError ? (
        <Card className="bg-red-50 border-2 border-red-300" role="alert">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-10 w-10 text-red-600 mx-auto mb-3" />
            <h2 className="text-lg font-extrabold text-red-950">We couldn’t load the wellness library</h2>
            <p className="text-sm font-medium text-red-800 mt-1 mb-4">Check your connection and try again.</p>
            <Button onClick={() => libraryQuery.refetch()} disabled={libraryQuery.isFetching}>Retry</Button>
          </CardContent>
        </Card>
      ) : filtered.length === 0 ? (
        <Card className="bg-white border-2 border-slate-300"><CardContent className="p-12 text-center"><Search className="h-10 w-10 text-slate-400 mx-auto mb-3" /><h3 className="text-lg font-extrabold text-slate-900">No resources found</h3><p className="text-sm font-medium text-slate-700 mt-1">Try a different search term or topic.</p></CardContent></Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((resource) => {
              const stats = ratingStats[resource.id];
              return <WellnessResourceCard key={resource.id} resource={resource} avgRating={stats?.average || 0} ratingCount={stats?.count || 0} myRating={stats?.my_rating || 0} onRate={(rating) => handleRate(resource, rating)} />;
            })}
          </div>
          {libraryQuery.hasNextPage && <div className="flex justify-center"><Button variant="outline" onClick={() => libraryQuery.fetchNextPage()} disabled={libraryQuery.isFetchingNextPage}>{libraryQuery.isFetchingNextPage ? 'Loading more…' : 'Load more resources'}</Button></div>}
          {libraryQuery.isFetchNextPageError && <div className="text-center text-sm font-semibold text-red-700" role="alert">More resources could not be loaded. <button className="underline" onClick={() => libraryQuery.fetchNextPage()}>Retry</button></div>}
        </>
      )}
    </div>
  );
}
