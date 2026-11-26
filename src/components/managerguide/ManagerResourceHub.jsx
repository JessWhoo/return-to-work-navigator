import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ManagerResourceHub() {
  return (
    <section
      aria-labelledby="manager-hub-heading"
      className="rounded-brand-lg border border-brand-border bg-brand-surface p-6 shadow-brand-sm sm:p-8"
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2.5">
            <span className="rounded-pill bg-brand-muted p-2 text-brand-primary">
              <Users className="h-5 w-5" aria-hidden="true" />
            </span>
            <p className="nv-eyebrow nv-eyebrow--primary">For Managers &amp; HR</p>
          </div>
          <h2 id="manager-hub-heading" className="font-heading text-xl font-bold text-brand-text sm:text-2xl">
            Supporting an employee through cancer?
          </h2>
          <p className="text-sm leading-relaxed text-brand-muted-foreground sm:text-base">
            Explore practical guidance for workplace conversations, accommodations, and return planning.
            Start by listening to the employee’s needs rather than assuming their experience.
          </p>
        </div>

        <Button asChild variant="outline" className="self-start sm:self-center shrink-0">
          <Link to="/ManagerGuide">
            View the manager and HR guide
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </section>
  );
}