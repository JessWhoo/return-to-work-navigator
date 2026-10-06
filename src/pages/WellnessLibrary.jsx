import React, { useMemo, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, HeartPulse, X, Loader2, Plus, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import WellnessResourceCard from '@/components/wellness/WellnessResourceCard';
import LibraryErrorPanel from '@/components/wellness/LibraryErrorPanel';
import AddWellnessResourceDialog from '@/components/wellness/AddWellnessResourceDialog';
import WellnessResourceFeedbackDialog from '@/components/wellness/WellnessResourceFeedbackDialog';
import { useWellnessLibrary } from '@/hooks/useWellnessLibrary';
import { useAuth } from '@/lib/AuthContext';
import useSEO from '@/hooks/useSEO';

const TOPICS = [
  { id: 'all', label: 'All Topics' },
  { id: 'fatigue_management', label: 'Fatigue Management' },
  { id: 'legal_rights', label: 'Legal Rights' },
  { id: 'emotional_wellbeing', label: 'Emotional Well-Being' },
  { id: 'workplace_accommodations', label: 'Workplace Accommodations' },
  { id: 'nutrition_movement', label: 'Nutrition & Movement' },
  { id: 'sleep_rest', label: 'Sleep & Rest' },
];

export default function WellnessLibrary() {
  useSEO({
    title: 'Wellness Resource Library',
    description:
      'Trusted wellness resources for cancer survivors returning to work — fatigue management, sleep, nutrition, movement and emotional well-being.',
    path: '/WellnessLibrary',
  });
  const { isAuthenticated, user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [search, setSearch] = useState('');
  const [topic, setTopic] = useState('all');
  const [addOpen, setAddOpen] = useState(false);
  const [feedbackResource, setFeedbackResource] = useState(null);

  const {
    data, isLoading, isError, refetch, isRefetching,
    fetchNextPage, hasNextPage, isFetchingNextPage,
  } = useWellnessLibrary(topic);

  const resources = useMemo(() => data?.pages.flatMap((p) => p.resources) ?? [], [data]);
  const ratingStats = useMemo(() => {
    const map = {};
    data?.pages.forEach((p) => p.ratings.forEach((r) => { map[r.resource_id] = r; }));
    return map;
  }, [data]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return resources;
    return resources.filter((r) =>
      [r.title, r.summary, r.source, r.topic].join(' ').toLowerCase().includes(q),
    );
  }, [resources, search]);

  // Keep the newly added resource visible: if the active topic filter excludes
  // it, fall back to All Topics.
  const handleResourceAdded = (resource) => {
    if (topic !== 'all' && resource?.topic !== topic) setTopic('all');
  };

  // Feedback is saved to the signed-in account, so visitors sign in first.
  const openResourceFeedback = (resource) => {
    if (!isAuthenticated) {
      base44.auth.redirectToLogin(window.location.pathname);
      return;
    }
    setFeedbackResource(resource);
  };


  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 border-2 border-emerald-300">
          <HeartPulse className="h-4 w-4 text-emerald-700" />
          <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700">
            Wellness Library
          </span>
        </div>
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-emerald-700 via-teal-600 to-violet-700 bg-clip-text text-transparent">
          Wellness Resource Library
        </h1>
        <p className="text-lg font-medium text-slate-800 max-w-2xl mx-auto">
          Search trusted wellness resources by topic, and rate how helpful each one was for fellow survivors.
        </p>
      </div>

      {/* Search + topic filters */}
      <Card className="bg-white border-2 border-slate-300 shadow-md">
        <CardContent className="p-5">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search resources (e.g. fatigue, FMLA, sleep)..."
              className="pl-12 pr-12 h-12 text-base border-2 border-slate-300 focus-visible:border-emerald-500"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-slate-100"
                aria-label="Clear search"
              >
                <X className="h-4 w-4 text-slate-600" />
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {TOPICS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTopic(t.id)}
                className={`px-3.5 py-1.5 rounded-full text-sm font-bold border-2 transition-all ${
                  topic === t.id
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-transparent shadow-md'
                    : 'bg-white text-slate-800 border-slate-300 hover:border-emerald-400'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="mt-4">
            <Link
              to="/MyFeedback"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-800 hover:text-emerald-900 underline underline-offset-2"
            >
              <MessageSquare className="h-4 w-4" />
              My saved feedback
            </Link>
          </div>
          {isAdmin && (
            <div className="mt-4 pt-4 border-t-2 border-slate-200">
              <Button
                onClick={() => setAddOpen(true)}
                className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add resource
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-slate-200 border-t-emerald-600 rounded-full animate-spin" />
        </div>
      ) : isError ? (
        <LibraryErrorPanel onRetry={() => refetch()} retrying={isRefetching} />
      ) : filtered.length === 0 ? (
        <Card className="bg-white border-2 border-slate-300">
          <CardContent className="p-12 text-center">
            <Search className="h-10 w-10 text-slate-400 mx-auto mb-3" />
            <h3 className="text-lg font-extrabold text-slate-900">No resources found</h3>
            <p className="text-sm font-medium text-slate-700 mt-1">
              Try a different search term or topic{hasNextPage ? ', or load more resources below' : ''}.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((resource) => {
            const stats = ratingStats[resource.id];
            return (
              <WellnessResourceCard
                key={resource.id}
                resource={resource}
                avgRating={stats?.average || 0}
                ratingCount={stats?.count || 0}
                myRating={stats?.my_rating || 0}
                myNote={stats?.my_note || ''}
                onFeedback={openResourceFeedback}
              />
            );
          })}
        </div>
      )}

      {!isLoading && !isError && hasNextPage && (
        <div className="flex justify-center pt-2">
          <Button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            variant="outline"
            className="border-2 border-emerald-500 text-emerald-800 font-bold hover:bg-emerald-50"
          >
            {isFetchingNextPage && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Load more resources
          </Button>
        </div>
      )}

      <AddWellnessResourceDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onCreated={handleResourceAdded}
      />

      {feedbackResource && (
        <WellnessResourceFeedbackDialog
          key={feedbackResource.id}
          resource={feedbackResource}
          open
          onOpenChange={(open) => { if (!open) setFeedbackResource(null); }}
        />
      )}
    </div>
  );
}