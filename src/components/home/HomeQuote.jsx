import React from 'react';
import { Quote } from 'lucide-react';

export default function HomeQuote() {
  return (
    <figure className="border-y border-brand-border py-12 sm:py-16">
      <Quote className="h-7 w-7 text-brand-primary" strokeWidth={1.5} aria-hidden="true" />
      <blockquote className="mt-4 max-w-3xl font-heading text-2xl font-semibold leading-snug text-brand-text sm:text-3xl">
        You do not have to navigate work after cancer alone. You deserve support that respects where you are now.
      </blockquote>
    </figure>
  );
}