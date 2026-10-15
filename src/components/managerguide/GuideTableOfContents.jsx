import React from 'react';
import { ListChecks } from 'lucide-react';

export default function GuideTableOfContents({ sections }) {
  return (
    <nav aria-label="Guide sections" className="nv-card p-6">
      <div className="flex items-center gap-2 mb-3">
        <ListChecks className="h-5 w-5 text-brand-primary" />
        <h2 className="font-heading text-base font-bold text-brand-text">In this guide</h2>
      </div>
      <ol className="grid sm:grid-cols-2 gap-2 list-decimal pl-5 text-brand-muted-foreground">
        {sections.map((s) => (
          <li key={s.id}>
            <a href={`#${s.id}`} className="text-sm font-semibold text-brand-primary hover:text-brand-text underline">
              {s.title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}