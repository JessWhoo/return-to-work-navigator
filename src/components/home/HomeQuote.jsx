import React from 'react';
import { Quote } from 'lucide-react';

export default function HomeQuote() {
  return (
    <figure className="py-8 sm:py-10">
      <Quote className="h-6 w-6 text-brand-primary" strokeWidth={1.5} aria-hidden="true" />
      <blockquote className="mt-3 max-w-3xl font-heading text-xl font-semibold leading-snug text-brand-text sm:text-2xl">
        You do not have to navigate work after cancer alone. You deserve support that respects where you are now.
      </blockquote>
    </figure>
  );
}