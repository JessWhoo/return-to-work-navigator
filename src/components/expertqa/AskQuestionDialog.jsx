import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog, DialogHeader, DialogTitle, DialogTrigger, DialogFooter
} from '@/components/ui/dialog';
import BottomSheetSelect from '@/components/ui/bottom-sheet-select';
import DialogContent from '@/components/resources/ResourceDialogContent';
import { Plus, Shield, LogIn } from 'lucide-react';
import { TOPICS } from './expertQaData';

export default function AskQuestionDialog({ open, onOpenChange, currentUser, onCreated }) {
  const [question, setQuestion] = useState('');
  const [details, setDetails] = useState('');
  const [topic, setTopic] = useState('');
  const [anonymous, setAnonymous] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const reset = () => {
    setQuestion(''); setDetails(''); setTopic(''); setAnonymous(true); setError('');
  };

  const submit = async () => {
    if (!question.trim() || !topic) return;
    setSubmitting(true);
    setError('');
    try {
      // Verify the user is authenticated before attempting to create.
      // ExpertQA has an RLS create rule that requires the record be tied to a user.
      let user = currentUser;
      if (!user) {
        try {
          user = await base44.auth.me();
        } catch {
          user = null;
        }
      }
      if (!user) {
        setError('Please log in to ask a question. You can sign in from the top-right and try again.');
        setSubmitting(false);
        return;
      }

      const payload = {
        question: question.trim(),
        topic,
        is_anonymous: anonymous,
        asker_name: anonymous ? 'Anonymous' : (user.full_name || 'Anonymous'),
        status: 'pending',
      };
      if (details.trim()) payload.question_details = details.trim();
      await base44.entities.ExpertQA.create(payload);
      reset();
      onOpenChange(false);
      onCreated?.();
    } catch (err) {
      const msg = err?.message || '';
      if (/permission denied/i.test(msg)) {
        setError("You need to be signed in to submit a question. Please log in and try again.");
      } else {
        setError(msg || 'Could not submit your question. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Unauthenticated visitors: replace the "Ask a question" button with a
  // sign-in prompt, so we never even attempt a 403-guaranteed create call.
  if (!currentUser) {
    return (
      <Button asChild className="!whitespace-normal">
        <Link to="/login">
          <LogIn className="h-4 w-4" /> Sign in to ask
        </Link>
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="!whitespace-normal">
          <Plus className="h-4 w-4" /> Ask a question
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Ask an Expert</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-bold text-brand-text mb-1 block">Topic</label>
            <BottomSheetSelect value={topic} onValueChange={setTopic}
              title="Topic" placeholder="Choose a topic..." className="min-h-11"
              options={TOPICS.filter(t => t.id !== 'all').map(t => ({ value: t.id, label: t.label }))} />
          </div>
          <div>
            <label className="text-sm font-bold text-brand-text mb-1 block">Your question</label>
            <Input
              aria-label="Your question"
              placeholder="E.g., How do I request reduced hours after treatment?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              maxLength={200}
            />
          </div>
          <div>
            <label className="text-sm font-bold text-brand-text mb-1 block">
              More context <span className="text-brand-muted-foreground font-normal">(optional)</span>
            </label>
            <Textarea
              aria-label="More context (optional)"
              placeholder="Add any details that would help an expert answer..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={4}
              maxLength={1000}
            />
          </div>
          <label className="flex min-h-11 cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={anonymous}
              onChange={(e) => setAnonymous(e.target.checked)}
              className="h-4 w-4 accent-primary"
            />
            <span className="text-sm text-brand-text font-medium">Ask anonymously</span>
          </label>
          <p className="text-xs text-brand-muted-foreground -mt-2">
            <Shield className="inline h-3 w-3 -mt-0.5 text-brand-muted-foreground" />
            Your name won't be shown publicly when "anonymously" is checked. Your account is still
            linked internally so our moderators can respond and keep this space safe.
          </p>
          {error && (
            <div role="alert" className="rounded-brand bg-destructive/10 border border-destructive/30 p-3 text-sm text-destructive font-medium">
              {error}
            </div>
          )}
        </div>
        <DialogFooter className="border-t border-brand-border pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            onClick={submit}
            disabled={!question.trim() || !topic || submitting}
            className="!whitespace-normal"
          >
            {submitting ? 'Submitting...' : 'Submit question'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}