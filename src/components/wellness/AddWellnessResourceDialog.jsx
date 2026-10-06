import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Loader2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

const TOPIC_OPTIONS = [
  { id: 'fatigue_management', label: 'Fatigue Management' },
  { id: 'legal_rights', label: 'Legal Rights' },
  { id: 'emotional_wellbeing', label: 'Emotional Well-Being' },
  { id: 'workplace_accommodations', label: 'Workplace Accommodations' },
  { id: 'nutrition_movement', label: 'Nutrition & Movement' },
  { id: 'sleep_rest', label: 'Sleep & Rest' },
];

const TYPE_OPTIONS = ['article', 'guide', 'video', 'tool', 'website'];

const EMPTY_FORM = { title: '', summary: '', topic: '', type: 'article', url: '', source: '' };

export default function AddWellnessResourceDialog({ open, onOpenChange, onCreated }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(EMPTY_FORM);

  const setField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.WellnessResource.create(data),
    onSuccess: (resource) => {
      // Refresh every topic view so the new resource is listed immediately.
      queryClient.invalidateQueries({ queryKey: ['wellness-library'] });
      toast.success('Resource added to the wellness library.');
      setForm(EMPTY_FORM);
      onOpenChange(false);
      onCreated?.(resource);
    },
    onError: () => toast.error("The resource couldn't be saved. Please try again."),
  });

  const handleSubmit = () => {
    const title = form.title.trim();
    const url = form.url.trim();

    if (!title || !form.topic) {
      toast.error('Please add a title and choose a topic.');
      return;
    }
    if (url && !/^https?:\/\//i.test(url)) {
      toast.error('The external link must start with http:// or https://');
      return;
    }

    createMutation.mutate({
      title,
      topic: form.topic,
      type: form.type,
      url,
      summary: form.summary.trim(),
      source: form.source.trim(),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-extrabold text-slate-900">
            Add a wellness resource
          </DialogTitle>
          <DialogDescription className="text-sm font-medium text-slate-700">
            It appears in the Wellness Resource Library right away, for everyone who visits.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="wellness-title">Title *</Label>
            <Input
              id="wellness-title"
              value={form.title}
              onChange={(e) => setField('title', e.target.value)}
              placeholder="e.g. Managing Cancer-Related Fatigue at Work"
              className="border-2 border-slate-300"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="wellness-topic">Topic *</Label>
              <Select value={form.topic} onValueChange={(value) => setField('topic', value)}>
                <SelectTrigger id="wellness-topic" className="border-2 border-slate-300">
                  <SelectValue placeholder="Choose a topic" />
                </SelectTrigger>
                <SelectContent>
                  {TOPIC_OPTIONS.map((topic) => (
                    <SelectItem key={topic.id} value={topic.id}>{topic.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="wellness-type">Type</Label>
              <Select value={form.type} onValueChange={(value) => setField('type', value)}>
                <SelectTrigger id="wellness-type" className="border-2 border-slate-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TYPE_OPTIONS.map((type) => (
                    <SelectItem key={type} value={type} className="capitalize">{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="wellness-url">External link</Label>
            <Input
              id="wellness-url"
              value={form.url}
              onChange={(e) => setField('url', e.target.value)}
              placeholder="https://..."
              className="border-2 border-slate-300"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="wellness-source">Source</Label>
            <Input
              id="wellness-source"
              value={form.source}
              onChange={(e) => setField('source', e.target.value)}
              placeholder="e.g. American Cancer Society"
              className="border-2 border-slate-300"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="wellness-summary">Summary</Label>
            <Textarea
              id="wellness-summary"
              value={form.summary}
              onChange={(e) => setField('summary', e.target.value)}
              placeholder="One or two sentences on what this covers"
              rows={3}
              className="border-2 border-slate-300"
            />
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-2 font-bold"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={createMutation.isPending}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold"
          >
            {createMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Adding...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" /> Add resource
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}