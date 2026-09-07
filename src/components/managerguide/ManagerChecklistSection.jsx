import React, { useState, useEffect } from 'react';
import { Download, ClipboardCheck, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MANAGER_CHECKLIST } from './managerChecklistData';
import { generateManagerChecklistPdf } from './generateManagerChecklistPdf';

const STORAGE_KEY = 'managerRtwChecklistProgress';

function generateKeys() {
  return MANAGER_CHECKLIST.flatMap((section, sIdx) =>
    section.items.map((_, iIdx) => `${sIdx}-${iIdx}`)
  );
}

export default function ManagerChecklistSection() {
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

  const allKeys = generateKeys();
  const checkedCount = allKeys.filter((k) => checked[k]).length;
  const totalCount = allKeys.length;
  const percent = totalCount ? Math.round((checkedCount / totalCount) * 100) : 0;

  return (
    <section id="checklist" aria-labelledby="checklist-heading" className="scroll-mt-28 bg-white border-2 border-slate-300 rounded-3xl p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
        <div className="flex items-start gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-violet-600 to-emerald-600 shadow-md">
            <ClipboardCheck className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 id="checklist-heading" className="text-2xl font-extrabold text-slate-900">Return-to-Work Support Checklist</h2>
            <p className="text-slate-700 mt-1">Check off steps as you complete them — your progress saves automatically on this device.</p>
          </div>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Button onClick={generateManagerChecklistPdf} className="bg-violet-700 hover:bg-violet-800 text-white font-bold whitespace-nowrap">
            <Download className="h-4 w-4" /> Download PDF
          </Button>
          <Button onClick={reset} variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-100 font-bold whitespace-nowrap">
            Reset
          </Button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-sm font-bold text-slate-800">{checkedCount} of {totalCount} steps completed</span>
          <span className="text-sm font-extrabold text-violet-700">{percent}%</span>
        </div>
        <div className="h-3 bg-slate-200 rounded-full overflow-hidden" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
          <div
            className="h-full bg-gradient-to-r from-violet-600 to-emerald-600 rounded-full transition-all duration-300"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {MANAGER_CHECKLIST.map((section, sIdx) => {
          const sectionKeys = section.items.map((_, iIdx) => `${sIdx}-${iIdx}`);
          const sectionChecked = sectionKeys.filter((k) => checked[k]).length;
          const sectionPercent = sectionKeys.length ? Math.round((sectionChecked / sectionKeys.length) * 100) : 0;

          return (
            <div key={section.phase} className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-extrabold text-violet-800">{section.phase}</h3>
                <span className="text-xs font-bold text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded-full">
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
                        className="flex gap-2.5 text-left text-sm text-slate-800 leading-relaxed w-full py-1 rounded-md hover:bg-white transition-colors px-1"
                      >
                        <span
                          className={`flex-shrink-0 mt-0.5 h-5 w-5 rounded-md border-2 flex items-center justify-center transition-colors ${
                            isChecked
                              ? 'bg-emerald-600 border-emerald-600'
                              : 'bg-white border-slate-400'
                          }`}
                        >
                          {isChecked && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
                        </span>
                        <span className={isChecked ? 'line-through text-slate-500' : ''}>{item}</span>
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