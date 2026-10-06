import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Loader2 } from 'lucide-react';
import FeedbackEntryCard from '@/components/feedback/FeedbackEntryCard';
import useSEO from '@/hooks/useSEO';

export default function MyFeedback() {
  useSEO({
    title: 'My Saved Feedback',
    description: 'Review the feedback you have shared about wellness resources and the topics you asked for more support on.',
    path: '/MyFeedback',
  });

  const { user, isAuthenticated, isLoadingAuth, navigateToLogin } = useAuth();

  const { data: feedback, isLoading, isError, refetch } = useQuery({
    queryKey: ['myFeedback', user?.id],
    queryFn: () => base44.entities.ResourceFeedback.filter({ created_by_id: user.id }, '-created_date', 100),
    enabled: !isLoadingAuth && !!isAuthenticated && !!user?.id,
  });

  const entries = feedback || [];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-100 border-2 border-violet-300">
          <MessageSquare className="h-4 w-4 text-violet-700" />
          <span className="text-xs font-extrabold uppercase tracking-wider text-violet-700">My Feedback</span>
        </div>
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-violet-700 via-purple-600 to-emerald-700 bg-clip-text text-transparent">
          My Saved Feedback
        </h1>
        <p className="text-lg font-medium text-slate-800 max-w-2xl mx-auto">
          Everything you've shared about our resources, and the topics you'd like more support on.
        </p>
      </div>

      {isLoadingAuth || (isAuthenticated && isLoading) ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 text-violet-600 animate-spin" />
        </div>
      ) : !isAuthenticated ? (
        <Card className="bg-white border-2 border-slate-300">
          <CardContent className="p-10 text-center space-y-4">
            <MessageSquare className="h-10 w-10 text-violet-500 mx-auto" />
            <h2 className="text-xl font-extrabold text-slate-900">Sign in to see your feedback</h2>
            <p className="text-sm font-medium text-slate-700">
              Your saved feedback is private to your account.
            </p>
            <Button onClick={navigateToLogin} className="bg-violet-700 hover:bg-violet-800 text-white font-bold rounded-full px-6">
              Sign In
            </Button>
          </CardContent>
        </Card>
      ) : isError ? (
        <Card className="bg-white border-2 border-slate-300">
          <CardContent className="p-10 text-center space-y-4">
            <h2 className="text-lg font-extrabold text-slate-900">We couldn't load your feedback</h2>
            <Button onClick={() => refetch()} variant="outline" className="border-2 font-bold">Try again</Button>
          </CardContent>
        </Card>
      ) : entries.length === 0 ? (
        <Card className="bg-white border-2 border-slate-300">
          <CardContent className="p-10 text-center space-y-4">
            <MessageSquare className="h-10 w-10 text-slate-400 mx-auto" />
            <h2 className="text-xl font-extrabold text-slate-900">No feedback yet</h2>
            <p className="text-sm font-medium text-slate-700">
              Open a resource in the Wellness Library and tap "Share feedback" to tell us what helped and what you need more of.
            </p>
            <Button asChild className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold">
              <Link to="/WellnessLibrary">Go to the Wellness Library</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => <FeedbackEntryCard key={entry.id} entry={entry} />)}
        </div>
      )}
    </div>
  );
}