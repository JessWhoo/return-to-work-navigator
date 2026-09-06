import React from 'react';
import { SUPPORT_TIPS } from './supportTipsData';
import SupportTipCard from './SupportTipCard';

export default function SupportTipsSection() {
  return (
    <section id="quick-tips" aria-labelledby="quick-tips-heading" className="scroll-mt-28">
      <div className="mb-5">
        <h2 id="quick-tips-heading" className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Quick Tips: How to Best Support Survivors
        </h2>
        <p className="text-slate-700 mt-1">
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