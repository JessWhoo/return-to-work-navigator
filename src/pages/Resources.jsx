import React, { useState, useEffect, Component } from 'react';
import { useNavigate } from 'react-router-dom';

class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() { return this.state.hasError ? null : this.props.children; }
}
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, ExternalLink, Star,
  Bookmark, MessageCircle, BookmarkCheck, TrendingUp, ThumbsUp, ThumbsDown, Sparkles, X, Tag
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
import ResourceTagEditor from '../components/resources/ResourceTagEditor';
import ResourceSummary from '../components/resources/ResourceSummary';

export default function Resources() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [selectedStage, setSelectedStage] = useState('all');
  const [showBookmarked, setShowBookmarked] = useState(false);
  const [showAIRecommended, setShowAIRecommended] = useState(false);
  const [showUseful, setShowUseful] = useState(false);
  const [showNotRelevant, setShowNotRelevant] = useState(false);
  const [showTagged, setShowTagged] = useState(false);
  const [sortBy, setSortBy] = useState('recommended');

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

  const { data: progress } = useQuery({
    queryKey: ['userProgress'],
    queryFn: async () => {
      const progressList = await base44.entities.UserProgress.list();
      if (progressList.length > 0) return progressList[0];
      
      return await base44.entities.UserProgress.create({
        completed_checklist_items: [],
        journey_stage: 'planning',
        bookmarked_resources: []
      });
    }
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
    onSuccess: () => {
      queryClient.invalidateQueries(['userProgress']);
      toast.success('Bookmark updated');
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

  const colorMap = {
    purple: { from: 'from-purple-100', via: 'via-purple-50', border: 'border-purple-200', iconFrom: 'from-purple-400', iconTo: 'to-purple-600', badge: 'bg-purple-500' },
    green: { from: 'from-green-100', via: 'via-green-50', border: 'border-green-200', iconFrom: 'from-green-400', iconTo: 'to-green-600', badge: 'bg-green-500' },
    blue: { from: 'from-blue-100', via: 'via-blue-50', border: 'border-blue-200', iconFrom: 'from-blue-400', iconTo: 'to-blue-600', badge: 'bg-blue-500' },
    indigo: { from: 'from-indigo-100', via: 'via-indigo-50', border: 'border-indigo-200', iconFrom: 'from-indigo-400', iconTo: 'to-indigo-600', badge: 'bg-indigo-500' },
    rose: { from: 'from-rose-100', via: 'via-rose-50', border: 'border-rose-200', iconFrom: 'from-rose-400', iconTo: 'to-rose-600', badge: 'bg-rose-500' },
    amber: { from: 'from-amber-100', via: 'via-amber-50', border: 'border-amber-200', iconFrom: 'from-amber-400', iconTo: 'to-amber-600', badge: 'bg-amber-500' },
    teal: { from: 'from-teal-100', via: 'via-teal-50', border: 'border-teal-200', iconFrom: 'from-teal-400', iconTo: 'to-teal-600', badge: 'bg-teal-500' },
    cyan: { from: 'from-cyan-100', via: 'via-cyan-50', border: 'border-cyan-200', iconFrom: 'from-cyan-400', iconTo: 'to-cyan-600', badge: 'bg-cyan-500' },
    pink: { from: 'from-pink-100', via: 'via-pink-50', border: 'border-pink-200', iconFrom: 'from-pink-400', iconTo: 'to-pink-600', badge: 'bg-pink-500' },
    emerald: { from: 'from-emerald-100', via: 'via-emerald-50', border: 'border-emerald-200', iconFrom: 'from-emerald-400', iconTo: 'to-emerald-600', badge: 'bg-emerald-500' }
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

        return matchesSearch && matchesBookmark && matchesAI && matchesUseful && matchesNotRelevant && matchesType && matchesTopic && matchesStage && matchesTagged;
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

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
          Resource Library
        </h1>
        <p className="text-lg text-slate-300 max-w-2xl mx-auto">
          {totalResources} curated resources • {progress?.bookmarked_resources?.length || 0} saved • {totalRated} rated
        </p>
        <div className="flex flex-wrap justify-center gap-2 pt-2">
          <Badge className="bg-slate-700 text-slate-300">Articles</Badge>
          <Badge className="bg-slate-700 text-slate-300">Videos</Badge>
          <Badge className="bg-slate-700 text-slate-300">Workshops</Badge>
          <Badge className="bg-slate-700 text-slate-300">Meditations</Badge>
          <Badge className="bg-slate-700 text-slate-300">Expert Interviews</Badge>
          <Badge className="bg-slate-700 text-slate-300">Support Groups</Badge>
        </div>
        <div className="pt-4 flex flex-wrap justify-center gap-3">
          <SuggestResourceDialog />
          <ResourceExportDialog
            resources={resources}
            bookmarkedIds={progress?.bookmarked_resources || []}
            progress={progress}
          />
        </div>
      </div>

      {/* Search and Filter */}
      <Card className="bg-slate-800/90 backdrop-blur-sm border-2 border-teal-600 shadow-lg">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4">
            {/* Primary Search */}
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-teal-400 group-hover:text-teal-300 transition-colors" />
              <Input
                placeholder="Search by title, topic, tag, organization..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-900 border-slate-600 text-slate-200 placeholder:text-slate-500 focus:border-teal-400 focus:ring-teal-400"
              />
            </div>

            {/* Advanced Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 text-sm border-2 border-slate-600 rounded-lg bg-slate-900 text-slate-200 hover:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all cursor-pointer"
              >
                <option value="all">All Categories</option>
                {resources.map(cat => (
                  <option key={cat.category} value={cat.category}>{cat.category}</option>
                ))}
              </select>

              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 text-sm border-2 border-slate-600 rounded-lg bg-slate-900 text-slate-200 hover:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all cursor-pointer"
              >
                <option value="all">All Types</option>
                {allTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>

              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="px-3 py-2 text-sm border-2 border-slate-600 rounded-lg bg-slate-900 text-slate-200 hover:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all cursor-pointer"
              >
                <option value="all">All Topics</option>
                {allTopics.map(topic => (
                  <option key={topic} value={topic}>{topic}</option>
                ))}
              </select>

              <select
                value={selectedStage}
                onChange={(e) => setSelectedStage(e.target.value)}
                className="px-3 py-2 text-sm border-2 border-slate-600 rounded-lg bg-slate-900 text-slate-200 hover:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all cursor-pointer"
              >
                <option value="all">All Stages</option>
                {allStages.map(stage => (
                  <option key={stage.value} value={stage.value}>{stage.label}</option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 text-sm border-2 border-slate-600 rounded-lg bg-slate-900 text-slate-200 hover:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all cursor-pointer"
              >
                <option value="recommended">Default Order</option>
                <option value="rating">My Highest Rated</option>
                <option value="community_rating">Community Rated</option>
                <option value="most_reviewed">Most Reviewed</option>
                <option value="most_viewed">Most Viewed by Me</option>
                <option value="most_recent">Recently Viewed</option>
              </select>
            </div>

            {/* Quick Filters */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={showBookmarked ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowBookmarked(!showBookmarked)}
                  className={showBookmarked ? "bg-teal-600 hover:bg-teal-700 text-white" : "border-slate-600 text-cyan-400 hover:bg-slate-700 hover:text-cyan-300"}
                >
                  <Bookmark className="h-4 w-4 mr-2" />
                  Saved ({progress?.bookmarked_resources?.length || 0})
                </Button>

                <Button
                  variant={showAIRecommended ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowAIRecommended(!showAIRecommended)}
                  className={showAIRecommended ? "bg-purple-600 hover:bg-purple-700 text-white" : "border-slate-600 text-purple-400 hover:bg-slate-700 hover:text-purple-300"}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  AI Recommended
                </Button>

                <Button
                  variant={showUseful ? "default" : "outline"}
                  size="sm"
                  onClick={() => { setShowUseful(!showUseful); if (showNotRelevant) setShowNotRelevant(false); }}
                  className={showUseful ? "bg-green-600 hover:bg-green-700 text-white" : "border-slate-600 text-green-400 hover:bg-slate-700 hover:text-green-300"}
                >
                  <ThumbsUp className="h-4 w-4 mr-2" />
                  Useful ({Object.values(progress?.resource_tags || {}).filter(t => t === 'useful').length})
                </Button>

                <Button
                  variant={showNotRelevant ? "default" : "outline"}
                  size="sm"
                  onClick={() => { setShowNotRelevant(!showNotRelevant); if (showUseful) setShowUseful(false); }}
                  className={showNotRelevant ? "bg-red-600 hover:bg-red-700 text-white" : "border-slate-600 text-red-400 hover:bg-slate-700 hover:text-red-300"}
                >
                  <ThumbsDown className="h-4 w-4 mr-2" />
                  Not for Me ({Object.values(progress?.resource_tags || {}).filter(t => t === 'not_relevant').length})
                </Button>

                <Button
                  variant={showTagged ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowTagged(!showTagged)}
                  className={showTagged ? "bg-indigo-600 hover:bg-indigo-700 text-white" : "border-slate-600 text-indigo-400 hover:bg-slate-700 hover:text-indigo-300"}
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
                    className={`border-slate-600 text-cyan-400 hover:bg-slate-700 hover:text-cyan-300 ${
                      selectedTopic === topic ? 'bg-slate-700 border-teal-500 text-cyan-300' : ''
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
                  }}
                  className="text-slate-400 hover:text-slate-200 hover:bg-slate-700"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear All
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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

      {/* Resources by Category */}
      <div className="space-y-8">
        {filteredResources.map((category) => {
          if (category.items.length === 0) return null;
          
          const Icon = category.icon;
          const colors = colorMap[category.color];
          return (
            <div key={category.category} className="space-y-4">
              <div className={`flex items-center space-x-3 p-5 bg-gradient-to-r ${colors.from} ${colors.via} to-white rounded-2xl shadow-md border-2 ${colors.border} hover:shadow-xl transition-all`}>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${colors.iconFrom} ${colors.iconTo} shadow-lg`}>
                  <Icon className="h-7 w-7 text-white" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">{category.category}</h2>
                <Badge className={`ml-auto ${colors.badge} text-white shadow-md`}>
                  {category.items.length} resources
                </Badge>
              </div>

              <div className="grid gap-5">
                {category.items.map((resource) => {
                  const cardColors = colorMap[category.color];
                  const bookmarked = isBookmarked(resource.id);
                  return (
                    <Card key={resource.id} className="bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 group border-2 border-gray-100 hover:border-indigo-200 overflow-hidden">
                      <CardContent className="pt-6 relative">
                        <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${cardColors.iconFrom} ${cardColors.iconTo}`}></div>
                        <div className="pl-3 space-y-3">
                          <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2 flex-wrap">
                            <Badge className={`bg-gradient-to-r ${cardColors.iconFrom} ${cardColors.iconTo} text-white shadow-sm`}>
                              {resource.type}
                            </Badge>
                            {resource.topics?.slice(0, 2).map(topic => (
                              <Badge key={topic} variant="outline" className="text-xs border-slate-600 text-slate-600">
                                {topic}
                              </Badge>
                            ))}
                            {bookmarked && (
                              <Badge className="bg-amber-100 text-amber-700">
                                <BookmarkCheck className="h-3 w-3 mr-1" />
                                Saved
                              </Badge>
                            )}
                            {resource.communityRating && resource.communityRating.average >= 4 && (
                              <Badge className="bg-green-100 text-green-800 border border-green-300">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                Highly Rated
                              </Badge>
                            )}
                            {progress?.resource_tags?.[resource.id] === 'useful' && (
                              <Badge className="bg-green-100 text-green-700 border border-green-300">
                                <ThumbsUp className="h-3 w-3 mr-1" />
                                Useful
                              </Badge>
                            )}
                            {progress?.resource_tags?.[resource.id] === 'not_relevant' && (
                              <Badge className="bg-red-100 text-red-700 border border-red-300">
                                <ThumbsDown className="h-3 w-3 mr-1" />
                                Not for Me
                              </Badge>
                            )}
                            {aiRecommendedIds.has(resource.id) && (
                              <Badge className="bg-purple-100 text-purple-700 border border-purple-300">
                                <Sparkles className="h-3 w-3 mr-1" />
                                AI Pick
                              </Badge>
                            )}
                          </div>
                              <h3 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-indigo-700 transition-colors">{resource.name}</h3>
                              <p className="text-sm font-medium text-indigo-600 mb-2">{resource.org}</p>
                              <p className="text-sm text-gray-600 leading-relaxed">{resource.description}</p>

                              {/* AI + Custom Tag Display */}
                              {(() => {
                                const aiT = progress?.resource_ai_tags?.[resource.id] || [];
                                const customT = progress?.resource_custom_tags?.[resource.id] || [];
                                const allT = [...new Set([...aiT, ...customT])];
                                return allT.length > 0 ? (
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {aiT.map(tag => (
                                      <Badge key={tag} className="bg-purple-50 text-purple-700 border border-purple-200 text-xs">
                                        <Sparkles className="h-2.5 w-2.5 mr-1" />{tag}
                                      </Badge>
                                    ))}
                                    {customT.map(tag => (
                                      <Badge key={tag} className="bg-teal-50 text-teal-700 border border-teal-200 text-xs">
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
                                            : 'text-gray-300 hover:text-amber-400'
                                        }`}
                                      />
                                    </button>
                                  ))}
                                  {getRating(resource.id) > 0 && (
                                    <span className="text-xs text-gray-500 ml-2">
                                      Your rating: {getRating(resource.id)}/5
                                    </span>
                                  )}
                                </div>
                                
                                {/* Community Rating */}
                                {resource.communityRating && (
                                  <div className="flex items-center space-x-1 pl-3 border-l">
                                    <Star className="h-4 w-4 text-blue-600 fill-blue-600" />
                                    <span className="text-sm font-semibold text-blue-700">
                                      {resource.communityRating.average.toFixed(1)}
                                    </span>
                                    <span className="text-xs text-gray-500">
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
                              className={`ml-4 p-4 rounded-xl bg-gradient-to-br ${cardColors.from} ${cardColors.via} hover:${cardColors.iconFrom} hover:${cardColors.iconTo} hover:text-white transition-all duration-300 group-hover:scale-110 shadow-md hover:shadow-xl flex-shrink-0`}
                              >
                              <ExternalLink className="h-5 w-5" />
                              </a>
                              </div>
                              <div className="flex gap-2 pt-2 border-t border-gray-100">
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
        <Card className="bg-gradient-to-br from-gray-50 to-gray-100 backdrop-blur-sm border-2 border-gray-200">
          <CardContent className="pt-16 pb-16 text-center">
            <div className="bg-gray-200 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <Search className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">No resources found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}