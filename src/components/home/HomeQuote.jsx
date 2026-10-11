import React from 'react';
import { Quote } from 'lucide-react';

export default function HomeQuote() {
  return (
    <figure className="nv-card nv-home-quote relative overflow-hidden px-6 py-12 text-center sm:px-12 sm:py-16">
      <img src="https://media.base44.com/images/public/69406c752de234aafebf891d/368f33362_generated_image.png" alt="" width="1024" height="1024" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
      <div className="relative space-y-5"><Quote className="mx-auto h-8 w-8 text-brand-primary" strokeWidth={1.5} aria-hidden="true" /><blockquote className="mx-auto max-w-3xl font-heading text-2xl font-semibold text-brand-text sm:text-4xl">A Brighter Next Chapter Is Possible.</blockquote><span className="mx-auto block h-1 w-12 rounded-pill bg-accent" aria-hidden="true" /></div>
    </figure>
  );
}