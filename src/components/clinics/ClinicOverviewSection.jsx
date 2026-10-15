import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Scale, Calendar, Battery, Mail, MessageSquare, ArrowRight } from 'lucide-react';

const PATIENT_TOOLS = [
  {
    title: 'ADA Accommodation Letter Generator',
    subtitle: '3-step guided letter builder',
    description:
      'Helps patients translate post-treatment limitations (fatigue, neuropathy, cognitive fog, oncology follow-ups) into a formal, ADA-aligned accommodation request letter they can review with their care team or HR.',
    href: '/AccommodationLetterGenerator',
    icon: FileText,
  },
  {
    title: 'FMLA, ADA & State Leave Rights Hub',
    description:
      'Plain-language guides and an interactive advisor covering intermittent FMLA leave, reasonable ADA accommodations, COBRA health insurance continuation, and state paid medical leave across all 50 U.S. states.',
    subtitle: 'Federal & 50-state protections',
    href: '/LegalPolicyHub',
    icon: Scale,
  },
  {
    title: 'Phased Return-to-Work Schedule Planner',
    subtitle: 'Gradual re-entry templates',
    description:
      'Lets survivors map out a realistic week-by-week ramp-up schedule (e.g., part-time hours, mid-week rest days, hybrid telework) and export a clean PDF summary to bring to oncology clearance appointments.',
    href: '/ReturnPlanning',
    icon: Calendar,
  },
  {
    title: 'Fatigue, Chemo Brain & Energy Pacing',
    subtitle: 'Daily tracking & coping guides',
    description:
      'Evidence-informed strategies and daily energy/symptom logs that help patients identify peak focus windows, prevent afternoon crashes, and communicate functional needs to clinicians.',
    href: '/WellnessLibrary',
    icon: Battery,
  },
  {
    title: 'Workplace Disclosure & HR Email Toolkit',
    subtitle: 'Scripts that protect privacy',
    description:
      'Step-by-step disclosure guidance explaining how patients can request medical accommodations without revealing their diagnosis to coworkers or direct supervisors, paired with copy-ready email templates.',
    href: '/DisclosureGuide',
    icon: Mail,
  },
  {
    title: '24/7 AI Return-to-Work Coach & Peer Hub',
    subtitle: 'On-demand guidance between visits',
    description:
      'Gives survivors a supportive sounding board to rehearse supervisor conversations, prepare HR meeting talking points, and connect with peers in similar industries.',
    href: '/Coach',
    icon: MessageSquare,
  },
];

export default function ClinicOverviewSection() {
  return (
    <section aria-labelledby="what-it-is-heading" className="space-y-5">
      <div className="space-y-2">
        <p className="nv-eyebrow nv-eyebrow--primary">What It Is</p>
        <h2 id="what-it-is-heading" className="font-heading text-2xl sm:text-3xl font-bold text-brand-text">
          A Practical Workplace Bridge for Survivorship Care Plans
        </h2>
        <p className="text-brand-muted-foreground max-w-3xl">
          Oncology nurse navigators and social workers are routinely asked questions that fall between clinical care and HR policy: <em>&ldquo;How do I ask for intermittent FMLA?&rdquo; &ldquo;What accommodations help with chemo brain?&rdquo; &ldquo;Do I have to tell my boss I had cancer?&rdquo;</em> Return to Work Navigator gives your patients an immediate, self-guided toolkit to answer those questions with confidence.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {PATIENT_TOOLS.map((tool) => {
          const Icon = tool.icon;
          return (
            <Card key={tool.href} className="flex flex-col h-full">
              <CardContent className="p-6 flex flex-col flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-pill bg-brand-muted text-brand-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-brand-primary">
                      {tool.subtitle}
                    </p>
                    <h3 className="font-heading text-base font-bold text-brand-text">
                      {tool.title}
                    </h3>
                  </div>
                </div>
                <p className="text-sm text-brand-muted-foreground leading-relaxed flex-1">
                  {tool.description}
                </p>
                <div className="pt-2">
                  <Link
                    to={tool.href}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-primary hover:text-brand-text"
                  >
                    Preview patient tool <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}