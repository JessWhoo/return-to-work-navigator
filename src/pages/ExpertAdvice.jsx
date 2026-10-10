import React, { useState, useMemo } from 'react';
import { Briefcase, Heart, MessageSquare, Search, BookOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { CATEGORIES, TIPS } from '@/components/expertadvice/expertAdviceData';
import TipCard from '@/components/expertadvice/TipCard';
import PageHeader from '@/components/brand/PageHeader';
import useSEO from '@/hooks/useSEO';

const CATEGORY_ICONS = {
  workplace_adjustments: Briefcase,
  emotional_readiness: Heart,
  career_conversations: MessageSquare,
};

export default function ExpertAdvice() {
  useSEO({
    title: 'Expert Advice',
    description: 'Professional tips from oncology social workers, employment attorneys, and psychologists on workplace adjustments, emotional readiness, and career conversations after treatment.',
    path: '/ExpertAdvice',
  });

  const [selected, setSelected] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let items = TIPS;
    if (selected !== 'all') items = items.filter(t => t.category === selected);
    if (search.trim()) {
      const s = search.toLowerCase();
      items = items.filter(t =>
        t.title.toLowerCase().includes(s) ||
        t.summary.toLowerCase().includes(s) ||
        t.body.toLowerCase().includes(s) ||
        t.expert.toLowerCase().includes(s)
      );
    }
    return items;
  }, [selected, search]);

  const countFor = (id) =>
    id === 'all' ? TIPS.length : TIPS.filter(t => t.category === id).length;

  const categoryFor = (tip) => CATEGORIES.find(c => c.id === tip.category) || CATEGORIES[0];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <PageHeader
        eyebrow="Expert advice"
        title="Professional Tips for Your Return"
        subtitle="Practical, evidence-based guidance from oncology social workers, employment attorneys, and clinical psychologists — for the workplace, the emotional journey, and every conversation in between."
      />

      {/* Category cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {CATEGORIES.map(cat => {
          const Icon = CATEGORY_ICONS[cat.id] || BookOpen;
          const active = selected === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelected(active ? 'all' : cat.id)}
              className="h-full text-left"
              aria-pressed={active}
            >
              <Card className={`h-full ${active ? 'nv-card--muted' : ''}`}>
                <CardContent className="p-5">
                  <span className="inline-flex rounded-pill bg-brand-muted p-2.5 text-brand-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-3 font-heading text-base font-bold leading-tight text-brand-text">{cat.label}</h3>
                  <p className="mt-1 text-xs leading-snug text-brand-muted-foreground">{cat.tagline}</p>
                  <p className="mt-3 text-xs font-semibold text-brand-primary">{countFor(cat.id)} tips</p>
                </CardContent>
              </Card>
            </button>
          );
        })}
      </div>

      {/* Filter row */}
      <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-muted-foreground" />
          <Input
            placeholder="Search tips, topics, or experts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="nv-input pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelected('all')}
            className={`nv-btn nv-btn--sm ${selected === 'all' ? '' : 'nv-btn--outline'}`}
          >
            All ({countFor('all')})
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelected(cat.id)}
              className={`nv-btn nv-btn--sm ${selected === cat.id ? 'nv-btn--secondary' : 'nv-btn--outline'}`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tips list */}
      {filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <BookOpen className="mx-auto mb-3 h-12 w-12 text-brand-muted-foreground" />
            <p className="text-lg font-bold text-brand-text">No tips match your search</p>
            <p className="mt-1 text-sm text-brand-muted-foreground">Try a different keyword or category.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map(tip => (
            <TipCard key={tip.id} tip={tip} category={categoryFor(tip)} />
          ))}
        </div>
      )}
    </div>
  );
}