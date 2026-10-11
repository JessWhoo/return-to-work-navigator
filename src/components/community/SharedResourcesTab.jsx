import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bookmark, Copy, ExternalLink, Share2, Library, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { resources as allResources } from '../resources/resourcesData';
import { useUserProgress } from '@/hooks/useUserProgress';

export default function SharedResourcesTab() {
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [shareText, setShareText] = useState('');

  const { data: progress } = useUserProgress();

  const bookmarkedIds = progress?.bookmarked_resources || [];

  // Resolve bookmarked resources from all categories
  const bookmarkedResources = allResources.flatMap((cat) =>
    cat.items.map((item, idx) => ({
      ...item,
      id: `${cat.category}-${idx}`,
      category: cat.category,
    }))
  ).filter(r => bookmarkedIds.includes(r.id));

  const toggleSelect = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
    setShareText('');
  };

  const buildShareText = () => {
    const selected = bookmarkedResources.filter(r => selectedIds.has(r.id));
    if (!selected.length) { toast.error('Select at least one resource'); return; }
    const lines = selected.map(r => `• ${r.name} (${r.org})\n  ${r.url}`).join('\n\n');
    const text = `📚 Resources I found helpful on my return-to-work journey:\n\n${lines}\n\n— Shared via Back to Life, Back to Work Navigator`;
    setShareText(text);
  };

  const copyShareText = async () => {
    await navigator.clipboard.writeText(shareText);
    toast.success('Resource list copied to clipboard!');
  };

  return (
    <div className="space-y-6 mt-4">
      <Link to="/Resources" className="nv-card nv-card--muted flex items-center justify-between gap-3 p-4">
        <div className="flex items-center gap-3 min-w-0">
          <Library className="h-6 w-6 text-brand-primary shrink-0" />
          <div>
            <p className="text-brand-text font-semibold">Browse the Full Resource Library</p>
            <p className="text-brand-muted-foreground text-sm">90+ curated guides, videos, legal tools & support groups</p>
          </div>
        </div>
        <ArrowRight className="h-5 w-5 text-brand-primary flex-shrink-0" />
      </Link>
      <Card>
        <CardHeader>
          <CardTitle className="text-brand-text text-lg flex items-center gap-2">
            <Bookmark className="h-5 w-5 text-brand-primary" />
            Your Saved Resources
          </CardTitle>
        </CardHeader>
        <CardContent>
          {bookmarkedResources.length === 0 ? (
            <div className="text-center py-10 text-brand-muted-foreground">
              <Bookmark className="h-10 w-10 mx-auto mb-3 opacity-40" />
              <p>You haven't saved any resources yet.</p>
              <p className="text-sm mt-1">Visit the Resources page and bookmark items to share them here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-brand-muted-foreground text-sm mb-3">Select resources to include in your shareable list:</p>
              {bookmarkedResources.map(r => {
                const isSelected = selectedIds.has(r.id);
                return (
                  <button key={r.id} onClick={() => toggleSelect(r.id)} aria-pressed={isSelected}
                    className={`nv-card w-full text-left p-3 cursor-pointer ${isSelected ? 'nv-card--muted border-brand-primary' : ''}`}>
                    <div className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded border flex-shrink-0 mt-0.5 flex items-center justify-center ${isSelected ? 'bg-brand-primary border-brand-primary' : 'border-brand-border'}`}>
                        {isSelected && <span className="text-brand-on-primary text-xs">✓</span>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-brand-text font-medium text-sm">{r.name}</p>
                        <p className="text-brand-muted-foreground text-xs">{r.org}</p>
                        <div className="flex gap-1 mt-1 flex-wrap">
                          <Badge variant="secondary" className="text-xs">{r.category}</Badge>
                          {r.type && <Badge variant="secondary" className="text-xs">{r.type}</Badge>}
                        </div>
                      </div>
                      <a href={r.url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                        className="text-brand-primary hover:text-brand-text flex-shrink-0 mt-0.5">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </button>
                );
              })}
              <div className="flex gap-2 pt-2">
                <Button onClick={buildShareText} disabled={selectedIds.size === 0} className="flex-1 !whitespace-normal">
                  <Share2 className="h-4 w-4 mr-2" />
                  Build Share List ({selectedIds.size})
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      {shareText && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="text-brand-text text-lg">Ready to Share</CardTitle>
              <Button size="sm" variant="outline" onClick={copyShareText}>
                <Copy className="h-4 w-4 mr-1" /> Copy
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <pre className="bg-brand-muted rounded-lg p-4 text-brand-text text-sm whitespace-pre-wrap break-words border border-brand-border font-body">
              {shareText}
            </pre>
            <p className="text-xs text-brand-muted-foreground mt-3 italic">
              Copy this and share via email, text, or with your mentor/support group.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}