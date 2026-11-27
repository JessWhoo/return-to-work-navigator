import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import CalendarView from '@/components/dashboard/CalendarView';
import OnboardingFlow from '@/components/OnboardingFlow';
import DailyCheckIn from '@/components/DailyCheckIn';
import ResourceFeedbackForm from '@/components/feedback/ResourceFeedbackForm';
import SmsConsentCard from '@/components/sms/SmsConsentCard';
import ManagerResourceHub from '@/components/managerguide/ManagerResourceHub';
import useSEO from '@/hooks/useSEO';
import { useAuth } from '@/lib/AuthContext';
import { useUserProgress } from '@/hooks/useUserProgress';
import HomeHero from '@/components/home/HomeHero';
import HomeTaskChoices from '@/components/home/HomeTaskChoices';
import HomeFounderIntro from '@/components/home/HomeFounderIntro';
import HomeSamplePreview from '@/components/home/HomeSamplePreview';
import HomeJourney from '@/components/home/HomeJourney';
import HomeFeatures from '@/components/home/HomeFeatures';
import HomeQuote from '@/components/home/HomeQuote';
import HomeToolkit from '@/components/home/HomeToolkit';





export default function Home() {
  useSEO({
    title: 'Return to Work Navigator',
    description:
      'Return to Work Navigator helps cancer survivors manage fatigue, request workplace accommodations, and understand legal rights.',
    path: '/',
  });
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);

  const { data: progress, isLoading: isProgressLoading, isError: isProgressError, refetch: refetchProgress } = useUserProgress({
    completed_checklist_items: [],
    journey_stage: 'planning',
    calendar_events: [],
    onboarding_completed: false
  });

  useEffect(() => {
    if (progress && !progress.onboarding_completed) {
      setShowOnboarding(true);
    }
  }, [progress]);

  const updateProgressMutation = useMutation({
    mutationFn: async (/** @type {any} */ updates) => {
      if (!progress?.id) return null;
      return await base44.entities.UserProgress.update(progress.id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProgress'] });
    }
  });

  const completeOnboardingMutation = useMutation({
    mutationFn: async () => {
      if (!progress?.id) return null;
      return await base44.entities.UserProgress.update(progress.id, {
        onboarding_completed: true
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProgress'] });
      setShowOnboarding(false);
    }
  });

  const handleCompleteOnboarding = () => {
    if (completeOnboardingMutation.isPending) return;
    completeOnboardingMutation.mutate();
  };

  return (
    <div className="nv-home mx-auto max-w-7xl space-y-14 sm:space-y-20">
      <OnboardingFlow open={showOnboarding} onComplete={handleCompleteOnboarding} />
      <HomeHero canTour={isAuthenticated && !!progress} onTour={() => setShowOnboarding(true)} tourOpen={showOnboarding} isAuthenticated={isAuthenticated} />
      <HomeTaskChoices />
      <HomeJourney progress={isProgressError ? null : progress} loading={isProgressLoading} error={isProgressError} onRetry={refetchProgress} />

      <section aria-label="Today" className="space-y-5 rounded-brand-lg bg-brand-muted px-5 py-8 sm:px-8 sm:py-10">
        <p className="nv-eyebrow nv-eyebrow--primary">Today</p>
        <DailyCheckIn />
        {progress && <CalendarView progress={progress} onUpdateProgress={updates => updateProgressMutation.mutate(updates)} />}
      </section>

      <HomeSamplePreview />
      <HomeToolkit />
      <HomeFeatures />
      <HomeQuote />

      <section aria-label="For employers" className="space-y-4">
        <p className="nv-eyebrow nv-eyebrow--primary">For employers</p>
        <ManagerResourceHub />
      </section>

      <HomeFounderIntro />

      <section aria-label="Stay in touch" className="space-y-5">
        <p className="nv-eyebrow nv-eyebrow--primary">Stay in touch</p>
        <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
          <ResourceFeedbackForm page="Home" />
          <SmsConsentCard />
        </div>
      </section>
    </div>
  );
}