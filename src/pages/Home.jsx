import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
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
  const navigate = useNavigate();
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
    <div className="max-w-7xl mx-auto">
      <OnboardingFlow
        open={showOnboarding}
        onComplete={handleCompleteOnboarding}
      />

      {/* Hero — watercolour landscape band, compass mark, one clear step */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="nv-hero mb-12 px-6 py-12 sm:px-12 sm:py-16"
      >
        <div className="max-w-2xl flex flex-col gap-5">
          <BrandMark size="lg" className="flex-col sm:flex-row items-start sm:items-center" />
          <div className="flex flex-col gap-2">
            <span className="nv-eyebrow nv-eyebrow--primary">Back to life, back to work</span>
            <h1 className="font-heading text-3xl font-bold text-brand-text sm:text-5xl">
              Welcome back to your work, your life
            </h1>
          </div>
          <p className="text-base leading-relaxed text-brand-text sm:text-lg">
            A free toolkit for cancer survivors returning to work. Track your progress,
            manage fatigue, understand your rights, and talk to your employer with confidence —
            one small step at a time.
          </p>
          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
            <Button
              variant="onGradient"
              onClick={() => navigate(createPageUrl('Checklist'))}
            >
              <StepCompleteIcon className="h-5 w-5" />
              View my checklist
            </Button>
            {isAuthenticated && progress && (
              <Button
                variant="outline"
                onClick={() => setShowOnboarding(true)}
                disabled={showOnboarding}
              >
                Take the tour
              </Button>
            )}
          </div>
        </div>
      </motion.section>

      {/* Your journey — milestone card + compass-point spine + your real numbers */}
      <section className="mb-12">
        <span className="nv-eyebrow nv-eyebrow--primary">Your journey</span>
        <h2 className="mt-2 font-heading text-2xl font-bold text-brand-text sm:text-3xl">
          Where you are now
        </h2>
        <p className="mt-2 max-w-xl text-brand-muted-foreground">
          {JOURNEY_STAGES.length} stages, taken at your pace. You can step back or forward at any time.
        </p>

        {isProgressLoading && (
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <div key={i} className="nv-card p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-3 w-24 rounded-pill bg-brand-muted" />
                  <div className="h-8 w-16 rounded-brand bg-brand-muted" />
                  <div className="h-3 w-32 rounded-pill bg-brand-muted" />
                </div>
              </div>
            ))}
          </div>
        )}

        {isProgressError && !isProgressLoading && (
          <div className="nv-card mt-6 p-6 text-center">
            <p className="font-semibold text-brand-text">We couldn't load your progress just now.</p>
            <p className="mt-1 text-sm text-brand-muted-foreground">Please check your connection and try again.</p>
            <Button variant="outline" className="mt-4" onClick={() => refetchProgress()}>
              Try again
            </Button>
          </div>
        )}

        {progress && (
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="nv-milestone lg:col-span-1">
              <span className="nv-eyebrow">
                Stage {stageIndex + 1} of {JOURNEY_STAGES.length}
              </span>
              <h3>{currentStage.label}</h3>
              <p>{currentStage.blurb}</p>
              <div className="nv-bar">
                <i style={{ width: `${stagePercent}%` }} />
              </div>
              <div className="nv-ms-meta">
                <span className="text-brand-muted-foreground">{stagePercent}% of the way</span>
                <span className={stageIndex >= JOURNEY_STAGES.length - 1 ? 'nv-chip nv-chip--primary' : 'nv-chip'}>
                  {stageIndex >= JOURNEY_STAGES.length - 1 ? 'Completed' : 'On track'}
                </span>
              </div>
            </div>

            <ol className="nv-spine lg:col-span-2">
              {JOURNEY_STAGES.map((stage, i) => {
                const state = i < stageIndex ? 'done' : i === stageIndex ? 'active' : 'todo';
                return (
                  <li key={stage.value} className="nv-spine-step">
                    <span
                      className={`nv-spine-dot ${
                        state === 'done'
                          ? 'nv-spine-dot--done'
                          : state === 'active'
                          ? 'nv-spine-dot--active'
                          : ''
                      }`}
                    >
                      {state === 'done' ? (
                        <StepCompleteIcon className="h-4 w-4" />
                      ) : (
                        <CompassIcon className="h-4 w-4" />
                      )}
                    </span>
                    <p className="font-heading text-base font-bold text-brand-text">{stage.label}</p>
                    <p className="text-sm text-brand-muted-foreground">{stage.blurb}</p>
                  </li>
                );
              })}
            </ol>
          </div>
        )}

        {progress && (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="nv-milestone">
                <span className="nv-eyebrow">{stat.label}</span>
                <h3>{stat.value}</h3>
                <p>{stat.blurb}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Daily check-in prompt */}
      <DailyCheckIn />

      {/* Your plan */}
      {progress && (
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mb-12"
        >
          <CalendarView
            progress={progress}
            onUpdateProgress={(updates) => updateProgressMutation.mutate(updates)}
          />
        </motion.section>
      )}

      {/* Toolkit — guidance resource cards, grouped in single-column steps */}
      <section className="mb-12">
        <span className="nv-eyebrow nv-eyebrow--primary">Your toolkit</span>
        <h2 className="mt-2 font-heading text-2xl font-bold text-brand-text sm:text-3xl">
          Everything, organised by what you're working on
        </h2>

        <div className="mt-8 space-y-10">
          {sectionGroups.map((group) => (
            <div key={group.groupTitle}>
              <div className="mb-4 flex flex-wrap items-baseline justify-between gap-3 border-b border-brand-border pb-3">
                <div>
                  <h3 className="font-heading text-xl font-bold text-brand-text">{group.groupTitle}</h3>
                  <p className="mt-0.5 text-sm text-brand-muted-foreground">{group.groupDescription}</p>
                </div>
                <span className="nv-chip nv-chip--muted">
                  {group.items.length} {group.items.length === 1 ? 'tool' : 'tools'}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {group.items.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.page}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.04 * index }}
                      className="h-full"
                    >
                      <Link to={createPageUrl(item.page)} className="block h-full">
                        <article className="nv-resource h-full">
                          <div className="nv-media flex items-center justify-center">
                            <Icon className="h-9 w-9 text-brand-text" />
                          </div>
                          <div className="nv-body">
                            <span className="nv-eyebrow nv-eyebrow--primary">{group.groupTitle}</span>
                            <h3>{item.title}</h3>
                            <p>{item.description}</p>
                            <span className="nv-meta inline-flex items-center gap-1 text-brand-primary">
                              Open <ArrowRight className="h-4 w-4" />
                            </span>
                          </div>
                        </article>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Standing ovation */}
      <figure className="mb-12 overflow-hidden rounded-brand-lg border border-brand-border shadow-brand-sm">
        <img
          src="https://media.base44.com/images/public/69406c752de234aafebf891d/4835056a4_unnamed.png"
          alt="Every Survivor Deserves a Standing Ovation - Celebrating the strength, beauty, and resilience of cancer survivors"
          className="block h-auto w-full"
        />
      </figure>

      {/* Manager & HR resource hub */}
      <section className="mb-12">
        <ManagerResourceHub />
      </section>

      <ResourceFeedbackForm page="Home" />

      {/* A note for you */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="nv-hero mb-12 px-6 py-12 text-center sm:px-12"
      >
        <span className="nv-eyebrow nv-eyebrow--primary">A note for you</span>
        <h3 className="mt-3 font-heading text-2xl font-bold text-brand-text sm:text-3xl">
          You're not alone
        </h3>
        <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-brand-text">
          You're navigating something incredibly difficult. This toolkit is here to support you
          every step of the way. Take what you need, move at your own pace, and remember —
          your well-being comes first.
        </p>
      </motion.section>

      {/* Text message program */}
      <SmsConsentCard />
    </div>
  );
}