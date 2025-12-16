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
      // Sort by average rating first, then by number of reviews
      if (b.stats.avgRating !== a.stats.avgRating) {
        return b.stats.avgRating - a.stats.avgRating;
      }
      return b.stats.reviewCount - a.stats.reviewCount;
    })
    .slice(0, 5);

  if (trendingResources.length === 0) {
    return null;
  }

  const colorMap = {
    purple: 'from-purple-500 to-violet-500',
    green: 'from-green-500 to-emerald-500',
    blue: 'from-blue-500 to-cyan-500',
    indigo: 'from-indigo-500 to-purple-500',
    rose: 'from-rose-500 to-pink-500',
    amber: 'from-amber-500 to-orange-500',
    teal: 'from-teal-500 to-cyan-500',
    cyan: 'from-cyan-500 to-blue-500',
    pink: 'from-pink-500 to-rose-500',
    emerald: 'from-emerald-500 to-teal-500'
  };

  return (
    <Card className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 border-2 border-amber-200 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5 text-amber-600" />
          <span>Most Helpful Resources</span>
          <Badge className="bg-amber-500 text-white">Top {trendingResources.length}</Badge>
        </CardTitle>
        <p className="text-sm text-gray-600 mt-2">
          Based on community ratings and reviews
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {trendingResources.map((resource, index) => {
          const colors = colorMap[resource.color] || colorMap.purple;
          const bookmarked = isBookmarked(resource.id);
          const userRating = getRating(resource.id);
          
          return (
            <div
              key={resource.id}
              className="bg-white rounded-lg p-4 border-2 border-amber-100 hover:border-amber-300 transition-all shadow-sm hover:shadow-md"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                    #{index + 1}
                  </Badge>
                  <Badge className={`bg-gradient-to-r ${colors} text-white text-xs`}>
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
                  className="p-2 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 hover:from-amber-200 hover:to-orange-200 transition-all"
                >
                  <ExternalLink className="h-4 w-4 text-amber-700" />
                </a>
              </div>

              <h4 className="font-bold text-gray-900 mb-1">{resource.name}</h4>
              <p className="text-xs text-gray-600 mb-2">{resource.org}</p>
              <p className="text-sm text-gray-700 mb-3">{resource.description}</p>

              <div className="flex items-center space-x-4 mb-3 pb-3 border-b border-gray-100">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                  <span className="text-sm font-semibold text-gray-900">
                    {resource.stats.avgRating.toFixed(1)}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({resource.stats.reviewCount} {resource.stats.reviewCount === 1 ? 'review' : 'reviews'})
                  </span>
                </div>
                {resource.stats.recommendCount > 0 && (
                  <Badge variant="outline" className="text-xs">
                    {resource.stats.recommendCount} recommend
                  </Badge>
                )}
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

              <div className="flex gap-2">
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
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}