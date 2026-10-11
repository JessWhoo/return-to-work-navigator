import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, Star, ExternalLink, MessageCircle, Bookmark, BookmarkCheck, Loader2, Zap, TrendingUp, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { generateAIRecommendations } from '@/components/resources/AIResourceAnalyzer';

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



  const priorityColors = {
    urgent: { badge: 'bg-destructive text-destructive-foreground', ring: 'ring-destructive' },
    high: { badge: 'bg-brand-primary text-primary-foreground', ring: 'ring-primary' },
    medium: { badge: 'bg-brand-sky text-brand-text', ring: 'ring-border' },
    low: { badge: 'bg-brand-muted text-brand-muted-foreground', ring: 'ring-border' }
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
    <Card className="nv-card--muted">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="flex flex-wrap items-center gap-2"><Sparkles className="h-5 w-5 text-brand-primary shrink-0" /><span>AI-Powered Recommendations</span><Badge>Personalized</Badge></CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)} aria-expanded={isExpanded}>{isExpanded ? 'Collapse' : 'Expand'}</Button>
        </div>
        {aiRecommendations?.overall_insights && <div className="nv-card mt-3 p-3"><p className="text-sm text-brand-text flex items-start gap-2"><Zap className="h-4 w-4 text-brand-primary mt-0.5 shrink-0" /><span><strong>AI Insight:</strong> {aiRecommendations.overall_insights}</span></p></div>}
      </CardHeader>
      {isExpanded && (
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12"><div className="text-center space-y-3"><Loader2 className="h-8 w-8 animate-spin text-brand-primary mx-auto" /><p className="text-sm text-brand-muted-foreground">Analyzing your progress and finding the best resources...</p></div></div>
          ) : recommendedResources.length === 0 ? (
            <div className="text-center py-8"><Sparkles className="h-12 w-12 text-brand-primary mx-auto mb-3" /><p className="text-brand-muted-foreground">No AI recommendations available at this time.</p></div>
          ) : (
            <div className="space-y-4">
              {recommendedResources.map((resource, index) => {
                const priorityColor = priorityColors[resource.priority] || priorityColors.medium;
                const bookmarked = isBookmarked(resource.id);
                const userRating = getRating(resource.id);
                return (
                  <div key={resource.id} className={`nv-card p-4 ring-1 ${priorityColor.ring}`}>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 flex-wrap min-w-0">
                        <Badge>#{index + 1}</Badge><Badge className={`${priorityColor.badge} text-xs capitalize`}>{resource.priority}</Badge><Badge variant="outline" className="text-xs">{resource.type}</Badge>
                        {bookmarked && <Badge variant="secondary" className="text-xs"><BookmarkCheck className="h-3 w-3 mr-1" />Saved</Badge>}
                      </div>
                      <a href={resource.url} target="_blank" rel="noopener noreferrer" aria-label={`Open ${resource.name}`} className="nv-btn nv-btn--outline nv-btn--icon shrink-0"><ExternalLink className="h-4 w-4" /></a>
                    </div>
                    <h4 className="font-bold text-brand-text mb-1">{resource.name}</h4>
                    <p className="text-xs text-brand-muted-foreground mb-2">{resource.org} • {resource.category}</p>
                    <p className="text-sm text-brand-text mb-3">{resource.description}</p>
                    <div className="nv-card nv-card--muted p-3 mb-3">
                      <div className="flex items-start gap-2"><TrendingUp className="h-4 w-4 text-brand-primary mt-0.5 shrink-0" /><div><p className="text-xs font-semibold text-brand-text mb-1">Why this is recommended:</p><p className="text-xs text-brand-text">{resource.reason}</p></div></div>
                      <div className="flex flex-wrap items-center justify-between gap-2 mt-2 pt-2 border-t border-brand-border">
                        <span className="text-xs text-brand-muted-foreground">Relevance Score</span>
                        <div className="flex items-center gap-1">{[...Array(10)].map((_, i) => <div key={i} className={`h-2 w-2 rounded-full ${i < Math.round(resource.relevance_score ?? 0) ? 'bg-brand-primary' : 'bg-brand-border'}`} />)}<span className="text-xs font-bold text-brand-primary ml-1">{(resource.relevance_score ?? 0).toFixed(1)}/10</span></div>
                      </div>
                    </div>
                    {userRating > 0 && <div className="flex items-center gap-1 mb-3"><span className="text-xs text-brand-muted-foreground">Your rating:</span>{[1, 2, 3, 4, 5].map(star => <Star key={star} className={`h-3 w-3 ${star <= userRating ? 'text-brand-primary fill-brand-primary' : 'text-brand-border'}`} />)}</div>}
                    <div className="flex gap-2 flex-wrap">
                      <Button variant={bookmarked ? 'default' : 'outline'} size="sm" onClick={() => onBookmark(resource.id)} className="flex-1 !whitespace-normal">{bookmarked ? <BookmarkCheck className="h-3 w-3 mr-1" /> : <Bookmark className="h-3 w-3 mr-1" />}{bookmarked ? 'Saved' : 'Save'}</Button>
                      <Button variant="outline" size="sm" onClick={() => onDiscussWithCoach(resource)} className="flex-1 !whitespace-normal"><MessageCircle className="h-3 w-3 mr-1" />Ask Coach</Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3 pt-2 border-t border-brand-border">
                      <span className="text-xs text-brand-muted-foreground self-center mr-1">Fine-tune AI:</span>
                      <Button variant={getTag(resource.id) === 'useful' ? 'secondary' : 'ghost'} size="sm" disabled={!!pendingTags[resource.id]} onClick={() => handleTag(resource.id, 'useful')} aria-pressed={getTag(resource.id) === 'useful'}><ThumbsUp className="h-3 w-3 mr-1" />Useful</Button>
                      <Button variant={getTag(resource.id) === 'not_relevant' ? 'default' : 'ghost'} size="sm" disabled={!!pendingTags[resource.id]} onClick={() => handleTag(resource.id, 'not_relevant')} aria-pressed={getTag(resource.id) === 'not_relevant'}><ThumbsDown className="h-3 w-3 mr-1" />Not for me</Button>
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