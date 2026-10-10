import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Loader2 } from 'lucide-react';
import FeedbackEntryCard from '@/components/feedback/FeedbackEntryCard';
import PageHeader from '@/components/brand/PageHeader';
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
      <PageHeader
        eyebrow="Support"
        title="My Saved Feedback"
        subtitle="Everything you've shared about our resources, and the topics you'd like more support on."
      />

      {isLoadingAuth || (isAuthenticated && isLoading) ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
        </div>
      ) : !isAuthenticated ? (
        <Card>
          <CardContent className="space-y-4 p-10 text-center">
            <MessageSquare className="mx-auto h-10 w-10 text-brand-primary" />
            <h2 className="font-heading text-xl font-bold text-brand-text">Sign in to see your feedback</h2>
            <p className="text-sm text-brand-muted-foreground">
              Your saved feedback is private to your account.
            </p>
            <Button onClick={navigateToLogin}>
              Sign In
            </Button>
          </CardContent>
        </Card>
      ) : isError ? (
        <Card>
          <CardContent className="space-y-4 p-10 text-center">
            <h2 className="font-heading text-lg font-bold text-brand-text">We couldn't load your feedback</h2>
            <Button onClick={() => refetch()} variant="outline">Try again</Button>
          </CardContent>
        </Card>
      ) : entries.length === 0 ? (
        <Card>
          <CardContent className="space-y-4 p-10 text-center">
            <MessageSquare className="mx-auto h-10 w-10 text-brand-muted-foreground" />
            <h2 className="font-heading text-xl font-bold text-brand-text">No feedback yet</h2>
            <p className="text-sm text-brand-muted-foreground">
              Open a resource in the Wellness Library and tap "Share feedback" to tell us what helped and what you need more of.
            </p>
            <Button asChild>
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