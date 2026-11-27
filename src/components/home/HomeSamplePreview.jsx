import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HomeSamplePreview() {
  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:items-start lg:gap-10">
      <div className="space-y-5 lg:col-span-5">
        <h4 className="font-heading text-xl font-bold text-brand-text sm:text-2xl">
          See what an accommodation draft looks like
        </h4>

        <div className="space-y-1">
          <p className="text-sm font-semibold text-brand-text">What the tool helps you prepare</p>
          <p className="text-sm leading-relaxed text-brand-muted-foreground">
            Work-focused phrasing, clear scheduling options, and structured talking points you can tailor without sharing medical details you prefer to keep private.
          </p>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-semibold text-brand-text">What still requires review</p>
          <p className="text-sm leading-relaxed text-brand-muted-foreground">
            Your employer’s specific policies, any medical documentation or work-restriction notes from your healthcare team, and advice from a qualified legal professional if needed.
          </p>
        </div>

        <div className="flex flex-col items-start gap-3">
          <Button asChild variant="default">
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
      </div>

      <figure className="nv-card space-y-4 p-6 sm:p-8 lg:col-span-7">
        <figcaption className="flex flex-wrap items-center justify-between gap-3">
          <span className="flex items-center gap-2 text-sm font-semibold text-brand-primary">
            <FileText className="h-4 w-4 shrink-0" aria-hidden="true" />
            Subject: Request for Workplace Accommodation Discussion
          </span>
          <span className="nv-chip nv-chip--muted">Clearly labeled example</span>
        </figcaption>
        <blockquote className="border-t border-brand-border pt-4 font-heading text-base leading-relaxed text-brand-text sm:text-lg">
          “Hi [Manager/HR Name], I am preparing for my transition back to work and would like to request
          an interactive discussion about temporary workplace accommodations—specifically a gradual
          three-day schedule for the first four weeks and brief rest breaks as needed. These adjustments
          will help me meet my core responsibilities reliably while managing recovery.”
        </blockquote>
      </figure>
    </div>
  );
}