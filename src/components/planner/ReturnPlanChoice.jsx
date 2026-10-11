import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import BrandChoice from '@/components/brand/BrandChoice';

export default function ReturnPlanChoice({ template, selected, onClick }) {
  return (
    <BrandChoice selected={selected} onClick={onClick} className="w-full !px-6 !py-6">
      <span className="block space-y-4">
        <span className="flex items-start justify-between gap-3">
          <span className="min-w-0">
            <span className="block font-heading font-bold">{template.name}</span>
            <span className={`mt-1 block text-sm ${selected ? 'text-primary-foreground' : 'text-muted-foreground'}`}>{template.description}</span>
          </span>
          {selected && <CheckCircle2 className="h-6 w-6 shrink-0" strokeWidth={1.75} aria-hidden="true" />}
        </span>
        <span className="block space-y-2">
          {template.phases.map((phase, index) => (
            <span key={index} className="flex flex-wrap items-center gap-2 text-sm">
              <Badge variant="secondary" className="rounded-pill">Week {phase.week}</Badge>
              <span>{phase.hours}hrs/week, {phase.remote} remote</span>
            </span>
          ))}
        </span>
      </span>
    </BrandChoice>
  );
}