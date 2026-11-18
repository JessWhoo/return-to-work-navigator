import React from 'react';
import { base44 } from '@/api/base44Client';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Video, Phone, X } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import AddToGoogleCalendarButton from '@/components/booking/AddToGoogleCalendarButton';

const TOPIC_LABELS = {
  return_to_work_planning: 'Return-to-work planning',
  accommodations: 'Requesting accommodations',
  workplace_disclosure: 'Disclosing to my employer',
  energy_and_fatigue: 'Energy & fatigue management',
  career_transition: 'Career transition',
  communication_and_boundaries: 'Communication & boundaries',
  emotional_support: 'Emotional support',
  other: 'Something else',
};

const STATUS_STYLES = {
  requested: 'bg-amber-100 text-amber-800 border-amber-300',
  confirmed: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  completed: 'bg-slate-100 text-slate-700 border-slate-300',
  cancelled: 'bg-rose-100 text-rose-800 border-rose-300',
};

export default function UpcomingBookings({ enabled = true }) {
  const queryClient = useQueryClient();

  // Only open sessions are shown, so the status filter runs on the server and
  // the list is read a page at a time.
  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['coachBookings'],
    enabled,
    initialPageParam: null,
    queryFn: ({ pageParam }) => base44.entities.CoachBooking
      .filter(
        { status: { $nin: ['cancelled', 'completed'] } },
        { sort: '-requested_date', limit: 50, ...(pageParam ? { cursor: pageParam } : {}) }
      )
      .catch(() => ({ items: [], has_more: false })),
    getNextPageParam: (lastPage) => (lastPage.has_more ? lastPage.next_cursor : undefined),
    staleTime: 30_000,
  });

  const cancelMutation = useMutation({
    mutationFn: (/** @type {string} */ id) => base44.entities.CoachBooking.update(id, { status: 'cancelled' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coachBookings'] });
      toast({ title: 'Session cancelled' });
    },
    onError: (err) => {
      toast({
        title: 'Could not cancel',
        description: err?.message || 'Please try again.',
        variant: 'destructive',
      });
    },
  });

  if (isLoading) return null;

  const active = (data?.pages || []).flatMap((page) => page.items || []);
  if (active.length === 0) return null;

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-extrabold text-slate-900">Your upcoming sessions</h2>
      {active.map((b) => {
        const dateLabel = b.requested_date
          ? format(parseISO(b.requested_date), 'EEE, MMM d, yyyy')
          : '—';
        const FormatIcon = b.session_format === 'phone' ? Phone : Video;
        return (
          <Card key={b.id} className="bg-white border-2 border-slate-200">
            <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2 text-slate-900 font-bold">
                  <Calendar className="h-4 w-4 text-rose-600" aria-hidden="true" />
                  <span>{dateLabel}</span>
                  <span className="text-slate-400">·</span>
                  <Clock className="h-4 w-4 text-sky-600" aria-hidden="true" />
                  <span>{b.requested_time}</span>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-sm text-slate-700 font-medium">
                  <FormatIcon className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                  <span>{b.session_format === 'phone' ? 'Phone' : 'Video'} · {b.duration_minutes || 30} min</span>
                  <span className="text-slate-400">·</span>
                  <span>{TOPIC_LABELS[b.topic] || b.topic}</span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge className={`border ${STATUS_STYLES[b.status] || STATUS_STYLES.requested} capitalize font-bold`}>
                  {b.status}
                </Badge>
                <AddToGoogleCalendarButton booking={b} />
                <Button
                  variant="outline"
                  size="sm"
                  disabled={cancelMutation.isPending}
                  onClick={() => cancelMutation.mutate(b.id)}
                  className="border-2 border-slate-300 text-slate-800 hover:bg-slate-100"
                >
                  <X className="h-4 w-4 mr-1" aria-hidden="true" /> Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
      {hasNextPage && (
        <Button variant="outline" disabled={isFetchingNextPage} onClick={() => fetchNextPage()}>
          {isFetchingNextPage ? 'Loading...' : 'Load more sessions'}
        </Button>
      )}
    </div>
  );
}