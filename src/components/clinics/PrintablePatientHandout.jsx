import React from 'react';
import { Printer, FileDown, X, ShieldCheck, CheckCircle2, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BrandMark from '@/components/brand/BrandMark';
import { QrCodeSvg } from './qrCodeMatrix';
import { generateClinicHandoutPdf } from './generateClinicHandoutPdf';
import { toast } from 'sonner';

const HANDOUT_TOOLS = [
  {
    number: '1',
    title: 'ADA Workplace Accommodation Letter Generator',
    path: 'return-to-work-navigator.org/AccommodationLetterGenerator',
    desc: 'Build a customized, ADA-aligned accommodation request letter in 3 guided steps for fatigue, remote work, flexible hours, cognitive fog, or oncology appointments.',
  },
  {
    number: '2',
    title: 'Phased Return-to-Work Schedule Planner',
    path: 'return-to-work-navigator.org/ReturnPlanning',
    desc: 'Map out a gradual week-by-week return schedule (part-time hours, mid-week rest days, hybrid telework) and download a printable summary for your doctor or manager.',
  },
  {
    number: '3',
    title: 'Workplace Disclosure Guide & HR Email Scripts',
    path: 'return-to-work-navigator.org/DisclosureGuide',
    desc: 'Decide whether, when, and how much to share at work — with word-for-word scripts that protect your medical privacy while requesting support.',
  },
  {
    number: '4',
    title: 'Plain-Language Legal Rights Hub (ADA, FMLA, COBRA & State Leave)',
    path: 'return-to-work-navigator.org/LegalPolicyHub',
    desc: 'Understand your federal and 50-state legal protections, job-protected intermittent medical leave, and health insurance continuation options.',
  },
  {
    number: '5',
    title: 'Daily Energy, Fatigue & Chemo Brain Pacing Tools',
    path: 'return-to-work-navigator.org/WellnessLibrary',
    desc: 'Track morning, afternoon, and evening energy patterns and learn practical workplace strategies for post-treatment fatigue and cognitive changes.',
  },
];

export default function PrintablePatientHandout({ open, onClose }) {
  if (!open) return null;

  const handleDownloadPdf = () => {
    try {
      generateClinicHandoutPdf();
      toast.success('1-page patient handout PDF with QR code downloaded.');
    } catch {
      toast.error('Could not generate PDF handout.');
    }
  };

  return (
    <div className="printable-doc fixed inset-0 z-[100] bg-brand-background overflow-y-auto">
      {/* Toolbar — hidden when printing */}
      <div className="print:hidden sticky top-0 z-10 bg-brand-surface border-b border-brand-border shadow-brand-sm px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-heading font-bold text-brand-text text-sm sm:text-base">
            Printable 1-Page Patient Handout (with QR Code)
          </p>
          <p className="text-xs text-brand-muted-foreground">
            Formatted for standard 8.5&quot; × 11&quot; clinic printing
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" onClick={() => window.print()}>
            <Printer className="h-4 w-4" /> Print Handout
          </Button>
          <Button variant="secondary" size="sm" onClick={handleDownloadPdf}>
            <FileDown className="h-4 w-4" /> Download PDF
          </Button>
          <Button variant="outline" size="sm" onClick={onClose}>
            <X className="h-4 w-4" /> Close
          </Button>
        </div>
      </div>

      {/* 8.5x11 Printable Sheet */}
      <div className="max-w-[8.5in] mx-auto my-6 print:my-0 bg-brand-surface shadow-brand-lg print:shadow-none px-6 sm:px-10 py-8 print:px-6 print:py-4 text-brand-text">
        {/* Top Banner with Brand + QR Code */}
        <header className="rounded-brand bg-brand-primary text-primary-foreground p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-5 mb-6">
          <div className="flex items-start gap-3.5">
            <BrandMark size="md" showName={false} className="shrink-0" />
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-widest font-semibold opacity-90">
                Free Cancer Survivorship Workplace Resource
              </p>
              <h1 className="font-heading text-xl sm:text-2xl font-bold text-primary-foreground">
                The Return to Work Navigator
              </h1>
              <p className="text-xs sm:text-sm opacity-95 max-w-md">
                Returning to work after cancer treatment? Get free, private tools for ADA accommodations, phased return schedules, FMLA rights, and fatigue pacing.
              </p>
              <p className="text-xs font-bold pt-1">
                https://return-to-work-navigator.org
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center bg-brand-surface text-brand-text rounded-brand p-2.5 shrink-0 border border-brand-border">
            <QrCodeSvg url="https://return-to-work-navigator.org" size={104} />
            <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-bold text-brand-primary">
              <Smartphone className="h-3 w-3" /> Scan With Phone
            </span>
          </div>
        </header>

        {/* Core Free Tools List */}
        <section className="space-y-2.5 mb-5">
          <h2 className="font-heading text-base sm:text-lg font-bold text-brand-text border-b border-brand-border pb-1.5">
            5 Free Tools You Can Use Today (No Sign-In Required)
          </h2>
          <div className="space-y-2">
            {HANDOUT_TOOLS.map((tool) => (
              <div
                key={tool.number}
                className="rounded-brand border border-brand-border bg-brand-background px-4 py-2.5 break-inside-avoid"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-heading text-sm font-bold text-brand-text">
                    {tool.number}. {tool.title}
                  </h3>
                  <span className="text-xs font-semibold text-brand-primary">
                    {tool.path}
                  </span>
                </div>
                <p className="text-xs text-brand-muted-foreground mt-0.5 leading-relaxed">
                  {tool.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Privacy & QR Scan Callout Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-stretch break-inside-avoid">
          <div className="sm:col-span-2 rounded-brand border border-brand-border p-4 space-y-2">
            <div className="flex items-center gap-2 text-brand-primary font-heading font-bold text-sm">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              <span>100% Free &amp; Built Around Your Privacy</span>
            </div>
            <ul className="space-y-1.5 text-xs text-brand-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-brand-primary shrink-0 mt-0.5" />
                <span><strong className="text-brand-text">Always $0 for patients:</strong> No subscriptions, no paywalls, and no credit cards required.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-brand-primary shrink-0 mt-0.5" />
                <span><strong className="text-brand-text">Use core tools anonymously:</strong> Browse guides, draft ADA letters, and download PDF worksheets without creating an account.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-brand-primary shrink-0 mt-0.5" />
                <span><strong className="text-brand-text">Never shared with employers or insurers:</strong> Your personal data is never sold or shared with employers, HR, or insurance companies.</span>
              </li>
            </ul>
          </div>

          <div className="rounded-brand border border-brand-primary bg-brand-muted p-4 flex flex-col items-center justify-center text-center space-y-1.5">
            <QrCodeSvg url="https://return-to-work-navigator.org" size={88} />
            <p className="font-heading text-xs font-bold text-brand-text">
              Open Camera &amp; Scan
            </p>
            <p className="text-[11px] text-brand-muted-foreground leading-tight">
              Or visit <strong className="text-brand-text">return-to-work-navigator.org</strong> on any phone, tablet, or computer.
            </p>
          </div>
        </section>

        {/* Footer Disclaimer */}
        <footer className="mt-5 pt-3 border-t border-brand-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] text-brand-muted-foreground">
          <span>
            Educational workplace resource — always review medical restrictions with your oncology care team.
          </span>
          <span className="font-semibold text-brand-text">
            https://return-to-work-navigator.org
          </span>
        </footer>
      </div>
    </div>
  );
}