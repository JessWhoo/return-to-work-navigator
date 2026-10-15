import React, { useMemo, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, X, Loader2, Plus, MessageSquare, ArrowRight } from 'lucide-react';
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

const CORE_WELLNESS_GUIDES = [
  {
    id: 'fatigue-pacing',
    category: 'Fatigue Management',
    title: 'Managing Cancer-Related Fatigue & Energy Pacing at Work',
    summary:
      'Schedule demanding cognitive tasks during your peak morning energy window, take 5-minute restorative micro-breaks every 90 minutes, and use a phased part-time schedule during your first month back.',
    to: '/WellbeingHub?tab=energy',
    cta: 'Open energy tracker',
  },
  {
    id: 'cognitive-fog',
    category: 'Workplace Accommodations',
    title: 'Practical Strategies for Chemo Brain & Memory Changes',
    summary:
      'Request written meeting agendas and follow-up action items, work from a quiet or remote environment for deep-focus projects, and use single-tasking checklists to reduce cognitive overload.',
    to: '/ChemoBrainGuide',
    cta: 'Read the guide',
  },
  {
    id: 'emotional-readiness',
    category: 'Emotional Well-Being',
    title: 'Navigating Return-to-Work Anxiety & Coworker Boundaries',
    summary:
      'Prepare a short, comfortable 1-sentence script for coworker check-ins, practice box breathing before high-stakes supervisor meetings, and lean on oncology social workers or peer support groups.',
    to: '/WellbeingHub?tab=emotional',
    cta: 'Open emotional support',
  },
  {
    id: 'sleep-nutrition',
    category: 'Sleep, Rest & Nutrition',
    title: 'Restorative Sleep & Desk Nutrition for Sustained Stamina',
    summary:
      'Keep protein-rich snacks and hydration at your workstation, protect a consistent wind-down routine after workdays, and incorporate gentle 10-minute walks to counter treatment stiffness.',
    to: '/WellbeingHub?tab=energy',
    cta: 'Open energy & rest',
  },
];

export default function WellnessLibrary({ embedded = false }) {
  useSEO({
    title: 'Cancer Fatigue, Sleep & Workplace Wellness Library',
    description:
      'Evidence-based wellness guides for cancer survivors returning to work: manage chemo brain, cancer-related fatigue, sleep disruption, nutrition, and stress.',
    path: '/WellnessLibrary',
    enabled: !embedded,
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
      {!embedded && (
        <PageHeader
          eyebrow="Wellness Library"
          title="Cancer Survivorship & Workplace Wellness Library"
          subtitle="Search trusted fatigue, sleep, nutrition, and emotional wellness resources by topic, and rate how helpful each one was for fellow survivors."
        />
      )}

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

      {/* Core Evidence-Based Workplace Wellness Guides (always rendered for immediate reader & crawler value) */}
      <section aria-label="Core workplace wellness guides" className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {CORE_WELLNESS_GUIDES.map((guide) => (
          <Card key={guide.id} className="nv-card--muted">
            <CardContent className="p-5 space-y-2">
              <span className="nv-eyebrow nv-eyebrow--primary">{guide.category}</span>
              <h2 className="font-heading text-lg font-bold text-brand-text">{guide.title}</h2>
              <p className="text-sm text-brand-muted-foreground leading-relaxed">{guide.summary}</p>
              <Button asChild variant="outline" size="sm" className="mt-2 w-fit">
                <Link to={guide.to}>
                  {guide.cta}
                  <ArrowRight className="h-4 w-4 ml-1" aria-hidden="true" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Results */}
      {isLoading ? (
        <div className="flex justify-center py-12">
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