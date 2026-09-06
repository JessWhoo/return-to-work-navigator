import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const COLORS = {
  violet: { ring: 'border-violet-300', badge: 'bg-violet-600', icon: 'text-violet-700' },
  sky: { ring: 'border-sky-300', badge: 'bg-sky-600', icon: 'text-sky-700' },
  emerald: { ring: 'border-emerald-300', badge: 'bg-emerald-600', icon: 'text-emerald-700' },
};

export default function SupportTipCard({ tip }) {
  const Icon = tip.icon;
  const c = COLORS[tip.color] || COLORS.violet;
  return (
    <article className={`bg-white border-2 ${c.ring} rounded-2xl p-6 shadow-sm flex flex-col`}>
      <div className={`${c.badge} text-white h-12 w-12 rounded-xl flex items-center justify-center mb-4 shadow-md`}>
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-xl font-extrabold text-slate-900 mb-2">{tip.title}</h3>
      <p className="text-slate-700 leading-relaxed mb-4">{tip.intro}</p>
      <ul className="space-y-2.5">
        {tip.tips.map((t) => (
          <li key={t} className="flex gap-2 text-slate-800 leading-relaxed">
            <CheckCircle2 className={`h-5 w-5 flex-shrink-0 mt-0.5 ${c.icon}`} />
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}