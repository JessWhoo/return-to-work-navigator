import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Check, Shield, Users, MessageSquareQuote } from 'lucide-react';
import { toast } from 'sonner';

const DISCLOSURE_LEVELS = [
  {
    level: '1. Accommodation-Only (Functional) Disclosure',
    whoSeesIt: 'HR or Leave Administrator only',
    whenToChoose:
      'Best when you want legal protection (ADA accommodations or FMLA leave) while keeping your cancer diagnosis completely private from your supervisor and coworkers.',
    whatYouSay:
      'You share only that you have a covered medical condition and provide a doctor’s note listing functional work restrictions (e.g., temporary remote work, flexible start times, or lifting limits) without naming cancer in team conversations.',
  },
  {
    level: '2. Selective (Manager + HR) Disclosure',
    whoSeesIt: 'HR and your direct supervisor (with explicit privacy boundaries)',
    whenToChoose:
      'Best when you trust your manager, anticipate shifting schedules for infusions or scans, and want collaborative problem-solving while keeping the broader team out of your medical details.',
    whatYouSay:
      'You share your treatment timeline and accommodation needs with HR and your manager, and explicitly state: "I am keeping this private from the wider team—please refer only to my approved schedule adjustments."',
  },
  {
    level: '3. Open Team Disclosure (On Your Terms)',
    whoSeesIt: 'HR, your manager, and selected colleagues',
    whenToChoose:
      'Best when visible treatment changes, longer leave, or close team relationships make sharing feel more comfortable—while still setting boundaries around unsolicited medical advice.',
    whatYouSay:
      'You decide whether to tell the team yourself or have your manager share a brief, pre-approved statement that focuses on how work will be covered and how teammates can respect your energy.',
  },
];

const DISCLOSURE_SCRIPTS = [
  {
    id: 'hr-functional',
    audience: 'To HR (Requesting ADA Accommodations Without Naming Cancer)',
    subject: 'Request for Reasonable Workplace Accommodation',
    script: `Dear [HR Representative Name],

I am writing to formally request temporary workplace accommodations under the Americans with Disabilities Act (ADA) for a medical condition currently under my physician's care.

To continue performing my core responsibilities effectively during treatment and recovery, my healthcare provider recommends:
• [Accommodation 1, e.g., Working remotely 3 days per week]
• [Accommodation 2, e.g., Flexible start times on Tuesday mornings for medical appointments]

I have attached a medical certification letter from my physician confirming these functional recommendations through [Date/Timeframe]. Please let me know the next steps in our interactive process, and please keep this medical documentation confidential in accordance with ADA guidelines.

Thank you,
[Your Name]`,
  },
  {
    id: 'manager-direct',
    audience: 'To Your Direct Manager (Sharing Diagnosis + Return Plan)',
    subject: 'Private Update & Schedule Planning',
    script: `Hi [Manager Name],

Thank you for taking time to meet with me privately. I want to share that I have been diagnosed with a medical condition [or: cancer] and will be undergoing treatment over the next [timeframe].

I am committed to my role and have worked with my care team to map out a realistic plan so our key deliverables stay on track. Specifically, I am coordinating with HR on [intermittent FMLA / temporary hybrid work / flexible hours on treatment days], and I have drafted a handoff checklist for any days I need to be offline.

I am keeping my diagnosis private from the wider team right now. With your support, I’d like us to tell the team only that I have an approved schedule adjustment. Let's review priorities for the next two weeks and set a regular 15-minute check-in.

Best,
[Your Name]`,
  },
  {
    id: 'coworker-boundary',
    audience: 'To Well-Meaning Coworkers (Polite Privacy Boundary)',
    subject: 'In-Person / Slack / Teams Response',
    script: `"Thank you so much for checking in on me—I really appreciate the support. Everything is being well managed with my doctors, and while I’m at work it actually helps me most to focus on normal projects and routines rather than talking through health details. I'm really glad to be back working with you on [Project Name]!"`,
  },
  {
    id: 'job-interview',
    audience: 'In a Job Interview (Addressing a Treatment Resume Gap)',
    subject: 'Verbal Response to "Tell Me About This Gap on Your Resume"',
    script: `"I took a planned medical leave to handle a health matter that is now resolved [or: well managed]. During the final phase of my recovery, I stayed current on [industry skill / certification / project area], and I have full clearance and energy for this role. In fact, navigating that period sharpened my prioritization and communication skills—which is why I'm so excited about what I can bring to your team."`,
  },
];

export default function DisclosureEditorialGuide() {
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = async (item) => {
    try {
      await navigator.clipboard.writeText(item.script);
      setCopiedId(item.id);
      toast.success('Script copied to clipboard.');
      setTimeout(() => setCopiedId(null), 2500);
    } catch {
      toast.error('Could not copy script.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Section 1: The Three Levels of Workplace Disclosure */}
      <section aria-labelledby="disclosure-levels-heading" className="space-y-4">
        <Card>
          <CardContent className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 text-brand-primary font-heading font-bold">
              <Shield className="h-5 w-5 shrink-0" />
              <span className="text-xs uppercase tracking-wider">Your Privacy Rights</span>
            </div>
            <h2 id="disclosure-levels-heading" className="font-heading text-2xl sm:text-3xl font-bold text-brand-text">
              Do You Have to Disclose a Cancer Diagnosis at Work?
            </h2>
            <p className="text-sm sm:text-base text-brand-text leading-relaxed">
              Under U.S. employment law, <strong>you are never required to announce a cancer diagnosis to your boss or coworkers</strong>. Disclosure is not an all-or-nothing choice—it is a spectrum. You can access full legal protection under the <strong>Americans with Disabilities Act (ADA)</strong> and the <strong>Family and Medical Leave Act (FMLA)</strong> by sharing functional medical documentation with HR while keeping your specific diagnosis confidential.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-2">
              {DISCLOSURE_LEVELS.map((item) => (
                <div
                  key={item.level}
                  className="rounded-brand border border-brand-border bg-brand-background p-5 space-y-2.5 flex flex-col"
                >
                  <h3 className="font-heading text-base font-bold text-brand-text">
                    {item.level}
                  </h3>
                  <p className="text-xs font-semibold text-brand-primary">
                    Who knows: {item.whoSeesIt}
                  </p>
                  <p className="text-xs text-brand-muted-foreground leading-relaxed">
                    <strong className="text-brand-text">When to use:</strong> {item.whenToChoose}
                  </p>
                  <p className="text-xs text-brand-muted-foreground leading-relaxed flex-1">
                    <strong className="text-brand-text">How it works:</strong> {item.whatYouSay}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Section 2: HR vs. Manager vs. Coworkers Confidentiality */}
      <section aria-labelledby="who-knows-what-heading" className="space-y-4">
        <Card className="nv-card--muted">
          <CardContent className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 text-brand-primary font-heading font-bold">
              <Users className="h-5 w-5 shrink-0" />
              <span className="text-xs uppercase tracking-wider">Confidentiality Rules</span>
            </div>
            <h2 id="who-knows-what-heading" className="font-heading text-2xl sm:text-3xl font-bold text-brand-text">
              HR vs. Direct Manager vs. Coworkers: Who Needs to Know What?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-brand border border-brand-border bg-brand-surface p-4 space-y-1.5">
                <h3 className="font-heading text-sm font-bold text-brand-text">1. Human Resources (HR)</h3>
                <p className="text-xs sm:text-sm text-brand-muted-foreground leading-relaxed">
                  HR processes FMLA certification and ADA accommodation letters. By law (29 CFR § 1630.14), HR must store medical documentation in a <strong>separate, confidential medical file</strong>—never in your general personnel file.
                </p>
              </div>
              <div className="rounded-brand border border-brand-border bg-brand-surface p-4 space-y-1.5">
                <h3 className="font-heading text-sm font-bold text-brand-text">2. Your Direct Supervisor</h3>
                <p className="text-xs sm:text-sm text-brand-muted-foreground leading-relaxed">
                  Your supervisor only needs to know <strong>operational adjustments</strong>: your work hours, approved remote days, temporary duty modifications, and planned leave dates. They do not need your pathology report or treatment regimen.
                </p>
              </div>
              <div className="rounded-brand border border-brand-border bg-brand-surface p-4 space-y-1.5">
                <h3 className="font-heading text-sm font-bold text-brand-text">3. Your Coworkers &amp; Clients</h3>
                <p className="text-xs sm:text-sm text-brand-muted-foreground leading-relaxed">
                  Coworkers have <strong>zero legal right</strong> to your medical information. Neither HR nor your manager may tell your team why you are on leave or using accommodations without your explicit permission.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Section 3: Word-for-Word Scripts */}
      <section aria-labelledby="disclosure-scripts-heading" className="space-y-4">
        <div className="space-y-1.5">
          <p className="nv-eyebrow nv-eyebrow--primary flex items-center gap-1.5">
            <MessageSquareQuote className="h-4 w-4" />
            <span>Copy-Ready Templates</span>
          </p>
          <h2 id="disclosure-scripts-heading" className="font-heading text-2xl sm:text-3xl font-bold text-brand-text">
            Word-for-Word Workplace Disclosure Scripts
          </h2>
          <p className="text-sm sm:text-base text-brand-muted-foreground max-w-3xl">
            Adapt these proven scripts for HR, your direct supervisor, curious coworkers, or job interviews:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DISCLOSURE_SCRIPTS.map((item) => (
            <Card key={item.id} className="flex flex-col">
              <CardContent className="p-6 flex flex-col flex-1 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-heading text-base font-bold text-brand-text">
                      {item.audience}
                    </h3>
                    <p className="text-xs font-semibold text-brand-primary mt-0.5">
                      {item.subject}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(item)}
                    className="shrink-0"
                  >
                    {copiedId === item.id ? (
                      <><Check className="h-3.5 w-3.5" /> Copied</>
                    ) : (
                      <><Copy className="h-3.5 w-3.5" /> Copy</>
                    )}
                  </Button>
                </div>
                <pre className="whitespace-pre-wrap font-body text-xs sm:text-sm text-brand-text bg-brand-background border border-brand-border rounded-brand p-3.5 leading-relaxed flex-1">
                  {item.script}
                </pre>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}