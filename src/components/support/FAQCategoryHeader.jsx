import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { CardHeader } from '@/components/ui/card';

export default function FAQCategoryHeader({ category, expanded, onToggle, contentId }) {
  const Icon = category.icon;
  const Chevron = expanded ? ChevronDown : ChevronRight;
  return (
    <CardHeader className="p-0">
      <button type="button" onClick={onToggle} aria-expanded={expanded} aria-controls={contentId} className="flex min-h-11 w-full items-center justify-between gap-3 p-5 text-left text-brand-text hover:bg-brand-muted sm:p-6">
        <span className="flex min-w-0 items-center gap-3">
          <Chevron className="h-5 w-5 shrink-0 text-brand-primary" strokeWidth={1.75} aria-hidden="true" />
          <span className="shrink-0 rounded-pill bg-brand-muted p-2"><Icon className="h-5 w-5 text-brand-primary" strokeWidth={1.75} aria-hidden="true" /></span>
          <span className="font-heading text-lg font-bold sm:text-xl">{category.category}</span>
        </span>
        <span className="nv-chip shrink-0" aria-label={`${category.questions.length} questions`}>{category.questions.length}</span>
      </button>
    </CardHeader>
  );
}