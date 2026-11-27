import React, { useState } from 'react';
import CalendarView from '@/components/dashboard/CalendarView';
import DailyCheckIn from '@/components/DailyCheckIn';
import ResourceFeedbackForm from '@/components/feedback/ResourceFeedbackForm';
import SmsConsentCard from '@/components/sms/SmsConsentCard';
import ManagerResourceHub from '@/components/managerguide/ManagerResourceHub';
import HomeDisclosurePanel from '@/components/home/HomeDisclosurePanel';
import HomeJourney from '@/components/home/HomeJourney';
import HomeSamplePreview from '@/components/home/HomeSamplePreview';
import HomeToolkit from '@/components/home/HomeToolkit';
import HomeFeatures from '@/components/home/HomeFeatures';
import HomeFounderIntro from '@/components/home/HomeFounderIntro';

const STAGE_LABELS = {
  planning: 'Planning',
  first_week: 'First week',
  ongoing: 'Ongoing',
  completed: 'Completed',
};

/**
 * Secondary homepage information tucked behind calm, on-demand panels.
 * Only one section opens at a time so the page stays uncluttered.
 */
export default function HomeMoreSections({
  progress,
  isProgressLoading,
  isProgressError,
  refetchProgress,
  onUpdateProgress,
}) {
  const [openId, setOpenId] = useState(null);
  const toggle = (id) => setOpenId((prev) => (prev === id ? null : id));

  const completedCount = progress?.completed_checklist_items?.length || 0;
  const stageLabel = progress ? STAGE_LABELS[progress.journey_stage] || 'Planning' : null;
  const journeyBadge = stageLabel
    ? `${stageLabel}${completedCount ? ` · ${completedCount} done` : ''}`
    : null;

  return (
    <section aria-labelledby="home-more-title" className="space-y-6">
      <div className="space-y-2">
        <p className="nv-eyebrow nv-eyebrow--primary">When you're ready</p>
        <h2 id="home-more-title" className="text-2xl font-bold text-brand-text sm:text-3xl">
          More tools &amp; details
        </h2>
        <p className="max-w-2xl text-sm text-brand-muted-foreground sm:text-base">
          Everything below stays tucked away until you open it, so you can focus on one thing at a time.
        </p>
      </div>

      <div>
        <HomeDisclosurePanel
          id="journey"
          title="Your 5-step return path"
          description="Explore, Plan, Build, Return, and Thrive—plus your saved progress."
          badge={journeyBadge}
          open={openId === 'journey'}
          onToggle={() => toggle('journey')}
        >
          <HomeJourney
            progress={isProgressError ? null : progress}
            loading={isProgressLoading}
            error={isProgressError}
            onRetry={refetchProgress}
          />
        </HomeDisclosurePanel>

        <HomeDisclosurePanel
          id="today"
          title="Today's energy check-in & calendar"
          description="Log how your energy feels today or view upcoming return-to-work dates."
          open={openId === 'today'}
          onToggle={() => toggle('today')}
        >
          <div className="space-y-5 rounded-brand-lg bg-brand-muted p-5 sm:p-6">
            <DailyCheckIn />
            {progress && <CalendarView progress={progress} onUpdateProgress={onUpdateProgress} />}
          </div>
        </HomeDisclosurePanel>

        <HomeDisclosurePanel
          id="example"
          title="See an example accommodation draft"
          description="Preview work-focused phrasing without sharing private medical details."
          open={openId === 'example'}
          onToggle={() => toggle('example')}
        >
          <HomeSamplePreview />
        </HomeDisclosurePanel>

        <HomeDisclosurePanel
          id="toolkit"
          title="Browse all tools by topic"
          description="Planning, communication, accommodations, legal rights, and coaching."
          open={openId === 'toolkit'}
          onToggle={() => toggle('toolkit')}
        >
          <HomeToolkit />
        </HomeDisclosurePanel>

        <HomeDisclosurePanel
          id="community"
          title="Community, founder story & employer guide"
          description="Connect with peers, meet Jess, or view guidance for Managers & HR."
          open={openId === 'community'}
          onToggle={() => toggle('community')}
        >
          <div className="space-y-10">
            <HomeFeatures />
            <HomeFounderIntro />
            <ManagerResourceHub />
          </div>
        </HomeDisclosurePanel>

        <HomeDisclosurePanel
          id="connect"
          title="Share feedback & optional text check-ins"
          description="Tell us what would help next or opt in to gentle SMS updates."
          open={openId === 'connect'}
          onToggle={() => toggle('connect')}
        >
          <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
            <ResourceFeedbackForm page="Home" />
            <SmsConsentCard />
          </div>
        </HomeDisclosurePanel>
      </div>
    </section>
  );
}