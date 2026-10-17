import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { ICON_MAP } from './iconMap';

export default function SupportTipCard({ tip }) {
  const Icon = typeof tip.icon === 'string' ? (ICON_MAP[tip.icon] || CheckCircle2) : tip.icon;
  return (
    <article className="nv-card p-6 flex flex-col">
      <div className="bg-brand-muted text-brand-primary h-11 w-11 rounded-pill flex items-center justify-center mb-4">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="font-heading text-lg font-bold text-brand-text mb-2">{tip.title}</h3>
      <p className="text-sm text-brand-muted-foreground leading-relaxed mb-4">{tip.intro}</p>
      <ul className="space-y-2.5 text-sm">
        {tip.tips.map((t) => (
          <li key={t} className="flex gap-2 text-brand-text leading-relaxed">
            <CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-0.5 text-brand-primary" />
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}