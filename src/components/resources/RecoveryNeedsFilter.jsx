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
  { id: 'fatigue', label: 'Managing fatigue', icon: Battery, color: 'bg-brand-primary', match: ['fatigue', 'energy', 'pacing', 'energy management'] },
  { id: 'cognitive', label: 'Focus & chemo brain', icon: Brain, color: 'bg-brand-primary', match: ['chemo brain', 'cognitive', 'focus', 'cognitive changes'] },
  { id: 'emotional', label: 'Emotional support', icon: Heart, color: 'bg-brand-primary', match: ['mental health', 'anxiety', 'emotional', 'counseling', 'self-compassion'] },
  { id: 'stress', label: 'Stress & mindfulness', icon: Sparkles, color: 'bg-brand-primary', match: ['stress', 'stress reduction', 'meditation', 'mindfulness', 'breathwork', 'relaxation'] },
  { id: 'sleep', label: 'Sleep & rest', icon: Moon, color: 'bg-brand-primary', match: ['sleep', 'rest', 'hygiene'] },
  { id: 'rights', label: 'Workplace rights', icon: Shield, color: 'bg-brand-primary', match: ['workplace rights', 'ADA', 'FMLA', 'discrimination', 'legal', 'legal rights'] },
  { id: 'accommodations', label: 'Accommodations', icon: Briefcase, color: 'bg-brand-primary', match: ['accommodations', 'modifications', 'ergonomics', 'flexibility'] },
  { id: 'disclosure', label: 'Talking to employer', icon: MessageCircle, color: 'bg-brand-primary', match: ['disclosure', 'communication', 'HR', 'talking'] },
  { id: 'community', label: 'Peer support', icon: Users, color: 'bg-brand-primary', match: ['support groups', 'peer support', 'community', 'mentorship', 'one-on-one'] },
  { id: 'financial', label: 'Financial help', icon: DollarSign, color: 'bg-brand-primary', match: ['financial', 'financial aid', 'insurance', 'copayments', 'medication', 'benefits', 'SSDI', 'disability'] },
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
    <div className="nv-card nv-card--muted p-5">
      <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
        <div>
          <h3 className="text-base font-bold text-brand-text flex items-center gap-2"><Sparkles className="h-4 w-4 text-brand-primary" />Filter by recovery need</h3>
          <p className="text-xs text-brand-muted-foreground font-medium mt-1">Tap what you're working on. Combine tags to narrow results.</p>
        </div>
        {hasSelection && (
          <div className="flex items-center gap-2">
            <Badge>{resultCount} match{resultCount === 1 ? '' : 'es'}</Badge>
            <button onClick={onClear} className="nv-btn nv-btn--text nv-btn--sm"><X className="h-3.5 w-3.5" /> Clear</button>
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {RECOVERY_NEEDS.map((need) => {
          const Icon = need.icon;
          const isActive = selected?.includes(need.id);
          return (
            <button key={need.id} onClick={() => onToggle(need.id)} aria-pressed={isActive}
              className={`nv-btn nv-btn--sm !whitespace-normal ${isActive ? '' : 'nv-btn--outline'}`}>
              <Icon className="h-3.5 w-3.5" /> {need.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}