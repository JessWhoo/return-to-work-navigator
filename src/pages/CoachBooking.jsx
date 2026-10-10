import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HeartHandshake, ShieldCheck, Sparkles, LogIn } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import useSEO from '@/hooks/useSEO';
import PageHeader from '@/components/brand/PageHeader';
import CoachBookingForm from '@/components/booking/CoachBookingForm';
import UpcomingBookings from '@/components/booking/UpcomingBookings';

const HIGHLIGHTS = [
  {
    Icon: HeartHandshake,
    title: 'Personalized guidance',
    text: 'Talk through your specific situation one-on-one.',
  },
  {
    Icon: Sparkles,
    title: 'Flexible formats',
    text: 'Video or phone — 30, 45, or 60 minutes.',
  },
  {
    Icon: ShieldCheck,
    title: 'Confidential',
    text: 'Your details are only shared with your coach.',
  },
];

export default function CoachBooking() {
  useSEO({
    title: 'Book a Coach',
    description: 'Schedule a one-on-one session with a return-to-work coach. Pick a time that works for you and get personalized guidance.',
    path: '/CoachBooking',
  });
  const { user, isAuthenticated, isLoadingAuth, navigateToLogin } = useAuth();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <PageHeader
        eyebrow="Support"
        title="Book a Return-to-Work Coach"
        subtitle="Pick a date and time that works for you. A coach will reach out to confirm your session and share meeting details."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {HIGHLIGHTS.map(({ Icon, title, text }) => (
          <Card key={title}>
            <CardContent className="flex items-start gap-3 p-4">
              <span className="mt-0.5 flex-shrink-0 rounded-pill bg-brand-muted p-2 text-brand-primary">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-bold text-brand-text">{title}</p>
                <p className="text-xs text-brand-muted-foreground">{text}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <UpcomingBookings enabled={!isLoadingAuth && !!isAuthenticated} />

      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-2xl font-bold text-brand-text">Schedule your session</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingAuth ? (
            <div className="flex justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-border border-t-brand-primary" />
            </div>
          ) : !isAuthenticated ? (
            <div className="space-y-4 py-8 text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-pill bg-brand-muted text-brand-primary">
                <LogIn className="h-7 w-7" />
              </span>
              <div className="space-y-1">
                <p className="text-lg font-bold text-brand-text">Sign in to book a session</p>
                <p className="mx-auto max-w-md text-sm text-brand-muted-foreground">
                  Booking is free — you just need an account so your coach can confirm the session and reach you.
                </p>
              </div>
              <Button onClick={() => navigateToLogin?.()}>
                Sign in to continue
              </Button>
            </div>
          ) : (
            <CoachBookingForm user={user} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}