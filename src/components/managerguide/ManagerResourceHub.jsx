import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Stethoscope, Brain, HeartCrack, Wallet, Briefcase, ArrowRight, BookOpen, ListChecks, Scale } from 'lucide-react';
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
    <section aria-labelledby="manager-hub-heading" className="bg-white border-2 border-slate-300 rounded-3xl p-6 sm:p-8 shadow-lg">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-3 rounded-2xl bg-gradient-to-br from-violet-600 to-emerald-600 shadow-md">
          <Users className="h-6 w-6 text-white" />
        </div>
        <div>
          <p className="text-xs font-extrabold uppercase tracking-wider text-violet-700">For Managers &amp; HR</p>
          <h2 id="manager-hub-heading" className="text-2xl sm:text-3xl font-extrabold text-slate-900">Manager Resource Hub</h2>
        </div>
      </div>
      <p className="text-slate-700 font-medium mb-6 max-w-2xl">
        Before deciding what to do, understand what your employee is navigating. How you respond determines
        whether you throw them a life raft or watch them go under.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {CHALLENGES.map(({ icon: Icon, label, text }) => (
          <div key={label} className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-4">
            <Icon className="h-6 w-6 text-violet-700 mb-2" />
            <h3 className="font-extrabold text-slate-900 mb-1">{label}</h3>
            <p className="text-sm text-slate-700 leading-relaxed">{text}</p>
          </div>
        ))}
      </div>

      <LegalObligationsCard />

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-wrap">
        <Button asChild className="bg-gradient-to-r from-violet-600 to-emerald-600 text-white font-bold hover:opacity-90">
          <Link to="/ManagerGuide">Read the full guide <ArrowRight className="h-4 w-4" /></Link>
        </Button>
        {QUICK_LINKS.map(({ icon: Icon, label, to }) => (
          <Link key={to} to={to} className="inline-flex items-center gap-1.5 text-sm font-bold text-violet-700 hover:text-violet-900 underline">
            <Icon className="h-4 w-4" /> {label}
          </Link>
        ))}
      </div>
    </section>
  );
}