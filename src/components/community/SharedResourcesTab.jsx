import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bookmark, Copy, ExternalLink, Share2, Library, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { resources as allResources } from '../../components/resources/resourcesData';

export default function SharedResourcesTab() {
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [shareText, setShareText] = useState('');

  const { data: progress } = useQuery({
    queryKey: ['userProgress'],
    queryFn: async () => {
      const list = await base44.entities.UserProgress.list();
      return list[0] || null;
    }
  });

  const bookmarkedIds = progress?.bookmarked_resources || [];

  // Resolve bookmarked resources from all categories
  const bookmarkedResources = allResources.flatMap((cat, catIdx) =>
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
      {/* Link to main Resource Library */}
      <Link to="/Resources">
        <div className="flex items-center justify-between bg-gradient-to-r from-teal-900/60 to-cyan-900/60 border border-teal-600 rounded-xl p-4 hover:border-teal-400 transition-all cursor-pointer">
          <div className="flex items-center gap-3">
            <Library className="h-6 w-6 text-teal-300" />
            <div>
              <p className="text-white font-semibold">Browse the Full Resource Library</p>
              <p className="text-slate-400 text-sm">90+ curated guides, videos, legal tools & support groups</p>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 text-teal-400 flex-shrink-0" />
        </div>
      </Link>
      <Card className="bg-slate-800 border-slate-600">
        <CardHeader>
          <CardTitle className="text-slate-100 text-lg flex items-center gap-2">
            <Bookmark className="h-5 w-5 text-teal-400" />
            Your Saved Resources
          </CardTitle>
        </CardHeader>
        <CardContent>
          {bookmarkedResources.length === 0 ? (
            <div className="text-center py-10 text-slate-400">
              <Bookmark className="h-10 w-10 mx-auto mb-3 opacity-40" />
              <p>You haven't saved any resources yet.</p>
              <p className="text-sm mt-1">Visit the Resources page and bookmark items to share them here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-slate-400 text-sm mb-3">Select resources to include in your shareable list:</p>
              {bookmarkedResources.map(r => {
                const isSelected = selectedIds.has(r.id);
                return (
                  <button key={r.id} onClick={() => toggleSelect(r.id)}
                    className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                      isSelected ? 'border-teal-500 bg-teal-900/30' : 'border-slate-600 bg-slate-700/30 hover:border-slate-500'
                    }`}>
                    <div className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded border-2 flex-shrink-0 mt-0.5 flex items-center justify-center ${
                        isSelected ? 'bg-teal-600 border-teal-600' : 'border-slate-500'
                      }`}>
                        {isSelected && <span className="text-white text-xs">✓</span>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-slate-100 font-medium text-sm">{r.name}</p>
                        <p className="text-slate-400 text-xs">{r.org}</p>
                        <div className="flex gap-1 mt-1 flex-wrap">
                          <Badge className="bg-slate-600 text-slate-300 text-xs">{r.category}</Badge>
                          {r.type && <Badge className="bg-slate-600 text-slate-300 text-xs">{r.type}</Badge>}
                        </div>
                      </div>
                      <a href={r.url} target="_blank" rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                        className="text-teal-400 hover:text-teal-300 flex-shrink-0 mt-0.5">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </button>
                );
              })}

              <div className="flex gap-2 pt-2">
                <Button onClick={buildShareText} disabled={selectedIds.size === 0}
                  className="flex-1 bg-teal-600 hover:bg-teal-700">
                  <Share2 className="h-4 w-4 mr-2" />
                  Build Share List ({selectedIds.size})
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {shareText && (
        <Card className="bg-slate-800 border-teal-500 border-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-teal-300 text-lg">Ready to Share</CardTitle>
              <Button size="sm" variant="outline" onClick={copyShareText}
                className="border-teal-500 text-teal-300 hover:bg-teal-900/30">
                <Copy className="h-4 w-4 mr-1" /> Copy
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <pre className="bg-slate-900 rounded-lg p-4 text-slate-200 text-sm leading-relaxed whitespace-pre-wrap border border-slate-700 font-sans">
              {shareText}
            </pre>
            <p className="text-xs text-slate-500 mt-3 italic">
              Copy this and share via email, text, or with your mentor/support group.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}