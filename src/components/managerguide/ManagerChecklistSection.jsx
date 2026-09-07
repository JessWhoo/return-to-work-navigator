import React from 'react';
import { Download, ClipboardCheck, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MANAGER_CHECKLIST } from './managerChecklistData';
import { generateManagerChecklistPdf } from './generateManagerChecklistPdf';

export default function ManagerChecklistSection() {
  return (
    <section id="checklist" aria-labelledby="checklist-heading" className="scroll-mt-28 bg-white border-2 border-slate-300 rounded-3xl p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div className="flex items-start gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-violet-600 to-emerald-600 shadow-md">
            <ClipboardCheck className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 id="checklist-heading" className="text-2xl font-extrabold text-slate-900">Return-to-Work Support Checklist</h2>
            <p className="text-slate-700 mt-1">Step-by-step actions from the weeks before their return through the first 90 days and beyond.</p>
          </div>
        </div>
        <Button onClick={generateManagerChecklistPdf} className="bg-violet-700 hover:bg-violet-800 text-white font-bold whitespace-nowrap">
          <Download className="h-4 w-4" /> Download PDF checklist
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {MANAGER_CHECKLIST.map((section) => (
          <div key={section.phase} className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-5">
            <h3 className="text-lg font-extrabold text-violet-800 mb-3">{section.phase}</h3>
            <ul className="space-y-2">
              {section.items.map((item) => (
                <li key={item} className="flex gap-2 text-sm text-slate-800 leading-relaxed">
                  <Square className="h-4 w-4 flex-shrink-0 mt-1 text-slate-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}