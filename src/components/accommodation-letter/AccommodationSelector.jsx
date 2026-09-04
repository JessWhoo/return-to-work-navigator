import React from 'react';
import { Check } from 'lucide-react';
import { accommodationOptions } from '@/components/accommodation-letter/accommodationOptions';

export default function AccommodationSelector({ selected, onToggle }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {accommodationOptions.map((option) => {
        const isSelected = selected.includes(option.id);
        return <button key={option.id} type="button" onClick={() => onToggle(option.id)} aria-pressed={isSelected} className={`min-h-24 rounded-xl border-2 p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${isSelected ? 'border-violet-500 bg-violet-50' : 'border-slate-200 bg-card hover:border-violet-300 hover:bg-slate-50'}`}>
          <span className="flex items-start gap-3"><span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${isSelected ? 'bg-violet-600 text-white' : 'border-2 border-slate-300'}`}>{isSelected && <Check className="h-3.5 w-3.5" />}</span><span><span className="block text-sm font-extrabold text-slate-900">{option.title}</span><span className="mt-1 block text-xs leading-5 text-slate-600">{option.detail}</span></span></span>
        </button>;
      })}
    </div>
  );
}