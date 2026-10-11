import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import BrandChoice from '@/components/brand/BrandChoice';
import { Textarea } from '@/components/ui/textarea';
import { ThumbsUp, ThumbsDown, CheckCircle2, Loader2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

/**
 * Feedback about one specific wellness resource: was it helpful, plus free text
 * describing the topics the person still needs more support on.
 */
export default function WellnessResourceFeedbackDialog({ resource, open, onOpenChange }) {
  const queryClient = useQueryClient();
  const [wasHelpful, setWasHelpful] = useState(null);
  const [topics, setTopics] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const submitMutation = useMutation({
    mutationFn: (data) => base44.entities.ResourceFeedback.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myFeedback'] });
      setSubmitted(true);
      toast.success('Your feedback is saved.');
    },
    onError: () => toast.error("Your feedback couldn't be saved. Please try again."),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (wasHelpful === null) {
      toast.error('Please let us know whether this resource was helpful.');
      return;
    }
    submitMutation.mutate({
      was_helpful: wasHelpful,
      topics_needing_support: topics.trim(),
      resource_title: resource?.title || '',
      page: 'WellnessLibrary',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        {submitted ? (
          <div className="text-center space-y-4 py-4">
            <CheckCircle2 className="h-12 w-12 text-primary mx-auto" />
            <DialogTitle className="text-xl font-bold text-brand-text">Thank you for sharing</DialogTitle>
            <p className="break-words text-sm text-brand-muted-foreground">
              Your feedback is saved and helps us support every survivor better.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
              <Button asChild className="!whitespace-normal">
                <Link to="/MyFeedback" onClick={() => onOpenChange(false)}>View my feedback</Link>
              </Button>
              <Button variant="outline" onClick={() => onOpenChange(false)} className="!whitespace-normal">
                Close
              </Button>
            </div>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-brand-text">Share your feedback</DialogTitle>
              <DialogDescription className="break-words text-sm text-brand-muted-foreground">
                {resource?.title ? `About: ${resource.title}` : 'Tell us how this resource worked for you.'}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-brand-text">Was this resource helpful? *</p>
                <div className="flex flex-wrap gap-3">
                  <BrandChoice selected={wasHelpful === true} icon={ThumbsUp} onClick={() => setWasHelpful(true)}>Yes, it helped</BrandChoice>
                  <BrandChoice selected={wasHelpful === false} icon={ThumbsDown} onClick={() => setWasHelpful(false)}>Not quite</BrandChoice>
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="wellness-feedback-topics" className="block text-sm font-semibold text-brand-text">
                  What topics do you need more support on?
                </label>
                <Textarea
                  id="wellness-feedback-topics"
                  value={topics}
                  onChange={(e) => setTopics(e.target.value)}
                  maxLength={1000}
                  rows={4}
                  placeholder="For example: fatigue at work, talking to HR, understanding my rights…"
                  className="nv-input"
                />
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-brand-border pt-4 sm:flex-row sm:justify-end">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="!whitespace-normal">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitMutation.isPending}
                  className="!whitespace-normal"
                >
                  {submitMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Save feedback
                </Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}