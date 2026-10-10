import React from 'react';
import { Link } from 'react-router-dom';
import { Stethoscope, Brain, HeartCrack, Wallet, Briefcase, ArrowRight, BookOpen, ListChecks, Scale, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LegalObligationsCard from './LegalObligationsCard';

const CHALLENGES = [
  { icon: Stethoscope, label: 'Medically', text: 'Hours-long appointments, debilitating side effects, surgery, and scans that trigger real fear.' },
  { icon: Brain, label: 'Cognitively', text: '“Chemo brain” is real — focus, memory, and decision-making can all be affected.' },
  { icon: HeartCrack, label: 'Emotionally', text: 'Terrified, grieving, exhausted — and performing “fine” at work out of fear of seeming unreliable.' },
  { icon: Wallet, label: 'Financially', text: 'Medical bills pile up while unpaid leave looms. The job and its insurance are a lifeline.' },
  { icon: Briefcase, label: 'Professionally', text: 'Worried about being seen as less capable, losing opportunities, or being let go.' },
];

const QUICK_LINKS = [
  { icon: ListChecks, label: 'What actually helps', to: '/ManagerGuide#what-helps' },
  { icon: Scale, label: 'FMLA & ADA basics', to: '/ManagerGuide#legal' },
  { icon: BookOpen, label: 'When they come back', to: '/ManagerGuide#return' },
];

export default function ManagerResourceHub() {
  return (
    <section
      aria-labelledby="manager-hub-heading"
      className="rounded-brand-lg border border-brand-border bg-brand-surface p-6 shadow-brand-sm sm:p-8"
    >
      <div className="mb-2 flex items-center gap-3">
        <div className="rounded-pill bg-brand-muted p-3 text-brand-primary">
          <Users className="h-6 w-6" />
        </div>
        <div>
          <p className="nv-eyebrow nv-eyebrow--primary">For Managers &amp; HR</p>
          <h2 id="manager-hub-heading" className="font-heading text-2xl font-bold text-brand-text sm:text-3xl">
            Manager Resource Hub
          </h2>
        </div>
      </div>
      <p className="mb-6 max-w-2xl text-brand-muted-foreground">
        Before deciding what to do, understand what your employee is navigating. How you respond determines
        whether you throw them a life raft or watch them go under.
      </p>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {CHALLENGES.map(({ icon: Icon, label, text }) => (
          <div key={label} className="rounded-brand border border-brand-border bg-brand-muted p-4">
            <Icon className="mb-2 h-6 w-6 text-brand-primary" />
            <h3 className="mb-1 font-heading font-bold text-brand-text">{label}</h3>
            <p className="text-sm leading-relaxed text-brand-muted-foreground">{text}</p>
          </div>
        ))}
      </div>

      <LegalObligationsCard />

      <div className="flex flex-col flex-wrap gap-3 sm:flex-row sm:items-center">
        <Button asChild>
          <Link to="/ManagerGuide">Read the full guide <ArrowRight className="h-4 w-4" /></Link>
        </Button>
        {QUICK_LINKS.map(({ icon: Icon, label, to }) => (
          <Link
            key={to}
            to={to}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-primary underline transition-colors hover:text-brand-text"
          >
            <Icon className="h-4 w-4" /> {label}
          </Link>
        ))}
      </div>
    </section>
  );
}