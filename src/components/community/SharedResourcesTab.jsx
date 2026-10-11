import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CommunityResourceChoice from '@/components/community/CommunityResourceChoice';
import { Bookmark, Copy, Share2, Library, ArrowRight } from 'lucide-react';
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
              {bookmarkedResources.map(r => <CommunityResourceChoice key={r.id} resource={r} selected={selectedIds.has(r.id)} onToggle={() => toggleSelect(r.id)} />)}
              <div className="flex gap-2 pt-2">
                <Button onClick={buildShareText} disabled={selectedIds.size === 0} className="flex-1 !whitespace-normal">
                  <Share2 className="h-4 w-4" />
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
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle className="text-brand-text text-lg">Ready to Share</CardTitle>
              <Button size="sm" variant="outline" onClick={copyShareText}>
                <Copy className="h-4 w-4" /> Copy
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <pre className="rounded-brand-lg border border-brand-border bg-brand-muted p-4 font-body text-sm text-brand-text whitespace-pre-wrap [overflow-wrap:anywhere]">
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