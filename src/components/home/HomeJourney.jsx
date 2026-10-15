import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Compass, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BRAND_LOGO } from '@/components/brand/BrandIcon';
import { getJourneyMilestones } from '@/components/home/homeJourneyData';

export default function HomeJourney({ progress, loading, error, onRetry }) {
  const milestones = getJourneyMilestones(progress);
  return (
    <section className="nv-home-journey space-y-6" aria-labelledby="home-journey-title" aria-busy={loading}>
      <div className="space-y-3 text-center"><h2 id="home-journey-title" className="text-2xl font-bold sm:text-3xl">Your Return Journey</h2><p className="text-brand-muted-foreground">A step-by-step path to guide you through the process.</p></div>
      <div className="flex justify-center">
        <Link to="/NavigatorMethod" className="inline-flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 rounded-brand border border-brand-primary bg-brand-surface px-4 py-2.5 text-center text-sm shadow-brand-sm transition hover:bg-brand-muted hover:shadow-brand-md">
          <Compass className="h-4 w-4 text-brand-primary" aria-hidden="true" />
          <span className="font-heading font-bold text-brand-primary">The Navigator Method</span>
          <span className="font-semibold text-brand-text">Explore · Plan · Build · Return · Thrive</span>
          <ArrowRight className="h-4 w-4 text-brand-primary" aria-hidden="true" />
        </Link>
      </div>
      <figure className="nv-card mx-auto w-full max-w-full overflow-hidden sm:max-w-lg">
        <img src="https://media.base44.com/images/public/69406c752de234aafebf891d/346c32826_render.png" alt="Wooden signposts against a mountain landscape reading Explore, Plan, Build, Return, and Thrive." width="818" height="1024" loading="lazy" decoding="async" className="block h-auto w-full" />
      </figure>
      {loading && <p role="status" className="text-center text-sm text-brand-muted-foreground">Loading your saved progress…</p>}
      {error && !loading && <div className="nv-card p-5 text-center"><p role="alert">We couldn't load your progress just now.</p><Button variant="outline" className="mt-3" onClick={onRetry}>Try again</Button></div>}
      <ol className="nv-home-timeline">
        {milestones.map(step => <li key={step.label} className="nv-home-timeline-step">
          <Link to={step.path} aria-current={step.state === 'current' ? 'step' : undefined} className="nv-home-milestone-link">
            <span className={`nv-spine-dot nv-home-journey-marker ${step.state === 'done' ? 'nv-spine-dot--done' : step.state === 'current' ? 'nv-spine-dot--active' : ''}`} aria-hidden="true">
              <img src={BRAND_LOGO} alt="" width="32" height="32" loading="lazy" decoding="async" className="h-8 w-8 rounded-pill object-contain" />
              {step.state === 'done' && <Check className="nv-home-completed-check h-4 w-4" />}
            </span>
            <span className="space-y-2"><span className="block font-heading text-base font-bold">{step.label}</span><span className="block text-sm text-brand-muted-foreground">{step.description}</span>
              {progress && <><span className="block text-xs text-brand-muted-foreground">{step.count} of {step.ids.length} checklist steps</span><span className={`nv-chip ${step.state === 'done' ? '' : step.state === 'current' ? 'nv-chip--primary' : 'nv-chip--muted'}`}>{step.state === 'done' ? 'Completed' : step.state === 'current' ? 'Current' : 'Checklist remaining'}</span></>}
            </span>
          </Link>
        </li>)}
      </ol>
      <p className="text-center text-xs text-brand-muted-foreground">{progress ? 'Completion reflects your saved checklist. Your current milestone follows your saved journey stage.' : 'Explore at your own pace. Your saved progress will appear when you are signed in.'}</p>
    </section>
  );
}