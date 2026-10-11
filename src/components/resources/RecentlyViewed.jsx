import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, ExternalLink, Bookmark, BookmarkCheck } from 'lucide-react';

export default function RecentlyViewed({ progress, allResources, onBookmark, isBookmarked }) {
  if (!progress?.resource_interactions?.length) return null;

  // Get last 5 unique viewed/clicked resource IDs in reverse-chronological order
  const recentIds = [];
  const seen = new Set();
  const interactions = [...(progress.resource_interactions || [])].reverse();
  for (const i of interactions) {
    if (!seen.has(i.resource_id)) {
      seen.add(i.resource_id);
      recentIds.push(i.resource_id);
    }
    if (recentIds.length >= 5) break;
  }

  if (recentIds.length === 0) return null;

  // Flatten all resources for lookup
  const flatResources = allResources.flatMap((cat) =>
    cat.items.map((item, idx) => ({
      ...item,
      id: `${cat.category}-${idx}`,
      category: cat.category,
      color: cat.color
    }))
  );

  const recentResources = recentIds
    .map(id => flatResources.find(r => r.id === id))
    .filter(Boolean);

  if (recentResources.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-brand-text text-lg"><Clock className="h-5 w-5 text-brand-primary" />Recently Viewed</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {recentResources.map(resource => {
            const bookmarked = isBookmarked(resource.id);
            return (
              <div key={resource.id} className="nv-card nv-card--muted flex-shrink-0 w-56 p-3">
                <Badge className="bg-brand-sky text-brand-text text-xs mb-2">{resource.type}</Badge>
                <p className="text-sm font-semibold text-brand-text mb-1 line-clamp-2">{resource.name}</p>
                <p className="text-xs text-brand-muted-foreground mb-3 line-clamp-1">{resource.org}</p>
                <div className="flex gap-2">
                  <a href={resource.url} target="_blank" rel="noopener noreferrer" className="nv-btn nv-btn--outline nv-btn--sm flex-1">
                    <ExternalLink className="h-3 w-3" /> Open
                  </a>
                  <button onClick={() => onBookmark(resource.id)} aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark resource'} aria-pressed={bookmarked}
                    className={`nv-btn nv-btn--icon ${bookmarked ? 'nv-btn--secondary' : 'nv-btn--outline'}`}>
                    {bookmarked ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}