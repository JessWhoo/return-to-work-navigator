import React, { useMemo, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, X, Loader2, Plus, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import WellnessResourceCard from '@/components/wellness/WellnessResourceCard';
import LibraryErrorPanel from '@/components/wellness/LibraryErrorPanel';
import AddWellnessResourceDialog from '@/components/wellness/AddWellnessResourceDialog';
import WellnessResourceFeedbackDialog from '@/components/wellness/WellnessResourceFeedbackDialog';
import { useWellnessLibrary } from '@/hooks/useWellnessLibrary';
import { useAuth } from '@/lib/AuthContext';
import PageHeader from '@/components/brand/PageHeader';
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
      <PageHeader
        eyebrow="Wellness Library"
        title="Wellness Resource Library"
        subtitle="Search trusted wellness resources by topic, and rate how helpful each one was for fellow survivors."
      />

      {/* Search + topic filters */}
      <Card>
        <CardContent className="p-5">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search resources (e.g. fatigue, FMLA, sleep)..."
              className="nv-input h-12 pl-12 pr-12 text-base"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-pill p-1.5 hover:bg-brand-muted"
                aria-label="Clear search"
              >
                <X className="h-4 w-4 text-brand-muted-foreground" />
              </button>
            )}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {TOPICS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTopic(t.id)}
                className={`nv-btn nv-btn--sm ${topic === t.id ? 'nv-btn--secondary' : 'nv-btn--outline'}`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="mt-4">
            <Link
              to="/MyFeedback"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-primary underline underline-offset-2"
            >
              <MessageSquare className="h-4 w-4" />
              My saved feedback
            </Link>
          </div>
          {isAdmin && (
            <div className="mt-4 border-t border-brand-border pt-4">
              <Button onClick={() => setAddOpen(true)} className="w-full sm:w-auto">
                <Plus className="h-4 w-4" />
                Add resource
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-border border-t-brand-primary" />
        </div>
      ) : isError ? (
        <LibraryErrorPanel onRetry={() => refetch()} retrying={isRefetching} />
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Search className="mx-auto mb-3 h-10 w-10 text-brand-muted-foreground" />
            <h3 className="font-heading text-lg font-bold text-brand-text">No resources found</h3>
            <p className="mt-1 text-sm text-brand-muted-foreground">
              Try a different search term or topic{hasNextPage ? ', or load more resources below' : ''}.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
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
          >
            {isFetchingNextPage && <Loader2 className="h-4 w-4 animate-spin" />}
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