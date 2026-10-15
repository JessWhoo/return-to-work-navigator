import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import BottomSheetSelect from '@/components/ui/bottom-sheet-select';
import { Plus, X } from 'lucide-react';
import { toast } from 'sonner';
import { FORUM_TOPICS } from './forumTopics';

export default function ForumPostComposer({ currentUser, onCreated }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [topic, setTopic] = useState('general');
  const [anonymous, setAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!title.trim() || !content.trim() || submitting) return;
    setSubmitting(true);
    try {
      await base44.entities.ForumPost.create({
        title: title.trim(),
        content: content.trim(),
        topic,
        author_name: anonymous ? 'Anonymous' : (currentUser?.full_name || 'Member'),
        is_anonymous: anonymous,
        likes: 0,
        liked_by: [],
        reply_count: 0,
      });
      setTitle(''); setContent(''); setTopic('general'); setAnonymous(false);
      setOpen(false);
      toast.success('Discussion posted!');
      onCreated?.();
    } catch {
      toast.error('Could not post your discussion. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) {
    return (
      <Button variant="outline" onClick={() => setOpen(true)} className="w-full sm:w-auto">
        <Plus className="h-4 w-4" /> Start a discussion
      </Button>
    );
  }

  return (
    <Card>
      <CardContent className="pt-5 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-heading font-bold text-brand-text">New discussion</h3>
          <Button variant="ghost" size="icon" aria-label="Close composer" onClick={() => setOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <Input
          aria-label="Discussion title"
          placeholder="Give your discussion a title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={140}
        />

        <BottomSheetSelect
          value={topic}
          onValueChange={setTopic}
          title="Topic"
          placeholder="Choose a topic..."
          className="min-h-11"
          options={FORUM_TOPICS.map(t => ({ value: t.value, label: t.label }))}
        />

        <Textarea
          aria-label="Discussion details"
          placeholder="Share what you're navigating, asking, or celebrating..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          maxLength={2000}
        />

        <label className="flex min-h-11 cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={anonymous}
            onChange={(e) => setAnonymous(e.target.checked)}
            className="h-4 w-4 accent-primary"
          />
          <span className="text-sm font-medium text-brand-text">Post anonymously</span>
        </label>

        <div className="flex flex-wrap justify-end gap-3 border-t border-brand-border pt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={submit} disabled={!title.trim() || !content.trim() || submitting}>
            {submitting ? 'Posting...' : 'Post discussion'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}