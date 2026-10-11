import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import CalendarView from '../components/dashboard/CalendarView';
import OnboardingFlow from '../components/OnboardingFlow';
import DailyCheckIn from '../components/DailyCheckIn';
import ResourceFeedbackForm from '@/components/feedback/ResourceFeedbackForm';
import SmsConsentCard from '@/components/sms/SmsConsentCard';
import ManagerResourceHub from '@/components/managerguide/ManagerResourceHub';
import useSEO from '@/hooks/useSEO';
import { useAuth } from '@/lib/AuthContext';
import { useUserProgress } from '@/hooks/useUserProgress';
import BrandMark from '@/components/brand/BrandMark';
import {
  CompassIcon, JourneyIcon, MessageIcon, ScheduleIcon, StepCompleteIcon,
  WellbeingIcon, NeedsAttentionIcon, ProfileIcon, AddStepIcon,
} from '@/components/brand/BrandIcon';

// The four stages of the return-to-work journey (UserProgress.journey_stage).
const JOURNEY_STAGES = [
  { value: 'planning', label: 'Planning', blurb: 'Gather your bearings, decide what to share, and set a pace that holds.' },
  { value: 'first_week', label: 'First week', blurb: 'Half-days and clear check-ins, with room to rest between them.' },
  { value: 'ongoing', label: 'Ongoing', blurb: 'Settled rhythms, honest reviews of what is working, small adjustments.' },
  { value: 'completed', label: 'Completed', blurb: 'Back in step, with a plan you can return to whenever you need it.' },
];

const sectionGroups = [
  {
    groupTitle: 'Plan & Track',
    groupDescription: 'Map out your return and stay on top of it.',
    items: [
      {
        title: 'My Journey Checklist',
        description: 'Track your progress through each phase of returning to work',
        icon: StepCompleteIcon,
        page: 'Checklist',
      },
      {
        title: 'Return Planning',
        description: 'Create a phased return-to-work schedule',
        icon: ScheduleIcon,
        page: 'ReturnPlanning',
      },
    ],
  },
  {
    groupTitle: 'Work & Career',
    groupDescription: 'Conversations, requests, and next opportunities.',
    items: [
      {
        title: 'Communication Tools',
        description: 'Templates, scripts, and guidance for workplace conversations',
        icon: MessageIcon,
        page: 'Communication',
      },
      {
        title: 'Request Accommodations',
        description: 'Learn about your rights and generate accommodation requests',
        icon: AddStepIcon,
        page: 'Accommodations',
      },
      {
        title: 'Job Boards',
        description: 'Cancer-friendly job boards, returnship programs, and remote opportunities',
        icon: CompassIcon,
        page: 'JobBoards',
      },
    ],
  },
  {
    groupTitle: 'Health & Support',
    groupDescription: 'Care for your energy and your emotional well-being.',
    items: [
      {
        title: 'Energy & Fatigue',
        description: 'Manage fatigue with pacing strategies and energy tracking',
        icon: WellbeingIcon,
        page: 'EnergyManagement',
      },
      {
        title: 'Emotional Support',
        description: 'Resources for managing anxiety and building confidence',
        icon: ProfileIcon,
        page: 'EmotionalSupport',
      },
    ],
  },
  {
    groupTitle: 'Rights & Legal',
    groupDescription: 'Know the protections that stand behind you.',
    items: [
      {
        title: 'Legal Rights',
        description: 'Understand ADA, FMLA, and your workplace protections',
        icon: NeedsAttentionIcon,
        page: 'LegalRights',
      },
    ],
  },
  {
    groupTitle: 'Learn & Connect',
    groupDescription: 'Guides, coaching, and stories to walk alongside you.',
    items: [
      {
        title: 'Resource Library',
        description: 'Access curated guides, organizations, and support services',
        icon: JourneyIcon,
        page: 'Resources',
      },
      {
        title: 'Book a Coach',
        description: 'Schedule a one-on-one session with a return-to-work coach at a time that works for you',
        icon: ScheduleIcon,
        page: 'CoachBooking',
      },
      {
        title: 'From the Founder',
        description: 'Blog posts from Jess — reflections, inspiration, and hope for the road back to work',
        icon: MessageIcon,
        page: 'Blog',
      },
    ],
  },
];

export default function Home() {
  useSEO({
    title: 'Your Return-to-Work Dashboard',
    description: 'Your return-to-work compass for cancer survivors. Track progress, manage energy, request accommodations, and find support — at your own pace.',
    path: '/home'
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

  const stageIndex = Math.max(
    0,
    JOURNEY_STAGES.findIndex(s => s.value === (progress?.journey_stage || 'planning'))
  );
  const currentStage = JOURNEY_STAGES[stageIndex];
  const stagePercent = Math.round(((stageIndex + 1) / JOURNEY_STAGES.length) * 100);

  const stats = [
    {
      label: 'Checklist items',
      value: progress?.completed_checklist_items?.length || 0,
      blurb: 'Steps you have marked off so far.',
    },
    {
      label: 'Current stage',
      value: currentStage.label,
      blurb: 'Where you are on the road back.',
    },
    {
      label: 'Saved resources',
      value: progress?.bookmarked_resources?.length || 0,
      blurb: 'Guides and tools you kept for later.',
    },
  ];

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
      <figure className="overflow-hidden rounded-brand-lg border border-brand-border shadow-brand-sm"><img src="https://media.base44.com/images/public/69406c752de234aafebf891d/4835056a4_unnamed.png" alt="Every Survivor Deserves a Standing Ovation - Celebrating the strength, beauty, and resilience of cancer survivors" loading="lazy" decoding="async" className="block h-auto w-full" /></figure>
      <ManagerResourceHub />
      <ResourceFeedbackForm page="Home" />
      <SmsConsentCard />
    </div>
  );
}