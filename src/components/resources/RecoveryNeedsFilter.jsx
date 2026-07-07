import React from 'react';
import { Badge } from '@/components/ui/badge';
import {
  Battery, Brain, Heart, Moon, Users, Shield, Briefcase, MessageCircle,
  DollarSign, Sparkles, X
} from 'lucide-react';

// Curated recovery-need categories. Each need maps to one or more topic/keyword
// matchers that already exist on resource items — so filtering works without
// touching the resource data.
export const RECOVERY_NEEDS = [
  {
    id: 'fatigue',
    label: 'Managing fatigue',
    icon: Battery,
    color: 'from-amber-500 to-orange-600',
    match: ['fatigue', 'energy', 'pacing', 'energy management'],
  },
  {
    id: 'cognitive',
    label: 'Focus & chemo brain',
    icon: Brain,
    color: 'from-violet-500 to-purple-600',
    match: ['chemo brain', 'cognitive', 'focus', 'cognitive changes'],
  },
  {
    id: 'emotional',
    label: 'Emotional support',
    icon: Heart,
    color: 'from-rose-500 to-pink-600',
    match: ['mental health', 'anxiety', 'emotional', 'counseling', 'self-compassion'],
  },
  {
    id: 'stress',
    label: 'Stress & mindfulness',
    icon: Sparkles,
    color: 'from-teal-500 to-emerald-600',
    match: ['stress', 'stress reduction', 'meditation', 'mindfulness', 'breathwork', 'relaxation'],
  },
  {
    id: 'sleep',
    label: 'Sleep & rest',
    icon: Moon,
    color: 'from-indigo-500 to-blue-600',
    match: ['sleep', 'rest', 'hygiene'],
  },
  {
    id: 'rights',
    label: 'Workplace rights',
    icon: Shield,
    color: 'from-sky-500 to-blue-600',
    match: ['workplace rights', 'ADA', 'FMLA', 'discrimination', 'legal', 'legal rights'],
  },
  {
    id: 'accommodations',
    label: 'Accommodations',
    icon: Briefcase,
    color: 'from-cyan-500 to-teal-600',
    match: ['accommodations', 'modifications', 'ergonomics', 'flexibility'],
  },
  {
    id: 'disclosure',
    label: 'Talking to employer',
    icon: MessageCircle,
    color: 'from-purple-500 to-fuchsia-600',
    match: ['disclosure', 'communication', 'HR', 'talking'],
  },
  {
    id: 'community',
    label: 'Peer support',
    icon: Users,
    color: 'from-emerald-500 to-teal-600',
    match: ['support groups', 'peer support', 'community', 'mentorship', 'one-on-one'],
  },
  {
    id: 'financial',
    label: 'Financial help',
    icon: DollarSign,
    color: 'from-green-500 to-emerald-600',
    match: ['financial', 'financial aid', 'insurance', 'copayments', 'medication', 'benefits', 'SSDI', 'disability'],
  },
];

/**
 * Given a resource item, returns true if it matches any of the given need ids.
 */
export function resourceMatchesNeeds(item, needIds, extraTags = []) {
  if (!needIds || needIds.length === 0) return true;
  const haystack = [
    item.name,
    item.description,
    item.org,
    ...(item.topics || []),
    ...extraTags,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return needIds.some((id) => {
    const need = RECOVERY_NEEDS.find((n) => n.id === id);
    if (!need) return false;
    return need.match.some((kw) => haystack.includes(kw.toLowerCase()));
  });
}

export default function RecoveryNeedsFilter({ selected, onToggle, onClear, resultCount }) {
  const hasSelection = selected && selected.length > 0;

  return (
    <div className="rounded-2xl border-2 border-violet-200 bg-gradient-to-br from-violet-50 via-white to-emerald-50 p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
        <div>
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-violet-600" />
            Filter by recovery need
          </h3>
          <p className="text-xs text-slate-700 font-medium mt-1">
            Tap what you're working on. Combine tags to narrow results.
          </p>
        </div>
        {hasSelection && (
          <div className="flex items-center gap-2">
            <Badge className="bg-violet-600 text-white font-bold">
              {resultCount} match{resultCount === 1 ? '' : 'es'}
            </Badge>
            <button
              onClick={onClear}
              className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-violet-700 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
              Clear
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {RECOVERY_NEEDS.map((need) => {
          const Icon = need.icon;
          const isActive = selected?.includes(need.id);
          return (
            <button
              key={need.id}
              onClick={() => onToggle(need.id)}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold border-2 transition-all ${
                isActive
                  ? `bg-gradient-to-r ${need.color} text-white border-transparent shadow-md scale-105`
                  : 'bg-white text-slate-800 border-slate-300 hover:border-violet-400 hover:shadow-sm'
              }`}
              aria-pressed={isActive}
            >
              <Icon className="h-3.5 w-3.5" />
              {need.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}