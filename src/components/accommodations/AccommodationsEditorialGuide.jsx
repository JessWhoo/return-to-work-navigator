import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Battery, Brain, Shield, Stethoscope, CheckCircle2, FileCheck } from 'lucide-react';

const SYMPTOM_GUIDES = [
  {
    icon: Battery,
    symptom: 'Cancer-Related Fatigue (CRF) & Stamina Recovery',
    whyItHappens:
      'Unlike ordinary tiredness, cancer-related fatigue is a persistent physical and cellular exhaustion caused by chemotherapy, radiation, immunotherapy, anemia, or endocrine therapy that does not fully resolve with a single night of sleep.',
    accommodations: [
      'Phased return-to-work schedule (e.g., 20 hours/week in Weeks 1–2, 30 hours in Weeks 3–4, building to full-time)',
      'Mid-week recovery day (working Monday/Tuesday and Thursday/Friday with Wednesday off via intermittent FMLA or ADA)',
      'Flexible start and end times aligned with peak morning energy windows',
      'Temporary hybrid or work-from-home schedule to eliminate physical commute drain',
      'Two scheduled 15-minute rest breaks in a quiet room or wellness space',
    ],
  },
  {
    icon: Brain,
    symptom: 'Cognitive Changes ("Chemo Brain" / Brain Fog)',
    whyItHappens:
      'Cancer treatments, surgical anesthesia, sleep disruption, and hormone therapies frequently affect working memory, word retrieval, multitasking, and information-processing speed.',
    accommodations: [
      'Written follow-up summaries and action items after verbal meetings',
      'Permission to record meetings or use AI transcription notes for personal reference',
      'Protected 90-minute uninterrupted focus blocks with notifications paused',
      'Relocation to a quieter workspace or noise-canceling headset approval',
      'Prioritized weekly task lists (focusing on 2–3 core priorities rather than rapid context switching)',
    ],
  },
  {
    icon: Stethoscope,
    symptom: 'Peripheral Neuropathy, Lymphedema & Surgical Restrictions',
    whyItHappens:
      'Nerve damage in the hands or feet (taxane/platinum chemotherapy), post-surgical lifting limits, or lymphedema management can impact typing, standing, driving, or physical tasks.',
    accommodations: [
      'Voice-to-text dictation software, ergonomic split keyboard, or vertical mouse',
      'Sit-to-stand workstation, cushioned anti-fatigue mat, or stool for standing roles',
      'Temporary restriction on lifting over 10–15 lbs or overhead reaching',
      'Accessible parking space closer to the building entrance',
      'Workspace temperature control or permission to wear compression garments and comfortable footwear',
    ],
  },
  {
    icon: Shield,
    symptom: 'Immunosuppression & Ongoing Oncology Appointments',
    whyItHappens:
      'During active therapy, maintenance infusions, or blood-count recovery, survivors face heightened infection risk and frequent lab, scan, and oncology visits.',
    accommodations: [
      'Full remote work during neutropenia or peak seasonal illness periods',
      'Private office or low-traffic workstation away from public reception areas',
      'Intermittent leave or flexible make-up hours for oncology appointments, scans, and infusions',
      'Access to a clean refrigerator for medications and a private space for symptom management',
    ],
  },
];

const INTERACTIVE_PROCESS_STEPS = [
  {
    step: '1. Submit a Clear, Written Accommodation Request',
    detail:
      'You can initiate an ADA request verbally, but putting it in writing creates a protective timestamp. State that you are requesting a reasonable workplace accommodation for a medical condition, list the specific adjustments that will help you perform your core duties, and propose a start date.',
  },
  {
    step: '2. Provide Focused Medical Documentation (Functional Limits, Not Full Charts)',
    detail:
      'HR can ask for a brief letter from your oncologist, primary care physician, or nurse practitioner confirming that you have a covered medical condition, describing your functional limitations at work (such as reduced stamina or compromised immunity), and recommending specific adjustments. Your employer is not entitled to your complete oncology records.',
  },
  {
    step: '3. Engage in the Collaborative "Interactive Process"',
    detail:
      'Under the ADA, your employer must meet with you in good faith to review how your requested accommodations work with your essential job functions. Propose a 30-, 60-, or 90-day trial period with a scheduled review date—employers are far more likely to approve adjustments when there is a built-in check-in.',
  },
  {
    step: '4. Document the Agreement (and Know Your Options if Denied)',
    detail:
      'Send a brief summary email confirming the agreed accommodations and review date. An employer can only refuse a reasonable accommodation if it creates "undue hardship" (significant operational or financial difficulty), and even then, they must explore alternative effective accommodations with you.',
  },
];

export default function AccommodationsEditorialGuide({ headingLevel = 'h2' }) {
  const H2 = headingLevel === 'h3' ? 'h3' : 'h2';
  const H3 = headingLevel === 'h3' ? 'h4' : 'h3';

  return (
    <div className="space-y-8">
      {/* Section 1: Complete Guide Overview */}
      <section aria-labelledby="ada-overview-heading" className="space-y-4">
        <Card>
          <CardContent className="p-6 sm:p-8 space-y-4">
            <p className="nv-eyebrow nv-eyebrow--primary">Comprehensive Survivor &amp; HR Guide</p>
            <H2 id="ada-overview-heading" className="font-heading text-2xl sm:text-3xl font-bold text-brand-text">
              How ADA Workplace Accommodations Work for Cancer Survivors
            </H2>
            <p className="text-sm sm:text-base text-brand-text leading-relaxed">
              Under the federal <strong>Americans with Disabilities Act Amendments Act (ADAAA)</strong>, cancer is almost always covered as a qualifying disability—whether you are working through active treatment, transitioning back after surgery or chemotherapy, or managing long-term side effects years into remission. Because cancer affects normal cell growth (a major bodily function under federal law), employers with <strong>15 or more employees</strong> are legally required to provide reasonable accommodations unless doing so causes undue hardship. Many state fair-employment laws apply to even smaller employers.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="rounded-brand border border-brand-border bg-brand-background p-4">
                <p className="font-heading text-sm font-bold text-brand-text">Covered Stages</p>
                <p className="text-xs text-brand-muted-foreground mt-1 leading-relaxed">
                  Active treatment, phased return, remission, maintenance therapy, and late effects (fatigue, neuropathy, chemo brain).
                </p>
              </div>
              <div className="rounded-brand border border-brand-border bg-brand-background p-4">
                <p className="font-heading text-sm font-bold text-brand-text">Core Legal Standard</p>
                <p className="text-xs text-brand-muted-foreground mt-1 leading-relaxed">
                  Adjustments that enable you to perform the <strong>essential functions</strong> of your role without imposing undue hardship.
                </p>
              </div>
              <div className="rounded-brand border border-brand-border bg-brand-background p-4">
                <p className="font-heading text-sm font-bold text-brand-text">Medical Privacy</p>
                <p className="text-xs text-brand-muted-foreground mt-1 leading-relaxed">
                  HR must keep medical letters in a confidential file separate from personnel records and cannot share your diagnosis with coworkers.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Section 2: Accommodations by Symptom */}
      <section aria-labelledby="symptom-accommodations-heading" className="space-y-4">
        <div className="space-y-1.5">
          <p className="nv-eyebrow nv-eyebrow--primary">Match Support to Your Symptoms</p>
          <H2 id="symptom-accommodations-heading" className="font-heading text-2xl sm:text-3xl font-bold text-brand-text">
            Practical Workplace Accommodations by Side Effect
          </H2>
          <p className="text-sm sm:text-base text-brand-muted-foreground max-w-3xl">
            The strongest accommodation requests connect a specific functional limitation to a concrete, practical workplace adjustment:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SYMPTOM_GUIDES.map((group) => {
            const Icon = group.icon;
            return (
              <Card key={group.symptom} className="h-full">
                <CardContent className="p-6 space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-pill bg-brand-muted text-brand-primary">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <H3 className="font-heading text-base sm:text-lg font-bold text-brand-text">
                        {group.symptom}
                      </H3>
                      <p className="text-xs text-brand-muted-foreground mt-1 leading-relaxed">
                        {group.whyItHappens}
                      </p>
                    </div>
                  </div>
                  <ul className="space-y-1.5 pt-1">
                    {group.accommodations.map((acc) => (
                      <li key={acc} className="flex items-start gap-2 text-xs sm:text-sm text-brand-text">
                        <CheckCircle2 className="h-4 w-4 text-brand-primary shrink-0 mt-0.5" />
                        <span>{acc}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Section 3: How the ADA Interactive Process Works */}
      <section aria-labelledby="interactive-process-heading" className="space-y-4">
        <Card className="nv-card--muted">
          <CardContent className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 text-brand-primary font-heading font-bold">
              <FileCheck className="h-5 w-5 shrink-0" />
              <span className="text-xs uppercase tracking-wider">Step-by-Step Playbook</span>
            </div>
            <H2 id="interactive-process-heading" className="font-heading text-2xl sm:text-3xl font-bold text-brand-text">
              How the ADA Interactive Process Works
            </H2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {INTERACTIVE_PROCESS_STEPS.map((item) => (
                <div key={item.step} className="rounded-brand border border-brand-border bg-brand-surface p-4 space-y-1.5">
                  <H3 className="font-heading text-sm sm:text-base font-bold text-brand-text">
                    {item.step}
                  </H3>
                  <p className="text-xs sm:text-sm text-brand-muted-foreground leading-relaxed">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}