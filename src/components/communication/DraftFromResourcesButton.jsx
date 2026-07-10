import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { Sparkles, Loader2, Bookmark } from 'lucide-react';
import { toast } from 'sonner';
import { resources as resourceCatalog } from '@/components/resources/resourcesData';

/**
 * Button + dialog that asks the accommodation_email_assistant backend function
 * to generate a CommunicationDraft based on the user's bookmarked resources.
 */
export default function DraftFromResourcesButton() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [recipient, setRecipient] = useState('supervisor');
  const [tone, setTone] = useState('professional');
  const [notes, setNotes] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: progress } = useQuery({
    queryKey: ['userProgress'],
    queryFn: async () => {
      const list = await base44.entities.UserProgress.list();
      return list[0] || null;
    },
  });

  const bookmarkedIds = progress?.bookmarked_resources || [];
  const bookmarkedResources = resolveBookmarkedResources(bookmarkedIds);
  const canGenerate = bookmarkedResources.length > 0;

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const { data } = await base44.functions.invoke('draftAccommodationFromResources', {
        savedResources: bookmarkedResources,
        recipient,
        tone,
        accommodationsNeeded: notes.trim() || undefined,
      });

      if (data?.error) {
        toast.error(data.error);
        return;
      }

      base44.analytics.track({
        eventName: 'accommodation_draft_generated_from_resources',
        properties: {
          resource_count: bookmarkedResources.length,
          recipient,
          tone,
        },
      });

      toast.success('Draft created from your saved resources');
      queryClient.invalidateQueries({ queryKey: ['communication-drafts'] });
      setOpen(false);
      setNotes('');
    } catch (err) {
      toast.error(err?.message || 'Could not generate draft');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-violet-600 to-emerald-600 hover:from-violet-700 hover:to-emerald-700 text-white font-bold shadow-md">
          <Sparkles className="h-4 w-4 mr-2" />
          Draft from my saved resources
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-slate-900 font-extrabold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-violet-600" />
            Generate accommodation email
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="rounded-lg border-2 border-violet-200 bg-violet-50 p-3 flex items-start gap-3">
            <Bookmark className="h-5 w-5 text-violet-700 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-slate-800">
              {canGenerate ? (
                <>
                  Using <strong>{bookmarkedResources.length}</strong> bookmarked{' '}
                  {bookmarkedResources.length === 1 ? 'resource' : 'resources'} from your
                  Resource Library to shape the accommodations mentioned.
                </>
              ) : (
                <>
                  You haven't saved any resources yet. Head to the Resource Library and
                  bookmark a few articles about the accommodations you're considering.
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-slate-800 font-semibold">Recipient</Label>
              <Select value={recipient} onValueChange={setRecipient}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="supervisor">Supervisor / manager</SelectItem>
                  <SelectItem value="HR">HR</SelectItem>
                  <SelectItem value="team lead">Team lead</SelectItem>
                  <SelectItem value="employer">Employer (generic)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-slate-800 font-semibold">Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="collaborative">Collaborative</SelectItem>
                  <SelectItem value="assertive">Assertive</SelectItem>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label className="text-slate-800 font-semibold">
              Anything specific to mention? <span className="font-normal text-slate-500">(optional)</span>
            </Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="E.g. I'd like flexible start times and 2 remote days per week during treatment."
              className="mt-1 min-h-[80px]"
              maxLength={500}
            />
          </div>
        </div>

        <DialogFooter className="pt-4">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isGenerating}
          >
            Cancel
          </Button>
          <Button
            onClick={handleGenerate}
            disabled={!canGenerate || isGenerating}
            className="bg-gradient-to-r from-violet-600 to-emerald-600 hover:from-violet-700 hover:to-emerald-700 text-white font-bold"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating…
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate draft
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Resolve stored bookmark IDs (`"<Category>-<index>"`) back to the underlying
 * resource records so the backend can prompt the LLM with real content.
 */
function resolveBookmarkedResources(ids) {
  if (!Array.isArray(ids) || ids.length === 0) return [];
  return ids
    .map((id) => {
      const lastDash = id.lastIndexOf('-');
      if (lastDash === -1) return null;
      const categoryName = id.slice(0, lastDash);
      const idx = Number(id.slice(lastDash + 1));
      if (Number.isNaN(idx)) return null;
      const category = resourceCatalog.find((c) => c.category === categoryName);
      const item = category?.items?.[idx];
      if (!item) return null;
      return {
        name: item.name,
        org: item.org,
        description: item.description,
        topics: item.topics || [],
      };
    })
    .filter(Boolean);
}