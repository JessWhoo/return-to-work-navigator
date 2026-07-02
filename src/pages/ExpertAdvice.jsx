import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Heart, MessageSquare, Sparkles, Search, BookOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { CATEGORIES, TIPS } from '@/components/expertadvice/expertAdviceData';
import TipCard from '@/components/expertadvice/TipCard';
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
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-sky-600 via-violet-600 to-rose-500 rounded-2xl p-6 text-white shadow-xl"
      >
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-5 w-5" />
          <span className="text-sm font-bold uppercase tracking-wide">Expert Advice</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">
          Professional Tips for Your Return
        </h1>
        <p className="text-white/90 max-w-2xl">
          Practical, evidence-based guidance from oncology social workers, employment attorneys,
          and clinical psychologists — for the workplace, the emotional journey, and every conversation in between.
        </p>
      </motion.div>

      {/* Category cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {CATEGORIES.map(cat => {
          const Icon = CATEGORY_ICONS[cat.id] || BookOpen;
          const active = selected === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelected(active ? 'all' : cat.id)}
              className={`text-left rounded-2xl border-2 p-5 transition-all bg-white ${
                active ? `${cat.border} shadow-lg scale-[1.02]` : 'border-slate-200 hover:border-slate-400'
              }`}
            >
              <div className={`inline-flex p-2.5 rounded-xl bg-gradient-to-br ${cat.color} mb-3`}>
                <Icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-extrabold text-slate-900 leading-tight">{cat.label}</h3>
              <p className="text-xs text-slate-700 mt-1 leading-snug">{cat.tagline}</p>
              <p className="text-xs font-bold text-slate-600 mt-3">{countFor(cat.id)} tips</p>
            </button>
          );
        })}
      </div>

      {/* Filter row */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input
            placeholder="Search tips, topics, or experts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelected('all')}
            className={`px-3 py-2 rounded-full text-sm font-semibold border-2 transition-all ${
              selected === 'all'
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-800 border-slate-300 hover:border-slate-500'
            }`}
          >
            All ({countFor('all')})
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelected(cat.id)}
              className={`px-3 py-2 rounded-full text-sm font-semibold border-2 transition-all ${
                selected === cat.id
                  ? `bg-gradient-to-r ${cat.color} text-white border-transparent`
                  : 'bg-white text-slate-800 border-slate-300 hover:border-slate-500'
              }`}
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
            <BookOpen className="h-12 w-12 mx-auto text-slate-400 mb-3" />
            <p className="text-lg font-bold text-slate-800">No tips match your search</p>
            <p className="text-sm text-slate-600 mt-1">Try a different keyword or category.</p>
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