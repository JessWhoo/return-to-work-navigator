import React from 'react';
import { Link } from 'react-router-dom';
import {
  Compass, ClipboardList, FileText, Briefcase, Sprout, ArrowRight,
  Scale, Eye, Accessibility, BookOpen, Sparkles,
  ListChecks, CalendarDays, Users, CalendarPlus,
  Mail, MessagesSquare, Files, Map, Activity, HeartPulse, FolderOpen,
  Search, HeartHandshake,
} from 'lucide-react';
import PageHeader from '@/components/brand/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import useSEO from '@/hooks/useSEO';
import { useAuth } from '@/lib/AuthContext';

const STEPS = [
  {
    n: 1,
    key: 'explore',
    name: 'Explore',
    icon: Compass,
    blurb:
      'Before you set a single date, get clear on your rights, how your diagnosis affects your work, and the accommodations available to you. Explore turns uncertainty into a plan.',
    tools: [
      { label: 'Legal Rights', to: '/LegalRights', hint: 'ADA, FMLA & state protections', icon: Scale },
      { label: 'Disclosure Guide', to: '/DisclosureGuide', hint: 'Decide what to share, and with whom', icon: Eye },
      { label: 'Accommodations', to: '/Accommodations', hint: 'Browse common workplace accommodations', icon: Accessibility },
      { label: 'Resource Library', to: '/ResourceLibrary', hint: 'Curated guides & articles', icon: BookOpen },
      { label: 'Ask the AI Coach', to: '/Coach', hint: 'Answers to any question, 24/7', icon: Sparkles },
    ],
  },
  {
    n: 2,
    key: 'plan',
    name: 'Plan',
    icon: ClipboardList,
    blurb:
      'Turn what you learned into a concrete return plan. Set your dates and pace, prepare for the conversations that matter, and book coaching when you want a thinking partner.',
    tools: [
      { label: 'Return-to-Work Checklist', to: '/Checklist', hint: 'Step-by-step prep, phase by phase', icon: ListChecks },
      { label: 'Return Planning', to: '/ReturnPlanning', hint: 'Set your return date & phased schedule', icon: CalendarDays },
      { label: 'Meeting Prep', to: '/MeetingPrep', hint: 'Prep your manager & HR meetings', icon: Users },
      { label: 'Book a Coach', to: '/CoachBooking', hint: 'A planning session with a real coach', icon: CalendarPlus },
    ],
  },
  {
    n: 3,
    key: 'build',
    name: 'Build',
    icon: FileText,
    blurb:
      'Put your requests in writing. Generate your ADA accommodation letter, draft the emails you will send, and match each need to a concrete accommodation, all in plain professional language.',
    tools: [
      { label: 'Accommodation Letter Generator', to: '/AccommodationLetterGenerator', hint: 'A customized ADA request letter in 3 steps', icon: FileText },
      { label: 'Employer Email Generator', to: '/EmployerEmailGenerator', hint: 'Draft disclosure & request emails', icon: Mail },
      { label: 'Communication Toolkit', to: '/CommunicationToolkit', hint: 'Scripts & templates for every conversation', icon: MessagesSquare },
      { label: 'Accommodation Worksheet', to: '/AccommodationWorksheet', hint: 'Match each need to an accommodation', icon: ClipboardList },
      { label: 'Accommodation Templates', to: '/AccommodationTemplates', hint: 'Ready-made request letters to adapt', icon: Files },
    ],
  },
  {
    n: 4,
    key: 'return',
    name: 'Return',
    icon: Briefcase,
    blurb:
      'Ease back in at a pace your body can sustain. Track your energy, log each day, and keep your records organized so every check-in is grounded in what actually happened.',
    tools: [
      { label: 'My Journey', to: '/MyJourney', hint: 'Track your progress & milestones', icon: Map },
      { label: 'Energy Management', to: '/EnergyManagement', hint: 'Track fatigue & pace your days', icon: Activity },
      { label: 'Wellbeing Hub', to: '/WellbeingHub', hint: 'Fatigue, sleep & self-care tools', icon: HeartPulse },
      { label: 'Record Keeping', to: '/RecordKeeping', hint: 'Keep medical & workplace notes organized', icon: FolderOpen },
    ],
  },
  {
    n: 5,
    key: 'thrive',
    name: 'Thrive',
    icon: Sprout,
    blurb:
      'Returning is the milestone, not the finish line. Grow your career, connect with peers who get it, and sustain the wellbeing routines that keep you steady for the long haul.',
    tools: [
      { label: 'Career Hub', to: '/CareerHub', hint: 'Resume, interviews & career growth', icon: Briefcase },
      { label: 'Job Boards', to: '/JobBoards', hint: 'Find flexible, survivor-friendly work', icon: Search },
      { label: 'Community Hub', to: '/CommunityHub', hint: 'Peer connections & forums', icon: Users },
      { label: 'Wellness Resources', to: '/WellnessResources', hint: 'Long-term wellbeing library', icon: HeartPulse },
      { label: 'Emotional Support', to: '/EmotionalSupport', hint: 'Ongoing support & coping tools', icon: HeartHandshake },
    ],
  },
];

export default function NavigatorMethod() {
  const { isAuthenticated } = useAuth();
  useSEO({
    title: 'The Navigator Method: 5 Steps to Return to Work After Cancer',
    description:
      'The Navigator Method is a five-step framework, Explore, Plan, Build, Return, Thrive, that guides cancer survivors back to work. Each step links to free ADA, coaching, and accommodation tools.',
    path: '/NavigatorMethod',
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <PageHeader
        center
        eyebrow="The Navigator Method"
        title="Explore · Plan · Build · Return · Thrive"
        subtitle="The five-step path back to work after cancer. Each step links to the free tools that move you forward. Start wherever you are."
      />

      <Card className="nv-card--muted">
        <CardContent className="pt-6 space-y-3">
          <p className="text-brand-text leading-relaxed">
            <strong className="font-heading">The Navigator Method</strong> is the five-step path cancer survivors follow to return to work with confidence: Explore, Plan, Build, Return, Thrive. Each step is a doorway into the tools below, and every one of them is free.
          </p>
          <p className="text-sm text-brand-muted-foreground">
            You don't have to go in order. Pick the step that meets your moment today.
          </p>
        </CardContent>
      </Card>

      <ol className="nv-spine list-none m-0 p-0">
        {STEPS.map((step) => {
          const StepIcon = step.icon;
          return (
            <li className="nv-spine-step" key={step.key}>
              <span className="nv-spine-dot nv-spine-dot--active" aria-hidden="true">
                <StepIcon className="h-4 w-4" />
              </span>
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <span className="nv-eyebrow nv-eyebrow--primary">Step {step.n} of 5</span>
                  <h2 className="font-heading text-2xl font-bold text-brand-text">{step.name}</h2>
                  <p className="text-brand-muted-foreground leading-relaxed">{step.blurb}</p>
                  <div>
                    <p className="nv-eyebrow mb-2">Tools in this step</p>
                    <div className="space-y-2">
                      {step.tools.map((t) => {
                        const ToolIcon = t.icon;
                        return (
                          <Link key={t.to} to={t.to} className="nv-navitem w-full !justify-start !rounded-brand">
                            <ToolIcon className="h-5 w-5 text-brand-primary shrink-0" />
                            <span className="flex-1 min-w-0">
                              <span className="block font-semibold text-brand-text">{t.label}</span>
                              <span className="block text-xs font-normal text-brand-muted-foreground">{t.hint}</span>
                            </span>
                            <ArrowRight className="h-4 w-4 text-brand-muted-foreground shrink-0" />
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </li>
          );
        })}
      </ol>

      <Card className="nv-card--muted">
        <CardContent className="pt-6 text-center space-y-4">
          <h2 className="font-heading text-2xl font-bold text-brand-text">Start wherever you are</h2>
          <p className="text-brand-muted-foreground max-w-md mx-auto">
            Every step above is free. Create an account to save your progress, your letters, and your plan in one private place.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {!isAuthenticated && (
              <Button asChild>
                <Link to="/register">Create your free account</Link>
              </Button>
            )}
            <Button asChild variant="outline">
              <Link to="/LegalRights">Start with Explore</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}