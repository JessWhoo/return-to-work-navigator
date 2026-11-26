import React from 'react';
import { Check } from 'lucide-react';

const STEPS = ['Choose accommodations', 'Your details', 'Your letter'];

export default function StepIndicator({ current, maxReachable = current, onSelectStep }) {
  return (
    <ol className="flex items-center gap-2 sm:gap-4" aria-label="Letter generator steps">
      {STEPS.map((label, i) => {
        const n = i + 1;
        const done = n < current;
        const active = n === current;
        const clickable = Boolean(onSelectStep) && n <= maxReachable && !active;

        const inner = (
          <>
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                done
                  ? 'bg-emerald-600 text-white'
                  : active
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-500/30'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {done ? <Check className="h-4 w-4" /> : n}
            </span>
            <span
              className={`hidden sm:block text-sm font-semibold truncate ${
                active ? 'text-slate-900' : 'text-slate-600'
              }`}
            >
              {label}
            </span>
          </>
        );

        return (
          <li key={label} className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            {clickable ? (
              <button
                type="button"
                onClick={() => onSelectStep(n)}
                className="flex items-center gap-2 sm:gap-3 min-w-0 text-left rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {inner}
              </button>
            ) : (
              <span
                aria-current={active ? 'step' : undefined}
                className="flex items-center gap-2 sm:gap-3 min-w-0"
              >
                {inner}
              </span>
            )}
            {n < STEPS.length && (
              <span className={`h-0.5 flex-1 rounded ${done ? 'bg-emerald-500' : 'bg-slate-200'}`} />
            )}
          </li>
        );
      })}
    </ol>
  );
}