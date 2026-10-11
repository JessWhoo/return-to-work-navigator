import React, { useState, useEffect, Component } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, ExternalLink, Star,
  Bookmark, MessageCircle, BookmarkCheck, TrendingUp, ThumbsUp, ThumbsDown, Sparkles, X, Tag,
  SlidersHorizontal, ChevronDown, ChevronUp
} from 'lucide-react';
import { toast } from 'sonner';
import { resources } from '../components/resources/resourcesData';
import AIPersonalizedEngine from '../components/resources/AIPersonalizedEngine';
import AIRecommendations from '../components/resources/AIRecommendations';
import TrendingResources from '../components/resources/TrendingResources';
import RecentlyViewed from '../components/resources/RecentlyViewed';
import EnhancedResourceReviewDialog from '../components/resources/EnhancedResourceReviewDialog';
import SuggestResourceDialog from '../components/resources/SuggestResourceDialog';
import ResourceExportDialog from '../components/resources/ResourceExportDialog';
import ShareKitDialog from '../components/resources/ShareKitDialog';
import ResourceTagEditor from '../components/resources/ResourceTagEditor';
import CategoryJumpNav, { categorySlug } from '../components/resources/CategoryJumpNav';
import RecoveryNeedsFilter, { resourceMatchesNeeds } from '../components/resources/RecoveryNeedsFilter';
import ResourceSummary from '../components/resources/ResourceSummary';
import ResourceComparisonTool from '../components/resources/ResourceComparisonTool';
import ResourceQA from '../components/resources/ResourceQA';
import EmailToHRButton from '../components/resources/EmailToHRButton';
import useSEO from '@/hooks/useSEO';
import { useUserProgress } from '@/hooks/useUserProgress';
import { useAuth } from '@/lib/AuthContext';

class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() { return this.state.hasError ? null : this.props.children; }
}

export default function Resources() {
  const { isAuthenticated, isLoadingAuth } = useAuth();
  useSEO({
    title: 'Resource Library',
    description: 'Browse curated articles, videos, workshops, and support groups for cancer survivors navigating their return to work.',
    path: '/Resources'
  });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [selectedStage, setSelectedStage] = useState('all');
  const [selectedQuickTag, setSelectedQuickTag] = useState('all');
  const [selectedNeeds, setSelectedNeeds] = useState([]);
  const [showBookmarked, setShowBookmarked] = useState(false);
  const [showAIRecommended, setShowAIRecommended] = useState(false);
  const [showUseful, setShowUseful] = useState(false);
  const [showNotRelevant, setShowNotRelevant] = useState(false);
  const [showTagged, setShowTagged] = useState(false);
  const [sortBy, setSortBy] = useState('recommended');
  // On phones the filter controls are collapsed so the resource list starts higher up.
  const [showFilters, setShowFilters] = useState(false);

  // Track search queries
  useEffect(() => {
    if (searchQuery.trim()) {
      const timer = setTimeout(() => {
        base44.analytics.track({
          eventName: 'resource_library_searched',
          properties: {
            query: searchQuery,
            query_length: searchQuery.length
          }
        });
      }, 1000); // Debounce to avoid tracking every keystroke
      return () => clearTimeout(timer);
    }
  }, [searchQuery]);

  // Track filter usage
  useEffect(() => {
    if (selectedCategory !== 'all' || selectedType !== 'all' || selectedTopic !== 'all' || selectedStage !== 'all' || showBookmarked || showAIRecommended || showUseful || showNotRelevant) {
      base44.analytics.track({
        eventName: 'resource_library_filtered',
        properties: {
          category: selectedCategory,
          type: selectedType,
          topic: selectedTopic,
          stage: selectedStage,
          show_bookmarked: showBookmarked,
          show_ai_recommended: showAIRecommended,
          show_useful: showUseful,
          show_not_relevant: showNotRelevant
        }
      });
    }
  }, [selectedCategory, selectedType, selectedTopic, selectedStage, showBookmarked, showAIRecommended, showUseful, showNotRelevant]);

  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
    enabled: !isLoadingAuth && !!isAuthenticated,
  });

  const { data: progress } = useUserProgress({
    completed_checklist_items: [],
    journey_stage: 'planning',
    bookmarked_resources: []
  });

  const toggleBookmarkMutation = useMutation({
    mutationFn: async (resourceId) => {
      const currentBookmarks = progress?.bookmarked_resources || [];
      const isBookmarked = currentBookmarks.includes(resourceId);
      const updatedBookmarks = isBookmarked
        ? currentBookmarks.filter(id => id !== resourceId)
        : [...currentBookmarks, resourceId];

      // Track resource bookmarking
      base44.analytics.track({
        eventName: 'resource_bookmarked',
        properties: {
          resource_id: resourceId,
          action: isBookmarked ? 'removed' : 'added',
          total_bookmarks: updatedBookmarks.length
        }
      });

      return await base44.entities.UserProgress.update(progress.id, {
        bookmarked_resources: updatedBookmarks
      });
    },
    // Optimistic update — flip the bookmark instantly, roll back if the server rejects.
    onMutate: async (resourceId) => {
      await queryClient.cancelQueries({ queryKey: ['userProgress'] });
      const previous = queryClient.getQueryData(['userProgress']);
      queryClient.setQueryData(['userProgress'], (old) => {
        if (!old) return old;
        const currentBookmarks = old.bookmarked_resources || [];
        const isBookmarked = currentBookmarks.includes(resourceId);
        const updatedBookmarks = isBookmarked
          ? currentBookmarks.filter(id => id !== resourceId)
          : [...currentBookmarks, resourceId];
        return { ...old, bookmarked_resources: updatedBookmarks };
      });
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['userProgress'], context.previous);
      }
      toast.error('Could not update bookmark');
    },
    onSuccess: () => {
      toast.success('Bookmark updated');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['userProgress'] });
    }
  });

  const rateResourceMutation = useMutation({
    mutationFn: async ({ resourceId, rating }) => {
      const currentRatings = progress?.resource_ratings || {};
      const updatedRatings = { ...currentRatings, [resourceId]: rating };
      
      return await base44.entities.UserProgress.update(progress.id, {
        resource_ratings: updatedRatings
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['userProgress']);
      toast.success('Rating saved');
    }
  });

  const logInteraction = async (resourceId, event) => {
    if (!progress?.id) return;
    const newInteraction = { resource_id: resourceId, event, timestamp: new Date().toISOString() };
    const updated = [...(progress.resource_interactions || []).slice(-99), newInteraction]; // keep last 100
    await base44.entities.UserProgress.update(progress.id, { resource_interactions: updated });
    queryClient.invalidateQueries(['userProgress']);
  };

  const handleDiscussWithCoach = (resource) => {
    base44.analytics.track({
      eventName: 'resource_discussed_with_coach',
      properties: {
        resource_name: resource.name,
        resource_category: resource.category || 'unknown',
        resource_type: resource.type
      }
    });
    logInteraction(resource.id, 'ask_coach');
    const message = `I'd like to learn more about this resource:\n\n${resource.name} (${resource.org})\n${resource.description}\n\nCan you help me understand how to use this resource for my return-to-work journey?`;
    localStorage.setItem('pendingCoachMessage', message);
    navigate(createPageUrl('Coach'));
  };

  const isBookmarked = (resourceId) => {
    return progress?.bookmarked_resources?.includes(resourceId) || false;
  };

  const getRating = (resourceId) => {
    return progress?.resource_ratings?.[resourceId] || 0;
  };

  const handleRate = (resourceId, rating) => {
    rateResourceMutation.mutate({ resourceId, rating });
  };

  // Fetch all reviews for rating display
  const { data: allReviews } = useQuery({
    queryKey: ['all-resource-reviews'],
    queryFn: async () => {
      return await base44.entities.ResourceReview.list();
    }
  });

  const getResourceRating = (resourceId) => {
    if (!allReviews) return null;
    const resourceReviews = allReviews.filter(r => r.resource_id === resourceId);
    if (resourceReviews.length === 0) return null;
    const avg = resourceReviews.reduce((sum, r) => sum + r.rating, 0) / resourceReviews.length;
    return {
      average: avg,
      count: resourceReviews.length
    };
  };

  // Build AI recommended IDs from the last cached recommendations (stored via query cache)
  const aiRecData = queryClient.getQueryData(['aiRecommendations',
    progress?.id,
    Object.keys(progress?.resource_tags || {}).length,
    (progress?.resource_interactions || []).length
  ]);
  const aiRecommendedIds = new Set((aiRecData?.recommendations || []).map(r => r.resource_id));

  // Interaction counts per resource for 'most_viewed' sort
  const interactionCounts = {};
  (progress?.resource_interactions || []).forEach(i => {
    interactionCounts[i.resource_id] = (interactionCounts[i.resource_id] || 0) + 1;
  });

  const filteredResources = resources.map(category => ({
    ...category,
    items: category.items
      .map((item, idx) => {
        const resourceId = `${category.category}-${idx}`;
        const communityRating = getResourceRating(resourceId);
        return {
          ...item,
          id: resourceId,
          rating: getRating(resourceId),
          communityRating
        };
      })
      .filter(item => {
        const query = searchQuery.toLowerCase().trim();
        const userTag = progress?.resource_tags?.[item.id];

        const aiTags = progress?.resource_ai_tags?.[item.id] || [];
        const customTags = progress?.resource_custom_tags?.[item.id] || [];

        const matchesSearch = !query ||
          item.name?.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query) ||
          item.org?.toLowerCase().includes(query) ||
          item.topics?.some(topic => topic?.toLowerCase().includes(query)) ||
          item.type?.toLowerCase().includes(query) ||
          userTag?.toLowerCase().includes(query) ||
          aiTags.some(t => t.toLowerCase().includes(query)) ||
          customTags.some(t => t.toLowerCase().includes(query));

        const matchesBookmark = !showBookmarked || isBookmarked(item.id);
        const matchesAI = !showAIRecommended || aiRecommendedIds.has(item.id);
        const matchesUseful = !showUseful || userTag === 'useful';
        const matchesNotRelevant = !showNotRelevant || userTag === 'not_relevant';
        const matchesType = selectedType === 'all' || item.type === selectedType;
        const matchesTopic = selectedTopic === 'all' || item.topics?.includes(selectedTopic);
        const matchesStage = selectedStage === 'all' || item.stages?.includes(selectedStage);
        const matchesTagged = !showTagged || (aiTags.length > 0 || customTags.length > 0);
        const matchesNeeds = resourceMatchesNeeds(item, selectedNeeds, [...aiTags, ...customTags]);

        const matchesQuickTag = selectedQuickTag === 'all' || (() => {
          const tagQ = selectedQuickTag.toLowerCase();
          const haystack = [
            item.name,
            item.description,
            item.org,
            ...(item.topics || []),
            ...aiTags,
            ...customTags,
          ].filter(Boolean).join(' ').toLowerCase();
          return haystack.includes(tagQ);
        })();

        return matchesSearch && matchesBookmark && matchesAI && matchesUseful && matchesNotRelevant && matchesType && matchesTopic && matchesStage && matchesTagged && matchesQuickTag && matchesNeeds;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return (getRating(b.id) || 0) - (getRating(a.id) || 0);
        if (sortBy === 'community_rating') return ((b.communityRating?.average) || 0) - ((a.communityRating?.average) || 0);
        if (sortBy === 'most_reviewed') return (b.communityRating?.count || 0) - (a.communityRating?.count || 0);
        if (sortBy === 'most_viewed') return (interactionCounts[b.id] || 0) - (interactionCounts[a.id] || 0);
        if (sortBy === 'most_recent') {
          // Sort by last interaction timestamp
          const getLastSeen = (id) => {
            const hits = (progress?.resource_interactions || []).filter(i => i.resource_id === id);
            return hits.length ? Math.max(...hits.map(i => new Date(i.timestamp).getTime())) : 0;
          };
          return getLastSeen(b.id) - getLastSeen(a.id);
        }
        return 0;
      })
  })).filter(category =>
    (selectedCategory === 'all' || category.category === selectedCategory) &&
    category.items.length > 0
  );

  const allTypes = [...new Set(resources.flatMap(cat => cat.items.map(item => item.type)))].sort();
  const allTopics = [...new Set(resources.flatMap(cat => cat.items.flatMap(item => item.topics || [])))].sort();
  const allStages = [
    { value: 'planning', label: 'Planning' },
    { value: 'first_week', label: 'First Week' },
    { value: 'ongoing', label: 'Ongoing' },
    { value: 'completed', label: 'Completed' }
  ];

  const totalResources = resources.reduce((sum, cat) => sum + cat.items.length, 0);
  const totalRated = Object.keys(progress?.resource_ratings || {}).length;

  const activeFilterCount = [
    selectedCategory !== 'all',
    selectedType !== 'all',
    selectedTopic !== 'all',
    selectedStage !== 'all',
    selectedQuickTag !== 'all',
    showBookmarked,
    showAIRecommended,
    showUseful,
    showNotRelevant,
    showTagged,
    sortBy !== 'recommended',
    selectedNeeds.length > 0,
  ].filter(Boolean).length;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="font-heading text-4xl font-extrabold text-foreground sm:text-5xl">
          Resource Library
        </h1>
        <p className="mx-auto max-w-2xl text-lg font-medium text-muted-foreground">
          {totalResources} curated resources • {progress?.bookmarked_resources?.length || 0} saved • {totalRated} rated
        </p>
        <div className="flex flex-wrap justify-center gap-2 pt-2">
          {[
            { label: 'Articles', type: 'ARTICLE' },
            { label: 'Videos', type: 'VIDEO' },
            { label: 'Workshops', type: 'WORKSHOP' },
            { label: 'Meditations', type: 'MEDITATION' },
            { label: 'Expert Interviews', type: 'PODCAST' },
            { label: 'Support Groups', type: 'SUPPORT_GROUP' },
          ].map(({ label, type }) => (
            <button
              key={type}
              onClick={() => setSelectedType(selectedType === type ? 'all' : type)}
              className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors cursor-pointer ${
                selectedType === type
                  ? 'bg-primary text-white border-primary'
                  : 'bg-surface text-muted-foreground border-border hover:bg-muted hover:text-foreground'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="pt-4 flex flex-wrap justify-center gap-3">
          <SuggestResourceDialog />
          <ResourceExportDialog
            resources={resources}
            bookmarkedIds={progress?.bookmarked_resources || []}
            progress={progress}
          />
          <ShareKitDialog
            resources={resources}
            bookmarkedIds={progress?.bookmarked_resources || []}
            notes={progress?.notes || ''}
          />
        </div>
      </div>

      {/* Recovery Needs Filter */}
      <RecoveryNeedsFilter
        selected={selectedNeeds}
        onToggle={(id) => {
          setSelectedNeeds((prev) =>
            prev.includes(id) ? prev.filter((n) => n !== id) : [...prev, id]
          );
          base44.analytics.track({
            eventName: 'resource_recovery_need_toggled',
            properties: { need_id: id }
          });
        }}
        onClear={() => setSelectedNeeds([])}
        resultCount={
          resources.reduce((sum, cat) => sum + cat.items.filter((item, idx) => {
            const id = `${cat.category}-${idx}`;
            const aiTags = progress?.resource_ai_tags?.[id] || [];
            const customTags = progress?.resource_custom_tags?.[id] || [];
            return resourceMatchesNeeds(item, selectedNeeds, [...aiTags, ...customTags]);
          }).length, 0)
        }
      />

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4">
            {/* Primary Search */}
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-hover:text-primary" />
              <Input
                placeholder="Search by title, topic, tag, organization..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Phones: collapse everything but the search box, with an active-filter count */}
            <Button
              variant="outline"
              onClick={() => setShowFilters((v) => !v)}
              aria-expanded={showFilters}
              className="justify-between md:hidden"
            >
              <span className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Filters &amp; sort
                {activeFilterCount > 0 && (
                  <Badge className="bg-primary text-white">{activeFilterCount}</Badge>
                )}
              </span>
              {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>

            <div className={showFilters ? 'block space-y-4' : 'hidden md:block md:space-y-4'}>
            {/* Advanced Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="nv-input px-3 py-2 text-sm cursor-pointer"
              >
                <option value="all">All Categories</option>
                {resources.map(cat => (
                  <option key={cat.category} value={cat.category}>{cat.category}</option>
                ))}
              </select>

              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="nv-input px-3 py-2 text-sm cursor-pointer"
              >
                <option value="all">All Types</option>
                {allTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>

              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="nv-input px-3 py-2 text-sm cursor-pointer"
              >
                <option value="all">All Topics</option>
                {allTopics.map(topic => (
                  <option key={topic} value={topic}>{topic}</option>
                ))}
              </select>

              <select
                value={selectedStage}
                onChange={(e) => setSelectedStage(e.target.value)}
                className="nv-input px-3 py-2 text-sm cursor-pointer"
              >
                <option value="all">All Stages</option>
                {allStages.map(stage => (
                  <option key={stage.value} value={stage.value}>{stage.label}</option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="nv-input px-3 py-2 text-sm cursor-pointer"
              >
                <option value="recommended">Default Order</option>
                <option value="rating">My Highest Rated</option>
                <option value="community_rating">Community Rated</option>
                <option value="most_reviewed">Most Reviewed</option>
                <option value="most_viewed">Most Viewed by Me</option>
                <option value="most_recent">Recently Viewed</option>
              </select>
            </div>

            {/* Quick Tag Chips */}
            <div className="flex items-center flex-wrap gap-2 pt-1">
              <span className="mr-1 flex items-center text-xs font-semibold text-muted-foreground">
                <Tag className="h-3.5 w-3.5" />
                Quick tags:
              </span>
              {['ADA', 'FMLA', 'disclosure', 'flexibility', 'accommodations', 'fatigue', 'mental health', 'remote work', 'return to work'].map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedQuickTag(selectedQuickTag === tag ? 'all' : tag)}
                  className={`inline-flex items-center rounded-pill border px-3 py-1 text-xs font-medium transition-all ${
                    selectedQuickTag === tag
                      ? 'border-transparent bg-primary text-white shadow-sm'
                      : 'border-border bg-surface text-muted-foreground hover:bg-muted hover:border-primary'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Quick Filters */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={showBookmarked ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowBookmarked(!showBookmarked)}
                >
                  <Bookmark className="h-4 w-4 mr-2" />
                  Saved ({progress?.bookmarked_resources?.length || 0})
                </Button>

                <Button
                  variant={showAIRecommended ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowAIRecommended(!showAIRecommended)}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  AI Recommended
                </Button>

                <Button
                  variant={showUseful ? "default" : "outline"}
                  size="sm"
                  onClick={() => { setShowUseful(!showUseful); if (showNotRelevant) setShowNotRelevant(false); }}
                >
                  <ThumbsUp className="h-4 w-4 mr-2" />
                  Useful ({Object.values(progress?.resource_tags || {}).filter(t => t === 'useful').length})
                </Button>

                <Button
                  variant={showNotRelevant ? "default" : "outline"}
                  size="sm"
                  onClick={() => { setShowNotRelevant(!showNotRelevant); if (showUseful) setShowUseful(false); }}
                >
                  <ThumbsDown className="h-4 w-4 mr-2" />
                  Not for Me ({Object.values(progress?.resource_tags || {}).filter(t => t === 'not_relevant').length})
                </Button>

                <Button
                  variant={showTagged ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowTagged(!showTagged)}
                >
                  <Tag className="h-4 w-4 mr-2" />
                  Tagged Only
                </Button>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {/* Quick Topic Filters */}
                {['managing fatigue', 'stress reduction', 'workplace rights', 'accommodations'].map(topic => (
                  <Button
                    key={topic}
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedTopic(selectedTopic === topic ? 'all' : topic)}
                    className={`text-muted-foreground ${
                      selectedTopic === topic ? 'bg-muted border-primary text-primary' : ''
                    }`}
                  >
                    {topic}
                  </Button>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setSelectedType('all');
                    setSelectedTopic('all');
                    setSelectedStage('all');
                    setShowBookmarked(false);
                    setShowAIRecommended(false);
                    setShowUseful(false);
                    setShowNotRelevant(false);
                    setShowTagged(false);
                    setSelectedQuickTag('all');
                    setSelectedNeeds([]);
                  }}
                  className=""
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear All
                </Button>
              </div>
            </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resource Comparison Tool */}
      <ErrorBoundary>
        <ResourceComparisonTool
          progress={progress}
          allResources={resources}
        />
      </ErrorBoundary>

      {/* Recently Viewed */}
      <ErrorBoundary>
        <RecentlyViewed
          progress={progress}
          allResources={resources}
          onBookmark={(resourceId) => toggleBookmarkMutation.mutate(resourceId)}
          isBookmarked={isBookmarked}
        />
      </ErrorBoundary>

      {/* AI-Powered Smart Recommendations */}
      <ErrorBoundary>
        <AIRecommendations
          progress={progress}
          allResources={resources}
          onBookmark={(resourceId) => toggleBookmarkMutation.mutate(resourceId)}
          onDiscussWithCoach={handleDiscussWithCoach}
          isBookmarked={isBookmarked}
          getRating={getRating}
        />
      </ErrorBoundary>

      {/* Legacy AI Engine */}
      <ErrorBoundary>
        <AIPersonalizedEngine
          progress={progress}
          resources={resources}
          onBookmark={(resourceId) => toggleBookmarkMutation.mutate(resourceId)}
          isBookmarked={isBookmarked}
          onDiscuss={handleDiscussWithCoach}
        />
      </ErrorBoundary>

      {/* Trending Resources */}
      <ErrorBoundary>
        <TrendingResources
          allResources={resources}
          onBookmark={(resourceId) => toggleBookmarkMutation.mutate(resourceId)}
          onDiscussWithCoach={handleDiscussWithCoach}
          isBookmarked={isBookmarked}
          getRating={getRating}
        />
      </ErrorBoundary>

      <CategoryJumpNav categories={filteredResources.map((c) => c.category)} />

      {/* Resources by Category */}
      <div className="space-y-8">
        {filteredResources.map((category) => {
          if (category.items.length === 0) return null;
          
          const Icon = category.icon;
          return (
            <div
              key={category.category}
              id={categorySlug(category.category)}
              className="space-y-4"
              style={{ scrollMarginTop: 'var(--cat-scroll-offset, 190px)' }}
            >
              <div className="flex items-center space-x-3 rounded-brand-lg border border-border bg-muted p-5 transition-all">
                <div className="rounded-brand bg-primary p-3 shadow-brand-sm">
                  <Icon className="h-7 w-7 text-white" />
                </div>
                <h2 className="font-heading text-2xl font-extrabold text-foreground">{category.category}</h2>
                <Badge variant="secondary" className="ml-auto font-bold">
                  {category.items.length} resources
                </Badge>
              </div>

              <div className="grid gap-5">
                {category.items.map((resource) => {
                  const bookmarked = isBookmarked(resource.id);
                  return (
                    <Card key={resource.id} className="group overflow-hidden">
                      <CardContent className="pt-6 relative">
                        <div className="absolute left-0 top-0 h-full w-1 bg-primary"></div>
                        <div className="pl-3 space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                          <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2 flex-wrap">
                            <Badge className="bg-primary text-white shadow-sm">
                              {resource.type}
                            </Badge>
                            {resource.topics?.slice(0, 2).map(topic => (
                              <Badge key={topic} variant="outline" className="text-xs">
                                {topic}
                              </Badge>
                            ))}
                            {bookmarked && (
                              <Badge variant="secondary">
                                <BookmarkCheck className="h-3 w-3" />
                                Saved
                              </Badge>
                            )}
                            {resource.communityRating && resource.communityRating.average >= 4 && (
                              <Badge variant="secondary">
                                <TrendingUp className="h-3 w-3" />
                                Highly Rated
                              </Badge>
                            )}
                            {progress?.resource_tags?.[resource.id] === 'useful' && (
                              <Badge variant="secondary">
                                <ThumbsUp className="h-3 w-3" />
                                Useful
                              </Badge>
                            )}
                            {progress?.resource_tags?.[resource.id] === 'not_relevant' && (
                              <Badge variant="outline" className="border-destructive text-destructive">
                                <ThumbsDown className="h-3 w-3" />
                                Not for Me
                              </Badge>
                            )}
                            {aiRecommendedIds.has(resource.id) && (
                              <Badge variant="secondary">
                                <Sparkles className="h-3 w-3" />
                                AI Pick
                              </Badge>
                            )}
                          </div>
                              <h3 className="mb-1 text-xl font-bold text-foreground transition-colors group-hover:text-primary">{resource.name}</h3>
                              <p className="mb-2 text-sm font-medium text-primary">{resource.org}</p>
                              <p className="text-sm leading-relaxed text-muted-foreground">{resource.description}</p>

                              {/* AI + Custom Tag Display */}
                              {(() => {
                                const aiT = progress?.resource_ai_tags?.[resource.id] || [];
                                const customT = progress?.resource_custom_tags?.[resource.id] || [];
                                const allT = [...new Set([...aiT, ...customT])];
                                return allT.length > 0 ? (
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {aiT.map(tag => (
                                      <Badge key={tag} className="border-border bg-muted text-xs text-primary">
                                        <Sparkles className="h-2.5 w-2.5" />{tag}
                                      </Badge>
                                    ))}
                                    {customT.map(tag => (
                                      <Badge key={tag} className="border-border bg-muted text-xs text-brand-secondary">
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                ) : null;
                              })()}
                              <div className="mt-1">
                                <ResourceTagEditor resource={resource} progress={progress} />
                              </div>
                              <ResourceSummary resource={resource} />
                              <ResourceQA resourceId={resource.id} currentUser={currentUser} />

                              {/* Rating System */}
                              <div className="flex items-center space-x-3 mt-2">
                                {/* Your Rating */}
                                <div className="flex items-center space-x-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                      key={star}
                                      onClick={() => handleRate(resource.id, star)}
                                      className="transition-transform hover:scale-110"
                                    >
                                      <Star
                                        className={`h-4 w-4 ${
                                          star <= getRating(resource.id)
                                            ? 'text-amber-500 fill-amber-500'
                                            : 'text-muted-foreground hover:text-amber-400'
                                        }`}
                                      />
                                    </button>
                                  ))}
                                  {getRating(resource.id) > 0 && (
                                    <span className="ml-2 text-xs text-muted-foreground">
                                      Your rating: {getRating(resource.id)}/5
                                    </span>
                                  )}
                                </div>
                                
                                {/* Community Rating */}
                                {resource.communityRating && (
                                  <div className="flex items-center space-x-1 pl-3 border-l">
                                    <Star className="h-4 w-4 text-primary fill-primary" />
                                    <span className="text-sm font-semibold text-primary">
                                      {resource.communityRating.average.toFixed(1)}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      ({resource.communityRating.count} {resource.communityRating.count === 1 ? 'review' : 'reviews'})
                                    </span>
                                  </div>
                                )}
                              </div>
                              </div>
                              <a
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => {
                                base44.analytics.track({
                                  eventName: 'resource_external_link_clicked',
                                  properties: {
                                    resource_id: resource.id,
                                    resource_name: resource.name,
                                    resource_type: resource.type,
                                    resource_category: category.category
                                  }
                                });
                                const isHRLegal = /legal|law|rights|hr|human resource|employment|workplace|government|accommodat/i.test(category.category);
                                if (isHRLegal) {
                                  base44.analytics.track({
                                    eventName: 'hr_legal_resource_link_clicked',
                                    properties: {
                                      resource_id: resource.id,
                                      resource_name: resource.name,
                                      resource_url: resource.url,
                                      resource_type: resource.type,
                                      resource_category: category.category
                                    }
                                  });
                                }
                                logInteraction(resource.id, 'link_click');
                              }}
                              aria-label={`Open ${resource.name} in a new tab`}
                              className="self-start flex-shrink-0 rounded-brand bg-muted p-4 text-primary shadow-brand-sm transition-all duration-300 group-hover:scale-105 hover:shadow-brand-md sm:ml-4"
                              >
                              <ExternalLink className="h-5 w-5" />
                              </a>
                              </div>
                              <div className="flex flex-wrap gap-2 border-t border-border pt-2">
                              <Button
                              variant={bookmarked ? "default" : "outline"}
                              size="sm"
                              onClick={() => toggleBookmarkMutation.mutate(resource.id)}
                              className="flex-1"
                              >
                              {bookmarked ? <BookmarkCheck className="h-4 w-4 mr-2" /> : <Bookmark className="h-4 w-4 mr-2" />}
                              {bookmarked ? 'Saved' : 'Save'}
                              </Button>

                              <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDiscussWithCoach(resource)}
                              className="flex-1"
                              >
                              <MessageCircle className="h-4 w-4 mr-2" />
                              Ask Coach
                              </Button>
                              <EnhancedResourceReviewDialog 
                                resourceId={resource.id}
                                resourceName={resource.name}
                              />
                              <EmailToHRButton
                                resourceName={resource.name}
                                resourceUrl={resource.url}
                                resourceDescription={resource.description}
                                resourceOrg={resource.org}
                                className="flex-1"
                              />
                              </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {filteredResources.every(cat => cat.items.length === 0) && (
        <Card>
          <CardContent className="pb-16 pt-16 text-center">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-pill bg-muted p-6">
              <Search className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-foreground">No resources found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}