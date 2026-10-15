import React from 'react';
import { SUPPORT_TIPS } from './supportTipsData';
import SupportTipCard from './SupportTipCard';

export default function SupportTipsSection() {
  return (
    <section id="quick-tips" aria-labelledby="quick-tips-heading" className="scroll-mt-28">
      <div className="mb-5">
        <p className="nv-eyebrow nv-eyebrow--primary">Core Pillars</p>
        <h2 id="quick-tips-heading" className="font-heading text-2xl sm:text-3xl font-bold text-brand-text mt-1">
          Quick Tips: How to Best Support Survivors
        </h2>
        <p className="text-brand-muted-foreground mt-1">
          Three areas where managers and HR make the biggest difference.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {SUPPORT_TIPS.map((tip) => (
          <SupportTipCard key={tip.id} tip={tip} />
        ))}
      </div>
    </section>
  );
}