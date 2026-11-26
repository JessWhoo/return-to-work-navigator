import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HomeSamplePreview() {
  return (
    <section aria-labelledby="home-sample-title" className="nv-card p-5 sm:p-8 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="nv-eyebrow nv-eyebrow--primary">Example tool output</p>
          <h2 id="home-sample-title" className="mt-1 font-heading text-xl font-bold text-brand-text sm:text-2xl">
            See what an accommodation draft looks like
          </h2>
        </div>
        <span className="nv-chip nv-chip--muted">Clearly labeled example</span>
      </div>

      <div className="rounded-brand border border-brand-border bg-brand-background p-4 sm:p-5 space-y-2.5 text-sm text-brand-text">
        <p className="font-semibold text-brand-primary flex items-center gap-2">
          <FileText className="h-4 w-4 shrink-0" aria-hidden="true" />
          Subject: Request for Workplace Accommodation Discussion
        </p>
        <p className="leading-relaxed">
          “Hi [Manager/HR Name], I am preparing for my transition back to work and would like to request
          an interactive discussion about temporary workplace accommodations—specifically a gradual
          three-day schedule for the first four weeks and brief rest breaks as needed. These adjustments
          will help me meet my core responsibilities reliably while managing recovery.”
        </p>
      </div>

      <div className="grid gap-4 text-sm sm:grid-cols-2">
        <div className="rounded-brand border border-brand-border bg-brand-surface p-4">
          <p className="font-semibold text-brand-text mb-1">What the tool helps you prepare</p>
          <p className="text-brand-muted-foreground">
            Work-focused phrasing, clear scheduling options, and structured talking points you can tailor without sharing medical details you prefer to keep private.
          </p>
        </div>
        <div className="rounded-brand border border-brand-border bg-brand-surface p-4">
          <p className="font-semibold text-brand-text mb-1">What still requires review</p>
          <p className="text-brand-muted-foreground">
            Your employer’s specific policies, any medical documentation or work-restriction notes from your healthcare team, and advice from a qualified legal professional if needed.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button asChild variant="outline">
          <Link to="/AccommodationLetterGenerator">
            Try the Accommodation Letter Generator
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Button>
        <Link
          to="/EmployerEmailGenerator"
          className="text-sm font-semibold text-brand-primary underline underline-offset-4 hover:text-brand-text"
        >
          Or preview employer email scripts
        </Link>
      </div>
    </section>
  );
}