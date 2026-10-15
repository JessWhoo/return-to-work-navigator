import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, ClipboardList, Clock, Headphones, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PageHeader from '@/components/brand/PageHeader';
import useSEO from '@/hooks/useSEO';
import GuideFaqSection from '@/components/seo/GuideFaqSection';
import DailyCheckIn from '@/components/DailyCheckIn';
import { CHEMO_BRAIN_FAQS } from '@/components/seo/guideFaqsData';

const STRATEGIES = [
  { icon: ClipboardList, title: 'Write everything down', desc: 'After every meeting, send a short bullet recap of decisions and next steps. A written trail beats relying on memory mid-fatigue.' },
  { icon: Clock, title: 'Single-task in short blocks', desc: 'Protect 25- to 45-minute focus windows with notifications off. Multitasking taxes working memory the most, so sequence tasks instead of stacking them.' },
  { icon: Headphones, title: 'Ask to record meetings', desc: 'Recording a meeting (with notice) lets you review details later instead of capturing them live. Many employers grant this as a reasonable accommodation.' },
  { icon: Brain, title: 'Tackle hard work when energy peaks', desc: 'Most survivors think most clearly in the morning. Schedule demanding analytical work early and leave routine tasks for the afternoon dip.' },
];

const ACCOMMODATIONS = [
  'Written instructions and meeting summaries for any verbal task.',
  'Permission to record team meetings for later review.',
  'A prioritized top-two-or-three weekly deliverables list instead of a long open queue.',
  'Protected, uninterrupted focus blocks and fewer context switches.',
  'A quieter workspace or noise-canceling tools to cut distraction.',
  'Flexible start times and short afternoon rest breaks to match your energy curve.',
];

export default function ChemoBrainGuide() {
  useSEO({
    title: 'Chemo Brain at Work: Symptoms, Strategies & Accommodations',
    description:
      'A plain-language guide to cancer-related cognitive impairment (chemo brain) at work: real symptoms, practical focus strategies, ADA accommodations, and a daily energy check-in.',
    path: '/ChemoBrainGuide',
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <PageHeader
        center
        eyebrow="Symptom guide"
        title="Chemo Brain at Work: What It Is and How to Manage It"
        subtitle="Cancer-related cognitive changes are real, common, and protected. Here is how to recognize chemo brain, work around it, and ask for the support you deserve."
      />

      <Card>
        <CardContent className="space-y-4 p-6 sm:p-8">
          <h2 className="font-heading text-2xl font-bold sm:text-3xl text-brand-text">What Is Chemo Brain?</h2>
          <p className="text-base text-brand-text">
            "Chemo brain" describes the thinking and memory changes many people notice during and after cancer treatment.
            Survivors describe losing words mid-sentence, forgetting why they walked into a room, or struggling to follow a
            fast meeting the way they used to. Research confirms it is a real, measurable effect of cancer and its
            treatment, not a personal failing or a sign of aging.
          </p>
          <p className="text-base text-brand-text">
            It can show up as trouble concentrating, slower processing, difficulty multitasking, short-term memory
            slips, and trouble finding the right word. For most people it improves over months to a few years, but for
            some it lingers, and it can flare on tired or treatment-heavy days.
          </p>
        </CardContent>
      </Card>

      <Card className="nv-card--sage">
        <CardContent className="space-y-4 p-6 sm:p-8">
          <h2 className="font-heading text-2xl font-bold sm:text-3xl text-brand-text">How Chemo Brain Shows Up at Work</h2>
          <ul className="space-y-2 text-base text-brand-text">
            <li>You re-read the same email several times and still feel unsure you caught the key point.</li>
            <li>A familiar task takes longer, and you second-guess steps you used to do on autopilot.</li>
            <li>Meetings move fast and you leave unsure of what was decided or assigned to you.</li>
            <li>You lose a word right as you speak, or juggle two requests and drop one.</li>
            <li>By mid-afternoon, focus collapses even when the work itself is not hard.</li>
          </ul>
          <p className="text-base text-brand-muted-foreground">
            None of this means you cannot do your job. It means the way you did it before needs adjusting for a while,
            and the law gives you the right to ask for those adjustments.
          </p>
        </CardContent>
      </Card>

      <section aria-labelledby="strategies-heading" className="space-y-5">
        <div className="space-y-1.5">
          <p className="nv-eyebrow nv-eyebrow--primary">Practical focus strategies</p>
          <h2 id="strategies-heading" className="font-heading text-2xl sm:text-3xl font-bold text-brand-text">
            Working With Chemo Brain, Not Against It
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {STRATEGIES.map(({ icon: Icon, title, desc }) => (
            <Card key={title}>
              <CardContent className="flex items-start gap-3 p-5">
                <span className="mt-0.5 flex-shrink-0 rounded-pill bg-brand-muted p-2 text-brand-primary">
                  <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
                </span>
                <div>
                  <p className="text-base font-bold text-brand-text">{title}</p>
                  <p className="mt-1 text-sm text-brand-muted-foreground">{desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Card className="nv-card--pink">
        <CardContent className="space-y-4 p-6 sm:p-8">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-brand-primary" aria-hidden="true" />
            <h2 className="font-heading text-2xl font-bold sm:text-3xl text-brand-text">Accommodations You Can Request</h2>
          </div>
          <p className="text-base text-brand-text">
            Under the Americans with Disabilities Act (ADA), chemo brain is treated as a covered disability because it
            can substantially limit concentration and thinking. You can request reasonable adjustments through your
            employer's interactive process. Helpful accommodations include:
          </p>
          <ul className="space-y-2 text-base text-brand-text">
            {ACCOMMODATIONS.map(item => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-pill bg-brand-primary" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-sm text-brand-muted-foreground">
            You do not have to name your diagnosis to request these. A short note from your provider confirming a
            medical condition affecting concentration is enough to start the conversation.
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <Button asChild variant="outline"><Link to="/Accommodations">Build an accommodation request <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" /></Link></Button>
          </div>
        </CardContent>
      </Card>

      {/* Energy check-in tie-in */}
      <Card>
        <CardContent className="space-y-2 p-6 sm:p-8">
          <p className="nv-eyebrow nv-eyebrow--primary">Tied to your Energy check-in</p>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-brand-text">Check In With Your Energy Today</h2>
          <p className="text-base text-brand-text">
            Chemo brain and fatigue travel together, and they flare on the same kinds of days. Log how you are feeling
            with the Energy check-in below, choose "Cognitive fog / concentration" as your top challenge, and get a
            matched resource for today.
          </p>
        </CardContent>
      </Card>
      <DailyCheckIn />

      <GuideFaqSection
        id="chemo-brain-faq"
        eyebrow="Chemo brain FAQ"
        title="Frequently Asked Questions: Chemo Brain at Work"
        subtitle="Answers to the most common questions about cancer-related cognitive changes, memory, concentration, and your right to accommodations."
        faqs={CHEMO_BRAIN_FAQS}
      />

      <Card className="nv-card--muted">
        <CardContent className="p-8 text-center space-y-4">
          <Sparkles className="h-10 w-10 text-brand-primary mx-auto" />
          <h2 className="text-2xl font-extrabold text-brand-text">Want a plan built around your week?</h2>
          <p className="text-brand-text font-medium max-w-xl mx-auto">
            Open the Energy &amp; Fatigue hub to pace your workday, or talk through chemo brain strategies with the AI Coach.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button asChild><Link to="/WellbeingHub?tab=energy">Open Energy &amp; Fatigue hub <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" /></Link></Button>
            <Button asChild variant="outline"><Link to="/Coach">Talk to the AI Coach</Link></Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}