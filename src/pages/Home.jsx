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
import HomeQuickNav from '@/components/home/HomeQuickNav';
import HomeTools from '@/components/home/HomeTools';
import HomeJourney from '@/components/home/HomeJourney';
import HomeFeatures from '@/components/home/HomeFeatures';
import HomeQuote from '@/components/home/HomeQuote';
import HomeProgressStats from '@/components/home/HomeProgressStats';
import HomeToolkit from '@/components/home/HomeToolkit';





export default function Home() {
  useSEO({
    title: 'Cancer Survivor Return-to-Work Toolkit & ADA Guide',
    description:
      'Free return-to-work toolkit for cancer survivors: request ADA workplace accommodations, manage treatment fatigue, know your FMLA rights, and plan a phased return.',
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
    mutationFn: async (updates) => {
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
    <div className="nv-home mx-auto max-w-7xl space-y-10 sm:space-y-12">
      <OnboardingFlow open={showOnboarding} onComplete={handleCompleteOnboarding} />
      <div><HomeHero canTour={isAuthenticated && !!progress} onTour={() => setShowOnboarding(true)} tourOpen={showOnboarding} /><HomeQuickNav /></div>
      <HomeTools />
      <HomeJourney progress={isProgressError ? null : progress} loading={isProgressLoading} error={isProgressError} onRetry={refetchProgress} />
      <HomeFeatures />
      <HomeQuote />
      <HomeProgressStats progress={progress} />
      <DailyCheckIn />
      {progress && <CalendarView progress={progress} onUpdateProgress={updates => updateProgressMutation.mutate(updates)} />}
      <HomeToolkit />
      <ManagerResourceHub />
      <ResourceFeedbackForm page="Home" />
      <SmsConsentCard />
    </div>
  );
}