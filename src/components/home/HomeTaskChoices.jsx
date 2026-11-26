import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, FileText, BatteryCharging, ArrowRight } from 'lucide-react';

const TASKS = [
  {
    title: 'Prepare a workplace conversation',
    description: 'Find scripts and templates for talking with your employer.',
    path: '/CommunicationToolkit',
    icon: MessageSquare,
  },
  {
    title: 'Explore accommodation requests',
    description: 'Understand possible supports and prepare your questions.',
    path: '/Accommodations',
    icon: FileText,
  },
  {
    title: 'Manage energy at work',
    description: 'Explore pacing strategies and fatigue tools.',
    path: '/EnergyManagement',
    icon: BatteryCharging,
  },
];

export default function HomeTaskChoices() {
  return (
    <section aria-labelledby="home-tasks-title" className="space-y-5">
      <div className="space-y-2 text-center">
        <h2 id="home-tasks-title" className="text-2xl font-bold text-brand-text sm:text-3xl">
          What would help today?
        </h2>
        <p className="mx-auto max-w-2xl text-sm text-brand-muted-foreground sm:text-base">
          Start with one practical task—you do not need to tackle everything at once.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {TASKS.map(({ title, description, path, icon: Icon }) => (
          <Link
            key={title}
            to={path}
            className="nv-card nv-home-tool flex min-w-0 flex-col gap-4 p-5 sm:p-6"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-pill bg-brand-muted text-brand-primary">
              <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
            </span>
            <div className="space-y-1.5">
              <h3 className="font-heading text-lg font-bold text-brand-text">{title}</h3>
              <p className="text-sm leading-relaxed text-brand-muted-foreground">{description}</p>
            </div>
            <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-brand-primary">
              Open tool <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </span>
          </Link>
        ))}
      </div>

      <p className="text-center text-sm text-brand-muted-foreground">
        Not sure yet?{' '}
        <Link to="/Checklist" className="font-semibold text-brand-primary underline underline-offset-4 hover:text-brand-text">
          View the return-to-work checklist
        </Link>
        .
      </p>
    </section>
  );
}