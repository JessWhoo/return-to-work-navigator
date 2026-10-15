import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HeartHandshake, Copy, Check, FileDown, Share2, ClipboardList } from 'lucide-react';
import { toast } from 'sonner';
import { generateClinicHandoutPdf } from './generateClinicHandoutPdf';

const AVS_BLURB = `Return to Work Support (Free Resource):
As you prepare to return to work or request workplace adjustments during treatment recovery, visit The Return to Work Navigator at https://return-to-work-navigator.org — a 100% free, private toolkit for cancer survivors. It includes a step-by-step ADA Workplace Accommodation Letter Generator, a Phased Return Schedule Planner, plain-language FMLA/ADA legal guides, fatigue & chemo-brain pacing tools, and employer email scripts. No account or sign-in is required to browse guides or generate accommodation letters.`;

const REFERRAL_SCENARIOS = [
  {
    need: 'Needs a doctor-supported ADA accommodation letter',
    url: 'https://return-to-work-navigator.org/AccommodationLetterGenerator',
    tool: 'ADA Letter Generator & HR Meeting Worksheet',
  },
  {
    need: 'Anxious about whether or how to disclose diagnosis at work',
    url: 'https://return-to-work-navigator.org/DisclosureGuide',
    tool: 'Step-by-Step Workplace Disclosure Guide',
  },
  {
    need: 'Planning a gradual part-time or hybrid ramp-up schedule',
    url: 'https://return-to-work-navigator.org/ReturnPlanning',
    tool: 'Phased Return-to-Work Schedule Builder',
  },
  {
    need: 'Struggling with cancer-related fatigue or chemo brain on the job',
    url: 'https://return-to-work-navigator.org/WellnessLibrary',
    tool: 'Fatigue Management & Workplace Wellness Library',
  },
  {
    need: 'Questions about intermittent FMLA, ADA, COBRA, or state leave',
    url: 'https://return-to-work-navigator.org/LegalRightsAdvisor',
    tool: 'Interactive Workplace Legal Rights Advisor',
  },
];

export default function ClinicFreeAndReferralSection() {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedBlurb, setCopiedBlurb] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText('https://return-to-work-navigator.org');
      setCopiedLink(true);
      toast.success('Referral URL copied to clipboard.');
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      toast.error('Could not copy link.');
    }
  };

  const handleCopyBlurb = async () => {
    try {
      await navigator.clipboard.writeText(AVS_BLURB);
      setCopiedBlurb(true);
      toast.success('After-Visit Summary (AVS) blurb copied.');
      setTimeout(() => setCopiedBlurb(false), 2500);
    } catch {
      toast.error('Could not copy text.');
    }
  };

  const handleDownloadHandout = () => {
    try {
      generateClinicHandoutPdf();
      toast.success('1-page patient handout PDF downloaded.');
    } catch {
      toast.error('Could not generate PDF handout.');
    }
  };

  return (
    <section aria-labelledby="free-and-referral-heading" className="space-y-6">
      {/* Free for Patients Guarantee Banner */}
      <Card className="nv-card--muted">
        <CardContent className="p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-primary">
              <HeartHandshake className="h-4 w-4" />
              <span>100% Free for Patients &amp; Care Teams</span>
            </div>
            <h2 id="free-and-referral-heading" className="font-heading text-2xl sm:text-3xl font-bold text-brand-text">
              Zero Cost. Zero Paywalls. No Account Required to Use Core Tools.
            </h2>
            <p className="text-sm sm:text-base text-brand-muted-foreground leading-relaxed">
              Financial toxicity is already one of the hardest burdens of cancer treatment. Every guide, ADA accommodation letter generator, printable PDF worksheet, state legal directory, and AI coaching resource on Return to Work Navigator is <strong>completely free for survivors and clinics</strong> — with no paid tiers, no credit cards, and no gated downloads.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0 w-full md:w-auto">
            <Button onClick={handleDownloadHandout} className="w-full">
              <FileDown className="h-4 w-4" />
              Download 1-Page Patient Handout (PDF)
            </Button>
            <Button variant="outline" onClick={handleCopyLink} className="w-full">
              {copiedLink ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copiedLink ? 'Copied https://return-to-work-navigator.org' : 'Copy Patient Referral Link'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* How to Refer Patients */}
      <div className="space-y-3">
        <p className="nv-eyebrow nv-eyebrow--primary">How to Refer</p>
        <h3 className="font-heading text-xl sm:text-2xl font-bold text-brand-text">
          Three Frictionless Ways to Share With Patients
        </h3>
        <p className="text-sm text-brand-muted-foreground max-w-3xl">
          There is no referral portal to manage and no PHI for your clinic to transmit. Share Navigator directly in your existing survivorship workflow:
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 space-y-3">
            <div className="flex items-center gap-2 text-brand-primary font-heading font-bold">
              <ClipboardList className="h-5 w-5 shrink-0" />
              <h4>1. Paste Into After-Visit Summaries (Epic / Cerner)</h4>
            </div>
            <p className="text-sm text-brand-muted-foreground">
              Copy our ready-made smart phrase into your electronic health record After-Visit Summary (AVS), survivorship care plan, or MyChart message:
            </p>
            <div className="rounded-brand border border-brand-border bg-brand-background p-3 text-xs text-brand-text whitespace-pre-wrap">
              {AVS_BLURB}
            </div>
            <Button variant="outline" size="sm" onClick={handleCopyBlurb} className="w-full">
              {copiedBlurb ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copiedBlurb ? 'AVS Smart Phrase Copied' : 'Copy AVS / MyChart Blurb'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-brand-primary font-heading font-bold">
                <FileDown className="h-5 w-5 shrink-0" />
                <h4>2. Print the 1-Page Clinic Resource Sheet</h4>
              </div>
              <p className="text-sm text-brand-muted-foreground">
                Keep a printed stack in infusion suites, radiation waiting areas, or social work offices, or include the 1-page PDF in new-patient and end-of-treatment folders.
              </p>
              <ul className="text-xs text-brand-muted-foreground space-y-1.5 list-disc pl-4">
                <li>Formatted for standard 8.5&quot; × 11&quot; black-and-white or color clinic printing</li>
                <li>Lists direct URLs for the ADA Letter Generator, Return Planner, and Legal Hub</li>
                <li>Includes clear privacy and non-medical educational disclaimers</li>
              </ul>
            </div>
            <Button variant="secondary" size="sm" onClick={handleDownloadHandout} className="w-full">
              <FileDown className="h-4 w-4" />
              Download Printable PDF Flyer
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-3">
            <div className="flex items-center gap-2 text-brand-primary font-heading font-bold">
              <Share2 className="h-5 w-5 shrink-0" />
              <h4>3. Direct Link by Patient Concern</h4>
            </div>
            <p className="text-sm text-brand-muted-foreground">
              Send patients straight to the tool that matches today&apos;s navigation consult:
            </p>
            <div className="space-y-2.5 pt-1">
              {REFERRAL_SCENARIOS.map((item) => (
                <div key={item.url} className="border-b border-brand-border pb-2 last:border-b-0 last:pb-0">
                  <p className="text-xs font-semibold text-brand-text">{item.need}</p>
                  <p className="text-xs text-brand-primary">{item.tool} — <span className="underline">{item.url.replace('https://', '')}</span></p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}