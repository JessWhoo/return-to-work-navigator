import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function HomeFounderIntro() {
  return (
    <section aria-labelledby="home-founder-title" className="grid gap-6 lg:grid-cols-12 lg:items-center lg:gap-10">
      <img
        src="/images/founder-photo.jpg"
        alt="Jess Whorton, founder of Return to Work Navigator"
        width="144"
        height="144"
        loading="lazy"
        decoding="async"
        className="aspect-[4/3] w-full max-w-sm rounded-brand border border-brand-border object-cover lg:col-span-4 lg:aspect-[4/5] lg:max-w-none"
      />
      <div className="space-y-3 lg:col-span-8">
        <p className="nv-eyebrow nv-eyebrow--primary">About</p>
        <h2 id="home-founder-title" className="font-heading text-xl font-bold text-brand-text sm:text-2xl">
          Built by someone who understands both sides of the conversation.
        </h2>
        <p className="max-w-xl text-sm leading-relaxed text-brand-text sm:text-base">
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
    </section>
  );
}