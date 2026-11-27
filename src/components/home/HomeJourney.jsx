import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Compass, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getJourneyMilestones } from '@/components/home/homeJourneyData';
import HomeProgressStats from '@/components/home/HomeProgressStats';

const DOT_TONE = {
  done: 'border-brand-secondary bg-brand-secondary text-brand-text',
  current: 'border-brand-primary bg-brand-primary text-brand-background',
  idle: 'border-brand-border bg-brand-surface text-brand-muted-foreground',
};

export default function HomeJourney({ progress, loading, error, onRetry }) {
  const milestones = getJourneyMilestones(progress);
  return (
    <section aria-labelledby="home-journey-title" aria-busy={loading} className="grid gap-8 lg:grid-cols-12 lg:gap-12">
      <div className="space-y-4 lg:sticky lg:top-24 lg:col-span-4 lg:self-start">
        <p className="nv-eyebrow nv-eyebrow--primary">Your path</p>
        <h2 id="home-journey-title" className="text-2xl font-bold sm:text-3xl">Topics to Explore at Your Pace</h2>
        <p className="text-brand-muted-foreground">There is no single right timeline. Use what helps, pause when you need to, and discuss readiness with your healthcare team.</p>
        <Link to="/NavigatorMethod" className="inline-flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-semibold text-brand-primary underline underline-offset-4 hover:text-brand-text">
          <Compass className="h-4 w-4" aria-hidden="true" />
          <span className="font-heading font-bold">The Navigator Method</span>
          <span className="text-brand-text">Explore · Plan · Build · Return · Thrive</span>
        </Link>
        <figure className="overflow-hidden rounded-brand border border-brand-border bg-brand-surface">
          <img src="/images/journey-signposts.png" alt="Wooden signposts against a mountain landscape reading Explore, Plan, Build, Return, and Thrive." width="818" height="1024" loading="lazy" decoding="async" className="block h-auto w-full" />
        </figure>
        <p className="text-xs text-brand-muted-foreground">{progress ? 'Completion reflects your saved checklist. Your current milestone follows your saved journey stage.' : 'Explore at your own pace. Your saved progress will appear when you are signed in.'}</p>
      </div>

      <div className="space-y-6 lg:col-span-8">
        <HomeProgressStats progress={progress} />
        {loading && <p role="status" className="text-sm text-brand-muted-foreground">Loading your saved progress…</p>}
        {error && !loading && (
          <div className="space-y-3">
            <p role="alert" className="text-sm text-brand-text">We couldn't load your progress just now.</p>
            <Button variant="outline" size="sm" onClick={onRetry}>Try again</Button>
          </div>
        )}
        <ol>
          {milestones.map((step, i) => (
            <li key={step.label}>
              <Link
                to={step.path}
                aria-current={step.state === 'current' ? 'step' : undefined}
                className="group flex items-start gap-4 border-t border-brand-border py-5 transition-colors hover:bg-brand-muted sm:px-3"
              >
                <span className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-pill border ${DOT_TONE[step.state] || DOT_TONE.idle}`} aria-hidden="true">
                  {step.state === 'done' ? <Check className="h-4 w-4" /> : <span className="text-xs font-bold">{i + 1}</span>}
                </span>
                <span className="min-w-0 flex-1 space-y-1">
                  <span className="block font-heading text-lg font-bold text-brand-text sm:text-xl">{step.label}</span>
                  <span className="block text-sm text-brand-muted-foreground">{step.description}</span>
                  {progress && (
                    <span className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="text-xs text-brand-muted-foreground">{step.count} of {step.ids.length} checklist steps</span>
                      <span className={`nv-chip ${step.state === 'done' ? '' : step.state === 'current' ? 'nv-chip--primary' : 'nv-chip--muted'}`}>{step.state === 'done' ? 'Completed' : step.state === 'current' ? 'Current' : 'Checklist remaining'}</span>
                    </span>
                  )}
                </span>
                <ArrowRight className="mt-2 h-4 w-4 shrink-0 text-brand-primary" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}