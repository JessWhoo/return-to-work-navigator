import React from 'react';
import { Scale, ShieldCheck, CalendarDays, Lock, AlertTriangle } from 'lucide-react';

const OBLIGATIONS = [
  {
    icon: CalendarDays,
    title: 'FMLA — protected leave',
    points: [
      'Up to 12 weeks of unpaid, job-protected leave per year for eligible employees.',
      'Health insurance must continue on the same terms during leave.',
      'They return to the same or an equivalent job — same pay, benefits, and status.',
      'Leave can be taken intermittently for treatment and appointments.',
    ],
  },
  {
    icon: ShieldCheck,
    title: 'ADA — reasonable accommodations',
    points: [
      'Cancer is generally treated as a disability, including after treatment ends.',
      'You must engage in an interactive process to find workable accommodations.',
      'Common ones: flexible hours, remote work, reduced schedule, extra breaks, modified duties.',
      'You may only refuse if it causes genuine undue hardship — document your reasoning.',
    ],
  },
  {
    icon: Lock,
    title: 'Privacy & confidentiality',
    points: [
      'Medical information stays confidential and separate from personnel files.',
      'Share only what the employee authorized, only with those who need to know.',
      'Don’t ask for details beyond what’s needed to support an accommodation.',
    ],
  },
  {
    icon: AlertTriangle,
    title: 'Do not retaliate or discriminate',
    points: [
      'No demotion, exclusion, or discipline tied to leave, illness, or accommodation requests.',
      'Never treat treatment-related absences as a performance problem.',
      'State and local laws may grant additional protections — check with HR or counsel.',
    ],
  },
];

export default function LegalObligationsCard() {
  return (
    <div className="bg-slate-50 border-2 border-violet-300 rounded-2xl p-5 sm:p-6 mb-6">
      <div className="flex items-start gap-3 mb-4">
        <div className="p-2.5 rounded-xl bg-violet-700 shadow-md">
          <Scale className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-extrabold text-slate-900">Your Legal Responsibilities at a Glance</h3>
          <p className="text-sm text-slate-700 mt-0.5">
            The core obligations most managers and HR teams need to get right.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {OBLIGATIONS.map(({ icon: Icon, title, points }) => (
          <div key={title} className="bg-white border-2 border-slate-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon className="h-5 w-5 text-violet-700" />
              <h4 className="font-extrabold text-slate-900">{title}</h4>
            </div>
            <ul className="space-y-1.5">
              {points.map((p) => (
                <li key={p} className="flex gap-2 text-sm text-slate-800 leading-relaxed">
                  <span aria-hidden="true" className="text-violet-600 font-bold">•</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="text-xs text-slate-700 italic mt-4">
        Educational summary only — not legal advice. Consult HR or legal counsel for your specific situation.
      </p>
    </div>
  );
}