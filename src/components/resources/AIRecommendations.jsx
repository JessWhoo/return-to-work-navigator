import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, Star, ExternalLink, MessageCircle, Bookmark, BookmarkCheck, Loader2, Zap, TrendingUp, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { generateAIRecommendations } from './AIResourceAnalyzer';

export default function AIRecommendations({ 
  progress,
  allResources, 
  onBookmark, 
  onDiscussWithCoach,
  isBookmarked,
  getRating 
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [pendingTags, setPendingTags] = useState({});
  const queryClient = useQueryClient();

  const handleTag = async (resourceId, tag) => {
    if (!progress?.id) return;
    const currentTag = progress.resource_tags?.[resourceId];
    const newTag = currentTag === tag ? null : tag; // toggle off if same

    setPendingTags(prev => ({ ...prev, [resourceId]: newTag || 'clearing' }));

    const updatedTags = { ...(progress.resource_tags || {}) };
    if (newTag) updatedTags[resourceId] = newTag;
    else delete updatedTags[resourceId];

    await base44.entities.UserProgress.update(progress.id, { resource_tags: updatedTags });
    base44.analytics.track({ eventName: 'resource_tagged', properties: { resource_id: resourceId, tag: newTag || 'removed' } });
    queryClient.invalidateQueries(['userProgress']);
    setPendingTags(prev => { const n = { ...prev }; delete n[resourceId]; return n; });
  };

  const getTag = (resourceId) => progress?.resource_tags?.[resourceId] || null;

  const tagCount = Object.keys(progress?.resource_tags || {}).length;
  const interactionCount = (progress?.resource_interactions || []).length;

  const { data: aiRecommendations, isLoading } = useQuery({
    queryKey: ['aiRecommendations', progress?.id, tagCount, interactionCount],
    queryFn: () => generateAIRecommendations(allResources, progress),
    enabled: !!progress,
    staleTime: 10 * 60 * 1000,
    retry: 1
  });

  if (!progress) return null;

  const colorMap = {
    purple: { gradient: 'from-purple-500 to-violet-500', bg: 'bg-purple-100', text: 'text-purple-700' },
    green: { gradient: 'from-green-500 to-emerald-500', bg: 'bg-green-100', text: 'text-green-700' },
    blue: { gradient: 'from-blue-500 to-cyan-500', bg: 'bg-blue-100', text: 'text-blue-700' },
    indigo: { gradient: 'from-indigo-500 to-purple-500', bg: 'bg-indigo-100', text: 'text-indigo-700' },
    rose: { gradient: 'from-rose-500 to-pink-500', bg: 'bg-rose-100', text: 'text-rose-700' },
    amber: { gradient: 'from-amber-500 to-orange-500', bg: 'bg-amber-100', text: 'text-amber-700' },
    teal: { gradient: 'from-teal-500 to-cyan-500', bg: 'bg-teal-100', text: 'text-teal-700' },
    cyan: { gradient: 'from-cyan-500 to-blue-500', bg: 'bg-cyan-100', text: 'text-cyan-700' },
    pink: { gradient: 'from-pink-500 to-rose-500', bg: 'bg-pink-100', text: 'text-pink-700' },
    emerald: { gradient: 'from-emerald-500 to-teal-500', bg: 'bg-emerald-100', text: 'text-emerald-700' }
  };

  const priorityColors = {
    urgent: { badge: 'bg-red-500', border: 'border-red-300' },
    high: { badge: 'bg-orange-500', border: 'border-orange-300' },
    medium: { badge: 'bg-blue-500', border: 'border-blue-300' },
    low: { badge: 'bg-gray-500', border: 'border-gray-300' }
  };

  const getResourceById = (resourceId) => {
    if (!resourceId || !allResources) return null;
    // IDs are formatted as "{category}-{index}" e.g. "Mental Health Support-2"
    const lastDashIdx = resourceId.lastIndexOf('-');
    if (lastDashIdx === -1) return null;
    const categoryName = resourceId.substring(0, lastDashIdx);
    const index = parseInt(resourceId.substring(lastDashIdx + 1));
    if (isNaN(index)) return null;
    const category = allResources.find(c => c.category === categoryName);
    if (!category) return null;
    const item = category.items?.[index];
    if (!item) return null;
    return { ...item, id: resourceId, category: category.category, color: category.color };
  };

  const recommendedResources = aiRecommendations?.recommendations?.map(rec => {
    const resource = getResourceById(rec.resource_id);
    if (!resource) return null;
    return { ...resource, ...rec };
  }).filter(Boolean) || [];

  return (
    <Card className="bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 border-2 border-purple-200 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            <span>AI-Powered Recommendations</span>
            <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              Personalized
            </Badge>
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-purple-600 hover:text-purple-700"
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </Button>
        </div>
        {aiRecommendations?.overall_insights && (
          <div className="mt-3 p-3 bg-white/60 rounded-lg border border-purple-200">
            <p className="text-sm text-gray-700 flex items-start space-x-2">
              <Zap className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
              <span><strong>AI Insight:</strong> {aiRecommendations.overall_insights}</span>
            </p>
          </div>
        )}
      </CardHeader>

      {isExpanded && (
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center space-y-3">
                <Loader2 className="h-8 w-8 animate-spin text-purple-600 mx-auto" />
                <p className="text-sm text-gray-600">Analyzing your progress and finding the best resources...</p>
              </div>
            </div>
          ) : recommendedResources.length === 0 ? (
            <div className="text-center py-8">
              <Sparkles className="h-12 w-12 text-purple-300 mx-auto mb-3" />
              <p className="text-gray-600">No AI recommendations available at this time.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recommendedResources.map((resource, index) => {
                const colors = colorMap[resource.color] || colorMap.purple;
                const priorityColor = priorityColors[resource.priority] || priorityColors.medium;
                const bookmarked = isBookmarked(resource.id);
                const userRating = getRating(resource.id);

                return (
                  <div
                    key={resource.id}
                    className={`bg-white rounded-lg p-4 border-2 ${priorityColor.border} hover:shadow-md transition-all`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2 flex-wrap">
                        <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                          #{index + 1}
                        </Badge>
                        <Badge className={`${priorityColor.badge} text-white text-xs capitalize`}>
                          {resource.priority}
                        </Badge>
                        <Badge className={`bg-gradient-to-r ${colors.gradient} text-white text-xs`}>
                          {resource.type}
                        </Badge>
                        {bookmarked && (
                          <Badge className="bg-amber-100 text-amber-700 text-xs">
                            <BookmarkCheck className="h-3 w-3 mr-1" />
                            Saved
                          </Badge>
                        )}
                      </div>
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200 transition-all flex-shrink-0"
                      >
                        <ExternalLink className="h-4 w-4 text-purple-700" />
                      </a>
                    </div>

                    <h4 className="font-bold text-gray-900 mb-1">{resource.name}</h4>
                    <p className="text-xs text-gray-600 mb-2">{resource.org} • {resource.category}</p>
                    <p className="text-sm text-gray-700 mb-3">{resource.description}</p>

                    <div className="bg-purple-50 rounded-lg p-3 mb-3 border border-purple-100">
                      <div className="flex items-start space-x-2">
                        <TrendingUp className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-medium text-purple-900 mb-1">Why this is recommended:</p>
                          <p className="text-xs text-purple-800">{resource.reason}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-purple-200">
                        <span className="text-xs text-purple-700">Relevance Score</span>
                        <div className="flex items-center space-x-1">
                          {[...Array(10)].map((_, i) => (
                            <div
                              key={i}
                              className={`h-2 w-2 rounded-full ${
                                i < Math.round(resource.relevance_score ?? 0)
                                  ? 'bg-purple-600'
                                  : 'bg-purple-200'
                              }`}
                            />
                          ))}
                          <span className="text-xs font-bold text-purple-700 ml-1">
                            {(resource.relevance_score ?? 0).toFixed(1)}/10
                          </span>
                        </div>
                      </div>
                    </div>

                    {userRating > 0 && (
                      <div className="flex items-center space-x-1 mb-3">
                        <span className="text-xs text-gray-500">Your rating:</span>
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star
                            key={star}
                            className={`h-3 w-3 ${
                              star <= userRating ? 'text-amber-500 fill-amber-500' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    )}

                    <div className="flex gap-2 flex-wrap">
                      <Button
                        variant={bookmarked ? "default" : "outline"}
                        size="sm"
                        onClick={() => onBookmark(resource.id)}
                        className="flex-1 text-xs"
                      >
                        {bookmarked ? <BookmarkCheck className="h-3 w-3 mr-1" /> : <Bookmark className="h-3 w-3 mr-1" />}
                        {bookmarked ? 'Saved' : 'Save'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDiscussWithCoach(resource)}
                        className="flex-1 text-xs"
                      >
                        <MessageCircle className="h-3 w-3 mr-1" />
                        Ask Coach
                      </Button>
                    </div>
                    {/* Tag buttons for fine-tuning AI */}
                    <div className="flex gap-2 pt-2 border-t border-purple-100">
                      <span className="text-xs text-gray-500 self-center mr-1">Fine-tune AI:</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={!!pendingTags[resource.id]}
                        onClick={() => handleTag(resource.id, 'useful')}
                        className={`text-xs px-2 h-7 ${getTag(resource.id) === 'useful' ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'text-gray-500 hover:text-green-600 hover:bg-green-50'}`}
                      >
                        <ThumbsUp className="h-3 w-3 mr-1" />
                        Useful
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={!!pendingTags[resource.id]}
                        onClick={() => handleTag(resource.id, 'not_relevant')}
                        className={`text-xs px-2 h-7 ${getTag(resource.id) === 'not_relevant' ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'text-gray-500 hover:text-red-600 hover:bg-red-50'}`}
                      >
                        <ThumbsDown className="h-3 w-3 mr-1" />
                        Not for me
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}