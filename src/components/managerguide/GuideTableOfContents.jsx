import React from 'react';
import { ListChecks } from 'lucide-react';

export default function GuideTableOfContents({ sections }) {
  return (
    <nav aria-label="Guide sections" className="bg-white border-2 border-slate-300 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <ListChecks className="h-5 w-5 text-violet-700" />
        <h2 className="text-base font-extrabold text-slate-900">In this guide</h2>
      </div>
      <ol className="grid sm:grid-cols-2 gap-2 list-decimal pl-5">
        {sections.map((s) => (
          <li key={s.id}>
            <a href={`#${s.id}`} className="text-sm font-semibold text-violet-700 hover:text-violet-900 underline">
              {s.title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}