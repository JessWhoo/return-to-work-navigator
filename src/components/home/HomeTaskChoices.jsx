import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const TASKS = [
  {
    title: 'Prepare a workplace conversation',
    description: 'Find scripts and templates for talking with your employer.',
    path: '/CommunicationToolkit',
  },
  {
    title: 'Explore accommodation requests',
    description: 'Understand possible supports and prepare your questions.',
    path: '/Accommodations',
  },
  {
    title: 'Manage energy at work',
    description: 'Explore pacing strategies and fatigue tools.',
    path: '/EnergyManagement',
  },
];

function TaskRow({ index, title, description, path }) {
  return (
    <Link
      to={path}
      className="group flex min-h-[72px] items-start gap-4 border-t border-brand-border px-1 py-6 transition-colors hover:bg-brand-muted sm:grid sm:grid-cols-[3rem_minmax(0,1.1fr)_minmax(0,1fr)_auto] sm:items-center sm:gap-6 sm:px-4"
    >
      <span className="hidden font-heading text-sm font-bold text-brand-muted-foreground sm:block">{index || ''}</span>
      <span className="min-w-0 flex-1 space-y-1">
        <span className="block font-heading text-xl font-bold text-brand-text sm:text-2xl">{title}</span>
        <span className="block text-sm leading-relaxed text-brand-muted-foreground sm:hidden">{description}</span>
      </span>
      <span className="hidden text-sm leading-relaxed text-brand-muted-foreground sm:block">{description}</span>
      <ArrowRight className="mt-1.5 h-5 w-5 shrink-0 text-brand-primary transition-transform group-hover:translate-x-1 sm:mt-0" aria-hidden="true" />
    </Link>
  );
}

export default function HomeTaskChoices() {
  return (
    <section aria-labelledby="home-tasks-title" className="space-y-6">
      <div className="space-y-2">
        <p className="nv-eyebrow nv-eyebrow--primary">Start here</p>
        <h2 id="home-tasks-title" className="text-2xl font-bold text-brand-text sm:text-3xl">
          What would help today?
        </h2>
        <p className="max-w-2xl text-sm text-brand-muted-foreground sm:text-base">
          Start with one practical task—you do not need to tackle everything at once.
        </p>
      </div>

      <div>
        {TASKS.map((task, i) => (
          <TaskRow key={task.title} index={String(i + 1).padStart(2, '0')} {...task} />
        ))}
        <TaskRow
          title="Not sure yet? View the return-to-work checklist"
          description="A short list of steps you can pick from, in any order."
          path="/Checklist"
        />
      </div>
    </section>
  );
}