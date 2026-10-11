import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, Star, ExternalLink, MessageCircle, Bookmark, BookmarkCheck } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export default function TrendingResources({ 
  allResources, 
  onBookmark, 
  onDiscussWithCoach,
  isBookmarked,
  getRating 
}) {
  const { data: reviews } = useQuery({
    queryKey: ['resourceReviews'],
    queryFn: () => base44.entities.ResourceReview.list(),
    initialData: []
  });

  const getResourceStats = (resourceId) => {
    const resourceReviews = reviews.filter(r => r.resource_id === resourceId);
    const avgRating = resourceReviews.length > 0
      ? resourceReviews.reduce((sum, r) => sum + r.rating, 0) / resourceReviews.length
      : 0;
    return {
      avgRating,
      reviewCount: resourceReviews.length,
      recommendCount: resourceReviews.filter(r => r.would_recommend).length
    };
  };

  const trendingResources = allResources
    .flatMap(cat => 
      cat.items.map((item, idx) => ({
        ...item,
        id: `${cat.category}-${idx}`,
        category: cat.category,
        color: cat.color,
        stats: getResourceStats(`${cat.category}-${idx}`)
      }))
    )
    .filter(resource => resource.stats.reviewCount > 0)
    .sort((a, b) => {
      // Calculate a trending score based on rating, reviews, and recency
      const scoreA = b.stats.avgRating * Math.log(b.stats.reviewCount + 1) * (b.stats.recommendCount / (b.stats.reviewCount || 1));
      const scoreB = a.stats.avgRating * Math.log(a.stats.reviewCount + 1) * (a.stats.recommendCount / (a.stats.reviewCount || 1));
      return scoreA - scoreB;
    })
    .slice(0, 5);

  if (trendingResources.length === 0) {
    return null;
  }



  return (
    <Card className="nv-card--muted">
      <CardHeader>
        <CardTitle className="flex flex-wrap items-center gap-2">
          <TrendingUp className="h-5 w-5 text-brand-primary" /><span>Most Helpful Resources</span><Badge>Top {trendingResources.length}</Badge>
        </CardTitle>
        <p className="text-sm text-brand-muted-foreground mt-2">Based on community ratings and reviews</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {trendingResources.map((resource, index) => {
          const bookmarked = isBookmarked(resource.id);
          const userRating = getRating(resource.id);
          return (
            <div key={resource.id} className="nv-card p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge>#{index + 1}</Badge>
                  <Badge className="bg-brand-sky text-brand-text text-xs">{resource.type}</Badge>
                  {bookmarked && <Badge className="bg-brand-secondary/20 text-brand-text text-xs"><BookmarkCheck className="h-3 w-3 mr-1" />Saved</Badge>}
                </div>
                <a href={resource.url} target="_blank" rel="noopener noreferrer" aria-label={`Open ${resource.name}`} className="nv-btn nv-btn--outline nv-btn--icon shrink-0"><ExternalLink className="h-4 w-4" /></a>
              </div>
              <h4 className="font-bold text-brand-text mb-1">{resource.name}</h4>
              <p className="text-xs text-brand-muted-foreground mb-2">{resource.org}</p>
              <p className="text-sm text-brand-text mb-3">{resource.description}</p>
              <div className="flex flex-wrap items-center gap-4 mb-3 pb-3 border-b border-brand-border">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-brand-primary fill-brand-primary" />
                  <span className="text-sm font-semibold text-brand-text">{resource.stats.avgRating.toFixed(1)}</span>
                  <span className="text-xs text-brand-muted-foreground">({resource.stats.reviewCount} {resource.stats.reviewCount === 1 ? 'review' : 'reviews'})</span>
                </div>
                {resource.stats.recommendCount > 0 && <Badge variant="outline" className="text-xs">{resource.stats.recommendCount} recommend</Badge>}
              </div>
              {userRating > 0 && (
                <div className="flex items-center gap-1 mb-3">
                  <span className="text-xs text-brand-muted-foreground">Your rating:</span>
                  {[1, 2, 3, 4, 5].map(star => <Star key={star} className={`h-3 w-3 ${star <= userRating ? 'text-brand-primary fill-brand-primary' : 'text-brand-border'}`} />)}
                </div>
              )}
              <div className="flex gap-2 flex-wrap">
                <Button variant={bookmarked ? 'default' : 'outline'} size="sm" onClick={() => onBookmark(resource.id)} className="flex-1 !whitespace-normal">
                  {bookmarked ? <BookmarkCheck className="h-3 w-3 mr-1" /> : <Bookmark className="h-3 w-3 mr-1" />}
                  {bookmarked ? 'Saved' : 'Save'}
                </Button>
                <Button variant="outline" size="sm" onClick={() => onDiscussWithCoach(resource)} className="flex-1 !whitespace-normal"><MessageCircle className="h-3 w-3 mr-1" />Ask Coach</Button>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}