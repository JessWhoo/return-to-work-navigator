import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function HomeFounderIntro() {
  return (
    <section
      aria-labelledby="home-founder-title"
      className="nv-card nv-card--muted p-5 sm:p-8"
    >
      <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:gap-7">
        <img
          src="/images/founder-photo.jpg"
          alt="Jess Whorton, founder of Return to Work Navigator"
          width="144"
          height="144"
          loading="lazy"
          decoding="async"
          className="h-28 w-28 flex-shrink-0 rounded-brand-lg border-2 border-brand-accent object-cover shadow-brand-sm sm:h-36 sm:w-36"
        />
        <div className="space-y-3 text-center sm:text-left">
          <p className="nv-eyebrow nv-eyebrow--primary">Who built this</p>
          <h2 id="home-founder-title" className="font-heading text-xl font-bold text-brand-text sm:text-2xl">
            Built by someone who understands both sides of the conversation.
          </h2>
          <p className="text-sm leading-relaxed text-brand-text sm:text-base">
            Jess Whorton created Return to Work Navigator after her own experience with breast cancer.
            With more than 15 years in HR, she brings a practical understanding of workplace conversations
            and the support people navigating cancer may need.
          </p>
          <p>
            <Link
              to="/About"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-primary underline underline-offset-4 hover:text-brand-text"
            >
              Meet Jess and read why she built the Navigator
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}