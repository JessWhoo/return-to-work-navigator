import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const STARTER_IDS = ['med_1', 'comm_3', 'prep_1'];

export default function ChecklistQuickStart({ allItems, completedItems, itemMarks, onToggleComplete, onSetMark, onShowFull }) {
  const starterItems = STARTER_IDS
    .map((id) => allItems.find((item) => item.id === id))
    .filter(Boolean);

  return (
    <Card className="nv-card--muted">
      <CardHeader className="pb-3">
        <p className="nv-eyebrow nv-eyebrow--primary">Start small</p>
        <CardTitle className="font-heading text-xl text-brand-text">
          Three suggested planning prompts
        </CardTitle>
        <p className="text-sm text-brand-muted-foreground">
          Pick one to start with today, or open the full checklist whenever you are ready.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {starterItems.map((item) => {
            const isChecked = completedItems.includes(item.id);
            const mark = itemMarks[item.id];
            return (
              <div
                key={item.id}
                className="rounded-brand border border-brand-border bg-brand-surface p-4 space-y-2.5"
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    id={`starter-${item.id}`}
                    checked={isChecked}
                    onCheckedChange={(checked) => onToggleComplete(item.id, Boolean(checked))}
                    className="mt-1"
                  />
                  <label
                    htmlFor={`starter-${item.id}`}
                    className={`flex-1 cursor-pointer text-sm ${
                      isChecked
                        ? 'line-through text-brand-muted-foreground'
                        : mark === 'not_relevant'
                          ? 'text-brand-muted-foreground italic'
                          : 'text-brand-text font-medium'
                    }`}
                  >
                    {item.text}
                  </label>
                  <span className="w-5 flex-shrink-0">
                    {isChecked && <CheckCircle2 className="h-5 w-5 text-brand-primary" />}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 pl-7">
                  <button
                    type="button"
                    onClick={() => onSetMark(item.id, mark === 'revisit_later' ? null : 'revisit_later')}
                    aria-pressed={mark === 'revisit_later'}
                    className={`rounded-pill border px-2.5 py-1 text-xs font-semibold transition-colors ${
                      mark === 'revisit_later'
                        ? 'border-brand-primary bg-brand-primary text-brand-on-primary'
                        : 'border-brand-border bg-brand-background text-brand-muted-foreground hover:bg-brand-muted'
                    }`}
                  >
                    Revisit later
                  </button>
                  <button
                    type="button"
                    onClick={() => onSetMark(item.id, mark === 'not_relevant' ? null : 'not_relevant')}
                    aria-pressed={mark === 'not_relevant'}
                    className={`rounded-pill border px-2.5 py-1 text-xs font-semibold transition-colors ${
                      mark === 'not_relevant'
                        ? 'border-brand-primary bg-brand-muted text-brand-text'
                        : 'border-brand-border bg-brand-background text-brand-muted-foreground hover:bg-brand-muted'
                    }`}
                  >
                    Not relevant
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <Button onClick={onShowFull} variant="outline">
            View the full checklist ({allItems.length} items)
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
          <span className="text-xs text-brand-muted-foreground">
            Progress is saved truthfully—nothing is pre-completed.
          </span>
        </div>
      </CardContent>
    </Card>
  );
}