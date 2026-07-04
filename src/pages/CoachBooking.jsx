import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarClock, HeartHandshake, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import useSEO from '@/hooks/useSEO';
import CoachBookingForm from '@/components/booking/CoachBookingForm';
import UpcomingBookings from '@/components/booking/UpcomingBookings';

export default function CoachBooking() {
  useSEO({
    title: 'Book a Coach',
    description: 'Schedule a one-on-one session with a return-to-work coach. Pick a time that works for you and get personalized guidance.',
    path: '/CoachBooking',
  });
  const { user, isAuthenticated, isLoadingAuth } = useAuth();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center space-y-4"
      >
        <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 via-violet-500 to-sky-600 flex items-center justify-center shadow-lg">
          <CalendarClock className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold">
          <span className="bg-gradient-to-r from-rose-600 via-violet-600 to-sky-700 bg-clip-text text-transparent">
            Book a Return-to-Work Coach
          </span>
        </h1>
        <p className="text-lg text-slate-800 max-w-2xl mx-auto font-medium">
          Pick a date and time that works for you. A coach will reach out to
          confirm your session and share meeting details.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-white border-2 border-rose-200">
          <CardContent className="p-4 flex items-start gap-3">
            <HeartHandshake className="h-6 w-6 text-rose-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-900 text-sm">Personalized guidance</p>
              <p className="text-xs text-slate-700 font-medium">Talk through your specific situation one-on-one.</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-2 border-sky-200">
          <CardContent className="p-4 flex items-start gap-3">
            <Sparkles className="h-6 w-6 text-sky-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-900 text-sm">Flexible formats</p>
              <p className="text-xs text-slate-700 font-medium">Video or phone — 30, 45, or 60 minutes.</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-2 border-emerald-200">
          <CardContent className="p-4 flex items-start gap-3">
            <ShieldCheck className="h-6 w-6 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-900 text-sm">Confidential</p>
              <p className="text-xs text-slate-700 font-medium">Your details are only shared with your coach.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <UpcomingBookings enabled={!isLoadingAuth && !!isAuthenticated} />

      <Card className="bg-white border-2 border-slate-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-extrabold text-slate-900">Schedule your session</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingAuth ? (
            <div className="py-12 flex justify-center">
              <div className="w-8 h-8 border-4 border-slate-200 border-t-rose-500 rounded-full animate-spin" />
            </div>
          ) : (
            <CoachBookingForm user={user} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}