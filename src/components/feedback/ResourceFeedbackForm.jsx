import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ThumbsUp, ThumbsDown, MessageSquare, CheckCircle2 } from 'lucide-react';

export default function ResourceFeedbackForm({ page = 'Home' }) {
  const { isAuthenticated, navigateToLogin } = useAuth();
  const [wasHelpful, setWasHelpful] = useState(null);
  const [topics, setTopics] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (wasHelpful === null) {
      setError('Please let us know if the information was helpful.');
      return;
    }
    setError('');
    setIsSaving(true);
    try {
      await base44.entities.ResourceFeedback.create({
        was_helpful: wasHelpful,
        topics_needing_support: topics.trim(),
        page,
      });
      setSubmitted(true);
    } catch {
      setError('Sorry, your feedback could not be sent. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (submitted) {
    return (
      <Card className="bg-white border-2 border-emerald-300 shadow-md mt-16">
        <CardContent className="p-8 text-center">
          <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto mb-3" />
          <h3 className="text-xl font-extrabold text-slate-900 mb-2">Thank you for sharing</h3>
          <p className="text-slate-700 font-medium">
            Your feedback helps us make this toolkit more useful for every survivor.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white border-2 border-slate-200 shadow-md mt-16">
      <CardContent className="p-8">
        <div className="flex items-start gap-3 mb-5">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-violet-500 to-sky-600 shadow-lg">
            <MessageSquare className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-900">Was this helpful?</h3>
            <p className="text-sm text-slate-700 font-medium">
              Tell us what's working and what topics you'd like more support on.
            </p>
          </div>
        </div>

        {!isAuthenticated ? (
          <div className="rounded-xl bg-slate-50 border-2 border-slate-200 p-5 text-center">
            <p className="text-slate-800 font-medium mb-4">
              Please sign in to share your feedback.
            </p>
            <Button onClick={navigateToLogin} className="bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-full px-6">
              Sign In
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex flex-wrap gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setWasHelpful(true)}
                className={`rounded-full font-bold px-6 border-2 ${
                  wasHelpful === true
                    ? 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700'
                    : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-50'
                }`}
              >
                <ThumbsUp className="h-4 w-4 mr-2" />
                Yes, it helped
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setWasHelpful(false)}
                className={`rounded-full font-bold px-6 border-2 ${
                  wasHelpful === false
                    ? 'bg-rose-600 text-white border-rose-600 hover:bg-rose-700'
                    : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-50'
                }`}
              >
                <ThumbsDown className="h-4 w-4 mr-2" />
                Not quite
              </Button>
            </div>

            <div>
              <label htmlFor="feedback-topics" className="block text-sm font-bold text-slate-900 mb-2">
                What topics do you need more support on? (optional)
              </label>
              <Textarea
                id="feedback-topics"
                value={topics}
                onChange={(e) => setTopics(e.target.value)}
                maxLength={1000}
                rows={3}
                placeholder="For example: fatigue at work, talking to HR, understanding my rights…"
                className="border-2 border-slate-300"
              />
            </div>

            {error && <p className="text-sm font-bold text-rose-700">{error}</p>}

            <Button
              type="submit"
              disabled={isSaving}
              className="bg-gradient-to-r from-violet-600 to-sky-600 hover:from-violet-700 hover:to-sky-700 text-white font-bold rounded-full px-8"
            >
              {isSaving ? 'Sending…' : 'Send Feedback'}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}