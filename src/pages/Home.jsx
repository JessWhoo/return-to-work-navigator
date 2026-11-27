import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import OnboardingFlow from '@/components/OnboardingFlow';
import useSEO from '@/hooks/useSEO';
import { useAuth } from '@/lib/AuthContext';
import { useUserProgress } from '@/hooks/useUserProgress';
import HomeHero from '@/components/home/HomeHero';
import HomeTaskChoices from '@/components/home/HomeTaskChoices';
import HomeMoreSections from '@/components/home/HomeMoreSections';
import HomeQuote from '@/components/home/HomeQuote';

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
    onboarding_completed: false,
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
    },
  });

  const completeOnboardingMutation = useMutation({
    mutationFn: async () => {
      if (!progress?.id) return null;
      return await base44.entities.UserProgress.update(progress.id, {
        onboarding_completed: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProgress'] });
      setShowOnboarding(false);
    },
  });

  const handleCompleteOnboarding = () => {
    if (completeOnboardingMutation.isPending) return;
    completeOnboardingMutation.mutate();
  };

  return (
    <div className="nv-home mx-auto max-w-5xl space-y-12 sm:space-y-16">
      <OnboardingFlow open={showOnboarding} onComplete={handleCompleteOnboarding} />
      <HomeHero
        canTour={isAuthenticated && !!progress}
        onTour={() => setShowOnboarding(true)}
        tourOpen={showOnboarding}
        isAuthenticated={isAuthenticated}
      />
      <HomeTaskChoices />
      <HomeMoreSections
        progress={progress}
        isProgressLoading={isProgressLoading}
        isProgressError={isProgressError}
        refetchProgress={refetchProgress}
        onUpdateProgress={(updates) => updateProgressMutation.mutate(updates)}
      />
      <HomeQuote />
    </div>
  );
}