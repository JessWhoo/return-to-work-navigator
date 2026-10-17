import React, { useState, useEffect } from 'react';
import { Download, ClipboardCheck, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { generateManagerChecklistPdf } from './generateManagerChecklistPdf';

const STORAGE_KEY = 'managerRtwChecklistProgress';

export default function ManagerChecklistSection({ checklist }) {
  const checklistData = checklist || [];
  const [checked, setChecked] = useState({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setChecked(JSON.parse(saved));
    } catch {}
  }, []);

  const toggle = (key) => {
    setChecked((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const reset = () => {
    setChecked({});
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  };

  const allKeys = checklistData.flatMap((section, sIdx) =>
    section.items.map((_, iIdx) => `${sIdx}-${iIdx}`)
  );
  const checkedCount = allKeys.filter((k) => checked[k]).length;
  const totalCount = allKeys.length;
  const percent = totalCount ? Math.round((checkedCount / totalCount) * 100) : 0;

  return (
    <section id="checklist" aria-labelledby="checklist-heading" className="scroll-mt-28 nv-card p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
        <div className="flex items-start gap-3">
          <div className="p-3 rounded-pill bg-brand-muted text-brand-primary shrink-0">
            <ClipboardCheck className="h-6 w-6" />
          </div>
          <div>
            <h2 id="checklist-heading" className="font-heading text-2xl font-bold text-brand-text">Return-to-Work Support Checklist</h2>
            <p className="text-brand-muted-foreground mt-1 text-sm sm:text-base">Check off steps as you complete them — your progress saves automatically on this device.</p>
          </div>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Button onClick={() => generateManagerChecklistPdf(checklistData)} className="whitespace-nowrap">
            <Download className="h-4 w-4" /> Download PDF
          </Button>
          <Button onClick={reset} variant="outline" className="whitespace-nowrap">
            Reset
          </Button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-sm font-bold text-brand-text">{checkedCount} of {totalCount} steps completed</span>
          <span className="text-sm font-extrabold text-brand-primary">{percent}%</span>
        </div>
        <div className="h-3 bg-brand-muted rounded-full overflow-hidden" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
          <div
            className="h-full bg-brand-primary rounded-full transition-all duration-300"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {checklistData.map((section, sIdx) => {
          const sectionKeys = section.items.map((_, iIdx) => `${sIdx}-${iIdx}`);
          const sectionChecked = sectionKeys.filter((k) => checked[k]).length;

          return (
            <div key={section.phase} className="rounded-brand border border-brand-border bg-brand-background p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-heading text-base font-bold text-brand-text">{section.phase}</h3>
                <span className="nv-chip !px-2.5 !py-0.5">
                  {sectionChecked}/{section.items.length}
                </span>
              </div>
              <ul className="space-y-1.5">
                {section.items.map((item, iIdx) => {
                  const key = `${sIdx}-${iIdx}`;
                  const isChecked = !!checked[key];
                  return (
                    <li key={key}>
                      <button
                        type="button"
                        onClick={() => toggle(key)}
                        aria-pressed={isChecked}
                        className="flex gap-2.5 text-left text-sm text-brand-text leading-relaxed w-full py-1.5 rounded-brand hover:bg-brand-surface transition-colors px-1.5"
                      >
                        <span
                          className={`flex-shrink-0 mt-0.5 h-5 w-5 rounded-md border flex items-center justify-center transition-colors ${
                            isChecked
                              ? 'bg-brand-primary border-brand-primary'
                              : 'bg-brand-surface border-brand-border'
                          }`}
                        >
                          {isChecked && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
                        </span>
                        <span className={isChecked ? 'line-through text-brand-muted-foreground' : ''}>{item}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}