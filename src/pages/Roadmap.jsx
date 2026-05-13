import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import {
  CheckCircle2, Circle, Clock, MapPin, Sparkles,
  CalendarDays, HeartHandshake, Briefcase, Flag, ChevronRight
} from 'lucide-react';

const PHASES = [
  {
    key: 'planning',
    label: 'Planning',
    icon: MapPin,
    gradient: 'from-rose-400 to-amber-400',
    soft: 'from-rose-50 via-rose-50 to-amber-50',
    border: 'border-rose-200',
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
    gradient: 'from-sky-400 to-violet-400',
    soft: 'from-sky-50 via-sky-50 to-violet-50',
    border: 'border-sky-200',
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
    gradient: 'from-emerald-400 to-teal-400',
    soft: 'from-emerald-50 via-emerald-50 to-teal-50',
    border: 'border-emerald-200',
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
    gradient: 'from-violet-400 to-rose-400',
    soft: 'from-violet-50 via-violet-50 to-rose-50',
    border: 'border-violet-200',
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

  const { data: progress, isLoading } = useQuery({
    queryKey: ['userProgress'],
    queryFn: async () => {
      const list = await base44.entities.UserProgress.list();
      return list[0] || null;
    },
  });

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

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto py-12 text-center">
        <div className="w-8 h-8 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 border border-white/80 text-sky-700 text-xs font-medium">
          <Sparkles className="h-3.5 w-3.5 text-rose-400" />
          Your Return-to-Work Roadmap
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-rose-400 via-violet-400 to-sky-500 bg-clip-text text-transparent">
          Your journey, one step at a time
        </h1>
        <p className="text-sky-800/70 max-w-2xl mx-auto">
          Track where you've been, where you are, and what's ahead. Tap any phase to explore its milestones.
        </p>
      </div>

      {/* Overall Progress */}
      <Card className="bg-white/70 backdrop-blur-sm border border-white/80 shadow-sm">
        <CardContent className="pt-6 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-sky-700/70 font-semibold">Overall Progress</p>
              <p className="text-2xl font-bold text-sky-900">{overallPercent}% complete</p>
            </div>
            <Badge className="bg-gradient-to-r from-rose-300 to-sky-300 text-white shadow-sm">
              Current: {PHASES[currentIndex].label}
            </Badge>
          </div>
          <Progress value={overallPercent} className="h-2" />
        </CardContent>
      </Card>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-6 sm:left-1/2 sm:-translate-x-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-rose-200 via-sky-200 to-emerald-200 rounded-full" />

        <div className="space-y-8">
          {phaseStats.map((phase, idx) => {
            const Icon = phase.icon;
            const isCurrent = phase.status === 'current';
            const isDone = phase.status === 'completed';
            const isLeft = idx % 2 === 0;

            return (
              <motion.div
                key={phase.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="relative"
              >
                <div className={`flex items-start gap-4 sm:gap-0 sm:grid sm:grid-cols-2 ${isLeft ? '' : 'sm:[&>*:first-child]:order-2'}`}>
                  {/* Node marker */}
                  <div className="absolute left-6 sm:left-1/2 sm:-translate-x-1/2 top-6 z-10">
                    <motion.div
                      animate={isCurrent ? { scale: [1, 1.15, 1] } : {}}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className={`relative h-6 w-6 rounded-full border-4 border-white shadow-md bg-gradient-to-br ${phase.gradient} flex items-center justify-center`}
                    >
                      {isDone && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}
                      {isCurrent && <div className="h-2 w-2 rounded-full bg-white" />}
                    </motion.div>
                    {isCurrent && (
                      <div className={`absolute inset-0 -m-1 rounded-full bg-gradient-to-br ${phase.gradient} opacity-30 blur-md animate-pulse`} />
                    )}
                  </div>

                  {/* Card */}
                  <div className={`pl-16 sm:pl-0 ${isLeft ? 'sm:pr-12' : 'sm:pl-12'} w-full`}>
                    <button
                      onClick={() => setActivePhase(activePhase === phase.key ? null : phase.key)}
                      className="w-full text-left"
                    >
                      <Card className={`bg-gradient-to-br ${phase.soft} border-2 ${phase.border} hover:shadow-lg transition-all ${isCurrent ? 'ring-2 ring-offset-2 ring-rose-300/50' : ''}`}>
                        <CardContent className="pt-5 space-y-3">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div className={`p-2.5 rounded-xl bg-gradient-to-br ${phase.gradient} shadow-sm`}>
                                <Icon className="h-5 w-5 text-white" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="text-lg font-bold text-sky-900">{phase.label}</h3>
                                  {isCurrent && (
                                    <Badge className="bg-rose-500 text-white text-[10px] px-2 py-0.5">
                                      <Clock className="h-2.5 w-2.5 mr-1" /> You are here
                                    </Badge>
                                  )}
                                  {isDone && (
                                    <Badge className="bg-emerald-500 text-white text-[10px] px-2 py-0.5">
                                      Done
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-xs text-sky-700/80">{phase.done}/{phase.total} milestones</p>
                              </div>
                            </div>
                            <ChevronRight className={`h-5 w-5 text-sky-700/60 transition-transform ${activePhase === phase.key ? 'rotate-90' : ''}`} />
                          </div>

                          <p className="text-sm text-sky-800/80">{phase.description}</p>

                          <Progress value={phase.percent} className="h-1.5" />

                          {/* Expanded milestones */}
                          {activePhase === phase.key && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="space-y-2 pt-2 border-t border-white/60"
                            >
                              {phase.milestones.map(m => {
                                const done = completedIds.has(m.id);
                                return (
                                  <Link
                                    key={m.id}
                                    to={m.link}
                                    onClick={(e) => e.stopPropagation()}
                                    className="flex items-center gap-2 p-2 rounded-lg bg-white/60 hover:bg-white transition-colors group"
                                  >
                                    {done ? (
                                      <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                                    ) : (
                                      <Circle className="h-4 w-4 text-sky-400 flex-shrink-0" />
                                    )}
                                    <span className={`text-sm flex-1 ${done ? 'text-sky-700/60 line-through' : 'text-sky-900'}`}>
                                      {m.label}
                                    </span>
                                    <ChevronRight className="h-3.5 w-3.5 text-sky-400 group-hover:translate-x-0.5 transition-transform" />
                                  </Link>
                                );
                              })}
                            </motion.div>
                          )}
                        </CardContent>
                      </Card>
                    </button>
                  </div>

                  {/* Opposite-side date hint (desktop only) */}
                  <div className={`hidden sm:flex items-center ${isLeft ? 'pl-12' : 'pr-12 justify-end'}`}>
                    <div className="text-xs text-sky-700/60 flex items-center gap-1.5">
                      <CalendarDays className="h-3.5 w-3.5" />
                      Phase {idx + 1} of {PHASES.length}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Quick links */}
      <Card className="bg-gradient-to-br from-rose-50 via-amber-50 to-sky-50 border border-white/80">
        <CardContent className="pt-6 text-center space-y-3">
          <h3 className="text-lg font-bold text-sky-900">Keep going — you've got this 💛</h3>
          <p className="text-sm text-sky-800/70 max-w-md mx-auto">
            Continue tracking milestones on your checklist or talk to your coach for personalized guidance.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-1">
            <Link to="/Checklist">
              <Button className="bg-gradient-to-r from-rose-400 to-violet-400 text-white border-0 hover:from-rose-500 hover:to-violet-500">
                Open Checklist
              </Button>
            </Link>
            <Link to="/Coach">
              <Button variant="outline" className="border-sky-300 text-sky-700 hover:bg-white">
                Talk to Coach
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}