import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ManagerResourceHub() {
  return (
    <section
      aria-labelledby="manager-hub-heading"
      className="rounded-brand-lg bg-brand-text px-6 py-8 text-brand-background sm:px-8 sm:py-10"
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-2xl space-y-2">
          <div className="flex items-center gap-2.5">
            <span className="rounded-pill bg-brand-primary p-2 text-brand-background">
              <Users className="h-5 w-5" aria-hidden="true" />
            </span>
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-background">For Managers &amp; HR</p>
          </div>
          <h2 id="manager-hub-heading" className="font-heading text-xl font-bold sm:text-2xl">
            Supporting an employee through cancer?
          </h2>
          <p className="text-sm leading-relaxed text-brand-background sm:text-base">
            Explore practical guidance for workplace conversations, accommodations, and return planning.
            Start by listening to the employee’s needs rather than assuming their experience.
          </p>
        </div>

        <Button asChild variant="default" className="shrink-0 self-start sm:self-center">
          <Link to="/ManagerGuide">
            View the manager and HR guide
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </section>
  );
}