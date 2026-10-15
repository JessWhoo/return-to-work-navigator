import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

/**
 * One community guideline, rendered as a full-text editorial block
 * (heading, plain-language intro, concrete expectations) so the whole page
 * reads without interaction and stays scannable.
 */
export default function GuidelineSection({ id, number, icon: Icon, title, intro, bullets = [] }) {
  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="flex items-start gap-4">
          <span
            aria-hidden="true"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-muted text-brand-primary"
          >
            {Icon ? <Icon className="h-5 w-5" /> : number}
          </span>
          <div className="min-w-0 space-y-2">
            <h3 id={id} className="font-heading text-xl font-bold text-brand-text scroll-mt-28">
              {title}
            </h3>
            <p className="text-sm sm:text-base text-brand-muted-foreground">{intro}</p>
          </div>
        </div>
        <ul className="space-y-2 pl-1">
          {bullets.map((item, idx) => (
            <li key={idx} className="flex gap-3 text-sm sm:text-base text-brand-text">
              <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-primary" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}