import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import {
  CheckCircle2, Circle, Clock, MapPin,
  CalendarDays, HeartHandshake, Briefcase, Flag, ChevronRight
} from 'lucide-react';
import { useUserProgress } from '@/hooks/useUserProgress';
import PageHeader from '@/components/brand/PageHeader';
import useSEO from '@/hooks/useSEO';

const PHASES = [
  {
    key: 'planning',
    label: 'Planning',
    icon: MapPin,
    description: 'Preparing for your return — gathering paperwork, clarifying needs, and setting up support.',
    milestones: [
      { id: 'plan-medical', label: 'Get medical clearance & notes', link: '/RecordKeeping' },
      { id: 'plan-rights', label: 'Review your legal rights', link: '/LegalRights' },
      { id: 'plan-accommodations', label: 'Identify needed accommodations', link: '/Accommodations' },
      { id: 'plan-checklist', label: 'Start return-to-work checklist', link: '/Checklist' },
    ],
  },
  {
    key: 'first_week',
    label: 'First Week',
    icon: HeartHandshake,
    description: 'Easing back in — adjusting expectations, communicating, and pacing your energy.',
    milestones: [
      { id: 'first-meeting', label: 'Prep your first manager meeting', link: '/MeetingPrep' },
      { id: 'first-disclosure', label: 'Plan disclosure conversations', link: '/CommunicationToolkit' },
      { id: 'first-energy', label: 'Track daily energy & mood', link: '/EnergyManagement' },
      { id: 'first-boundaries', label: 'Set clear boundaries', link: '/Communication' },
    ],
  },
  {
    key: 'ongoing',
    label: 'Ongoing',
    icon: Briefcase,
    description: 'Settling in — sustaining wellbeing, building community, and growing your career.',
    milestones: [
      { id: 'ongoing-checkins', label: 'Regular supervisor check-ins', link: '/MeetingPrep' },
      { id: 'ongoing-network', label: 'Connect with peers & mentors', link: '/CommunityHub' },
      { id: 'ongoing-wellbeing', label: 'Maintain wellbeing routines', link: '/WellbeingHub' },
      { id: 'ongoing-career', label: 'Explore career growth', link: '/CareerHub' },
    ],
  },
  {
    key: 'completed',
    label: 'Thriving',
    icon: Flag,
    description: 'You did it — reflecting, mentoring others, and continuing to thrive at work.',
    milestones: [
      { id: 'done-reflect', label: 'Reflect on your journey', link: '/MyJourney' },
      { id: 'done-mentor', label: 'Share your story / mentor others', link: '/CommunityHub' },
      { id: 'done-report', label: 'Export your progress report', link: '/ExportReports' },
    ],
  },
];

function getPhaseIndex(stage) {
  const i = PHASES.findIndex(p => p.key === stage);
  return i === -1 ? 0 : i;
}

export default function Roadmap() {
  const [activePhase, setActivePhase] = useState(null);

  const { data: progress, isLoading } = useUserProgress();

  const currentIndex = getPhaseIndex(progress?.journey_stage);
  const completedIds = useMemo(
    () => new Set(progress?.completed_checklist_items || []),
    [progress]
  );

  const phaseStats = useMemo(() => {
    return PHASES.map((phase, idx) => {
      const total = phase.milestones.length;
      const done = phase.milestones.filter(m => completedIds.has(m.id)).length;
      let status = 'upcoming';
      if (idx < currentIndex) status = 'completed';
      else if (idx === currentIndex) status = 'current';
      return { ...phase, total, done, percent: total ? Math.round((done / total) * 100) : 0, status };
    });
  }, [currentIndex, completedIds]);

  const overallPercent = useMemo(() => {
    const total = PHASES.reduce((s, p) => s + p.milestones.length, 0);
    const done = phaseStats.reduce((s, p) => s + p.done, 0);
    return total ? Math.round((done / total) * 100) : 0;
  }, [phaseStats]);

  useSEO({
    title: 'Step-by-Step Return-to-Work Roadmap After Cancer',
    description:
      'Follow a guided four-stage roadmap from medical clearance and accommodation planning through your first week back and long-term career sustainability.',
    path: '/Roadmap',
  });

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto space-y-8">
        <PageHeader center eyebrow="Your Return-to-Work Roadmap" title="Your Step-by-Step Return-to-Work Roadmap" subtitle="Track where you've been, where you are, and what's ahead. Tap any phase to explore its milestones." />
        <div className="py-12 text-center">
          <div className="w-8 h-8 border-4 border-brand-border border-t-brand-primary rounded-full animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <PageHeader center eyebrow="Your Return-to-Work Roadmap" title="Your Step-by-Step Return-to-Work Roadmap" subtitle="Track where you've been, where you are, and what's ahead. Tap any phase to explore its milestones." />
      <Card>
        <CardContent className="pt-6 space-y-3"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="nv-eyebrow">Overall Progress</p><p className="text-2xl font-bold text-brand-text">{overallPercent}% complete</p></div><Badge>Current: {PHASES[currentIndex].label}</Badge></div><Progress value={overallPercent} className="h-2" /></CardContent>
      </Card>
      <div className="relative">
        <div className="absolute left-6 sm:left-1/2 sm:-translate-x-1/2 top-0 bottom-0 border-l-2 border-dotted border-brand-border" />
        <div className="space-y-8">
          {phaseStats.map((phase, idx) => {
            const Icon = phase.icon;
            const isCurrent = phase.status === 'current';
            const isDone = phase.status === 'completed';
            const isLeft = idx % 2 === 0;
            return (
              <motion.div key={phase.key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="relative">
                <div className={`flex items-start gap-4 sm:gap-0 sm:grid sm:grid-cols-2 ${isLeft ? '' : 'sm:[&>*:first-child]:order-2'}`}>
                  <div className="absolute left-6 sm:left-1/2 sm:-translate-x-1/2 top-6 z-10">
                    <motion.div animate={isCurrent ? { scale: [1, 1.15, 1] } : {}} transition={{ repeat: Infinity, duration: 2 }} className={`relative h-6 w-6 rounded-full border-4 border-brand-surface shadow-brand-sm flex items-center justify-center ${isDone ? 'bg-brand-secondary' : isCurrent ? 'bg-brand-primary' : 'bg-brand-sky'}`}>
                      {isDone && <CheckCircle2 className="h-3.5 w-3.5 text-brand-text" />}{isCurrent && <div className="h-2 w-2 rounded-full bg-brand-surface" />}
                    </motion.div>
                    {isCurrent && <div className="absolute inset-0 -m-1 rounded-full bg-brand-primary opacity-30 blur-md animate-pulse" />}
                  </div>
                  <div className={`pl-16 sm:pl-0 ${isLeft ? 'sm:pr-12' : 'sm:pl-12'} w-full min-w-0`}>
                    <button onClick={() => setActivePhase(activePhase === phase.key ? null : phase.key)} aria-expanded={activePhase === phase.key} className="w-full text-left">
                      <Card className={isCurrent ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}>
                        <CardContent className="pt-5 space-y-3">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0"><div className="p-2.5 rounded-brand bg-brand-muted shrink-0"><Icon className="h-5 w-5 text-brand-primary" /></div><div className="min-w-0"><div className="flex items-center gap-2 flex-wrap"><h3 className="text-lg font-bold text-brand-text">{phase.label}</h3>{isCurrent && <Badge className="text-xs"><Clock className="h-2.5 w-2.5 mr-1" />You are here</Badge>}{isDone && <Badge variant="secondary" className="text-xs">Done</Badge>}</div><p className="text-xs text-brand-muted-foreground">{phase.done}/{phase.total} milestones</p></div></div>
                            <ChevronRight className={`h-5 w-5 text-brand-primary shrink-0 transition-transform ${activePhase === phase.key ? 'rotate-90' : ''}`} />
                          </div>
                          <p className="text-sm text-brand-muted-foreground">{phase.description}</p><Progress value={phase.percent} className="h-1.5" />
                          {activePhase === phase.key && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-2 pt-2 border-t border-brand-border">
                            {phase.milestones.map(m => {
                              const done = completedIds.has(m.id);
                              return <Link key={m.id} to={m.link} onClick={e => e.stopPropagation()} className="nv-navitem !rounded-brand !p-2 !text-sm"><span>{done ? <CheckCircle2 className="h-4 w-4 text-brand-primary" /> : <Circle className="h-4 w-4 text-brand-muted-foreground" />}</span><span className={`flex-1 ${done ? 'text-brand-muted-foreground line-through' : 'text-brand-text'}`}>{m.label}</span><ChevronRight className="h-3.5 w-3.5 text-brand-primary shrink-0" /></Link>;
                            })}
                          </motion.div>}
                        </CardContent>
                      </Card>
                    </button>
                  </div>
                  <div className={`hidden sm:flex items-center ${isLeft ? 'pl-12' : 'pr-12 justify-end'}`}><div className="text-xs text-brand-muted-foreground flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" />Phase {idx + 1} of {PHASES.length}</div></div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
      <Card className="nv-card--muted"><CardContent className="pt-6 text-center space-y-3"><h3 className="text-lg font-bold text-brand-text">Keep going — you've got this 💛</h3><p className="text-sm text-brand-muted-foreground max-w-md mx-auto">Continue tracking milestones on your checklist or talk to your coach for personalized guidance.</p><div className="flex flex-wrap justify-center gap-3 pt-1"><Link to="/Checklist"><Button>Open Checklist</Button></Link><Link to="/Coach"><Button variant="outline">Talk to Coach</Button></Link></div></CardContent></Card>
    </div>
  );
}