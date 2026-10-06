import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
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
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-white">
        {submitted ? (
          <div className="text-center space-y-4 py-4">
            <CheckCircle2 className="h-12 w-12 text-emerald-600 mx-auto" />
            <DialogTitle className="text-xl font-extrabold text-slate-900">Thank you for sharing</DialogTitle>
            <p className="text-sm font-medium text-slate-700">
              Your feedback is saved and helps us support every survivor better.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
              <Button asChild className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold">
                <Link to="/MyFeedback" onClick={() => onOpenChange(false)}>View my feedback</Link>
              </Button>
              <Button variant="outline" onClick={() => onOpenChange(false)} className="border-2 font-bold">
                Close
              </Button>
            </div>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-extrabold text-slate-900">Share your feedback</DialogTitle>
              <DialogDescription className="text-sm font-medium text-slate-700">
                {resource?.title ? `About: ${resource.title}` : 'Tell us how this resource worked for you.'}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <p className="text-sm font-bold text-slate-900">Was this resource helpful? *</p>
                <div className="flex flex-wrap gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setWasHelpful(true)}
                    className={`rounded-full font-bold px-5 border-2 ${
                      wasHelpful === true
                        ? 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700'
                        : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <ThumbsUp className="h-4 w-4 mr-2" /> Yes, it helped
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setWasHelpful(false)}
                    className={`rounded-full font-bold px-5 border-2 ${
                      wasHelpful === false
                        ? 'bg-rose-600 text-white border-rose-600 hover:bg-rose-700'
                        : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <ThumbsDown className="h-4 w-4 mr-2" /> Not quite
                  </Button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="wellness-feedback-topics" className="block text-sm font-bold text-slate-900">
                  What topics do you need more support on?
                </label>
                <Textarea
                  id="wellness-feedback-topics"
                  value={topics}
                  onChange={(e) => setTopics(e.target.value)}
                  maxLength={1000}
                  rows={4}
                  placeholder="For example: fatigue at work, talking to HR, understanding my rights…"
                  className="border-2 border-slate-300"
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="border-2 font-bold">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitMutation.isPending}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold"
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