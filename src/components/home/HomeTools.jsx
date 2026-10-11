import React from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, Heart, Briefcase, Users, ArrowRight } from 'lucide-react';

const tools = [
  { title: 'Create Your Plan', path: '/ReturnPlanning', icon: ClipboardList },
  { title: 'Prioritize Wellbeing', path: '/WellbeingHub', icon: Heart },
  { title: 'Prepare for Return', path: '/MeetingPrep', icon: Briefcase },
  { title: 'Find Support', path: '/HelpSupport', icon: Users },
];

export default function HomeTools() {
  return (
    <section aria-labelledby="home-tools-title" className="space-y-6">
      <div className="space-y-3 text-center"><h2 id="home-tools-title" className="text-2xl font-bold sm:text-3xl">Tools for Every Step</h2><p className="mx-auto max-w-2xl text-brand-muted-foreground">From planning to your first day back, find the resources you need to move forward with clarity and confidence.</p></div>
      <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
        {tools.map(({ title, path, icon: Icon }) => <Link key={title} to={path} className="nv-card nv-home-tool flex min-w-0 flex-col gap-5 p-4 sm:p-6">
          <Icon className="h-8 w-8 text-brand-primary" strokeWidth={1.75} aria-hidden="true" />
          <h3 className="text-base font-bold sm:text-lg">{title}</h3>
          <span className="mt-auto flex h-11 w-11 items-center justify-center self-end rounded-pill bg-primary text-primary-foreground" aria-hidden="true"><ArrowRight className="h-5 w-5" strokeWidth={1.75} /></span>
        </Link>)}
      </div>
    </section>
  );
}