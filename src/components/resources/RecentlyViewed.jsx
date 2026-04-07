import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  const flatResources = allResources.flatMap((cat, catIdx) =>
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
    <Card className="bg-slate-800/90 border-2 border-slate-600">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-slate-200 text-lg">
          <Clock className="h-5 w-5 text-teal-400" />
          Recently Viewed
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {recentResources.map(resource => {
            const bookmarked = isBookmarked(resource.id);
            return (
              <div
                key={resource.id}
                className="flex-shrink-0 w-56 bg-slate-700/80 rounded-xl p-3 border border-slate-600 hover:border-teal-500 transition-all"
              >
                <Badge className="bg-slate-600 text-slate-300 text-xs mb-2">{resource.type}</Badge>
                <p className="text-sm font-semibold text-slate-200 leading-tight mb-1 line-clamp-2">{resource.name}</p>
                <p className="text-xs text-slate-400 mb-3 line-clamp-1">{resource.org}</p>
                <div className="flex gap-2">
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1 py-1 px-2 rounded-lg bg-teal-600/20 hover:bg-teal-600/40 text-teal-300 text-xs transition-colors"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Open
                  </a>
                  <button
                    onClick={() => onBookmark(resource.id)}
                    className={`p-1 rounded-lg text-xs transition-colors ${
                      bookmarked
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-slate-600/50 text-slate-400 hover:text-amber-400'
                    }`}
                  >
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