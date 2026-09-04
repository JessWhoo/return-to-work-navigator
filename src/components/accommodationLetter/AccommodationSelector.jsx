import React, { useState } from 'react';
import { Check, Plus, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ACCOMMODATION_CATEGORIES } from './accommodationOptions';

export default function AccommodationSelector({ selected, onToggle, onAddCustom, onRemoveCustom }) {
  const [custom, setCustom] = useState('');
  const isSelected = (id) => selected.some((s) => s.id === id);
  const customs = selected.filter((s) => s.custom);

  const addCustom = () => {
    if (!custom.trim()) return;
    onAddCustom(custom.trim());
    setCustom('');
  };

  return (
    <div className="space-y-8">
      {ACCOMMODATION_CATEGORIES.map((cat) => {
        const Icon = cat.icon;
        return (
          <section key={cat.id} className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-violet-100 text-violet-700"><Icon className="h-4 w-4" /></span>
              <h3 className="font-bold text-slate-900">{cat.name}</h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-2">
              {cat.options.map((opt) => {
                const on = isSelected(opt.id);
                return (
                  <button
                    key={opt.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => onToggle(opt)}
                    className={`flex items-start gap-3 text-left p-3 rounded-xl border-2 transition-all ${
                      on ? 'border-violet-500 bg-violet-50 shadow-sm' : 'border-slate-200 bg-white hover:border-violet-300'
                    }`}
                  >
                    <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 ${
                      on ? 'bg-violet-600 border-violet-600 text-white' : 'border-slate-300 bg-white'
                    }`}>
                      {on && <Check className="h-3.5 w-3.5" />}
                    </span>
                    <span className="text-sm font-medium text-slate-800 leading-snug">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </section>
        );
      })}

      <section className="space-y-3 border-t border-slate-200 pt-6">
        <h3 className="font-bold text-slate-900">Something else you need?</h3>
        <div className="flex gap-2">
          <Input
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustom())}
            placeholder="Describe the accommodation in your own words"
          />
          <Button type="button" variant="outline" onClick={addCustom} className="font-bold shrink-0">
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        </div>
        {customs.length > 0 && (
          <ul className="flex flex-wrap gap-2">
            {customs.map((c) => (
              <li key={c.id} className="flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-300 px-3 py-1 text-sm font-medium text-emerald-800">
                {c.label}
                <button type="button" onClick={() => onRemoveCustom(c.id)} aria-label={`Remove ${c.label}`} className="hover:text-emerald-950">
                  <X className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}