import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GitCompare, X, Sparkles, Loader2, ExternalLink, Clock, Zap, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DIFFICULTY_CONFIG = {
  low: { label: 'Easy', color: 'bg-green-100 text-green-700 border-green-300', bar: 'bg-green-400', width: 'w-1/3' },
  medium: { label: 'Moderate', color: 'bg-amber-100 text-amber-700 border-amber-300', bar: 'bg-amber-400', width: 'w-2/3' },
  high: { label: 'Advanced', color: 'bg-red-100 text-red-700 border-red-300', bar: 'bg-red-400', width: 'w-full' },
};

const TIME_CONFIG = {
  quick: { label: '< 15 min', color: 'text-green-600' },
  short: { label: '15–60 min', color: 'text-amber-600' },
  long: { label: '1–4 hours', color: 'text-orange-600' },
  ongoing: { label: 'Ongoing', color: 'text-purple-600' },
};

function ComparisonCard({ resource, analysis, onRemove }) {
  const diff = DIFFICULTY_CONFIG[analysis?.difficulty] || DIFFICULTY_CONFIG.medium;
  const time = TIME_CONFIG[analysis?.time_requirement] || TIME_CONFIG.short;

  return (
    <Card className="flex flex-col min-w-0">
      <CardHeader className="pb-3 relative">
        <button onClick={onRemove} aria-label={`Remove ${resource.name} from comparison`} className="nv-btn nv-btn--text nv-btn--icon absolute top-2 right-2"><X className="h-4 w-4" /></button>
        <Badge className="w-fit bg-brand-sky text-brand-text mb-2 text-xs">{resource.type}</Badge>
        <CardTitle className="text-sm font-bold text-brand-text pr-10">{resource.name}</CardTitle>
        <p className="text-xs text-brand-primary font-semibold">{resource.org}</p>
      </CardHeader>
      <CardContent className="flex-1 space-y-4 pt-0">
        {!analysis ? <div className="flex items-center justify-center py-6"><Loader2 className="h-5 w-5 animate-spin text-brand-primary" /></div> : (
          <>
            <div><p className="nv-eyebrow mb-2">Key Benefits</p><ul className="space-y-1">{(analysis.benefits || []).map((b, i) => <li key={i} className="flex items-start gap-1.5 text-xs text-brand-text"><span className="text-brand-primary mt-0.5 shrink-0">✓</span>{b}</li>)}</ul></div>
            <div><p className="nv-eyebrow mb-2">Difficulty</p><div className="flex items-center gap-2"><div className="flex-1 bg-brand-muted rounded-full h-2"><div className={`h-2 rounded-full ${diff.bar} ${diff.width}`} /></div><Badge className={`text-xs border ${diff.color}`}>{diff.label}</Badge></div></div>
            <div><p className="nv-eyebrow mb-1">Time Required</p><div className="flex items-center gap-1.5"><Clock className={`h-3.5 w-3.5 ${time.color}`} /><span className={`text-xs font-semibold ${time.color}`}>{time.label}</span></div></div>
            <div><p className="nv-eyebrow mb-1">Best For</p><p className="text-xs text-brand-muted-foreground italic">{analysis.best_for}</p></div>
            <div className="pt-2 border-t border-brand-border"><p className="nv-eyebrow mb-1">Overall Score</p><div className="flex items-center gap-1">{[1, 2, 3, 4, 5].map(s => <Star key={s} className={`h-4 w-4 ${s <= (analysis.score || 0) ? 'text-brand-primary fill-brand-primary' : 'text-brand-border'}`} />)}<span className="text-xs text-brand-muted-foreground ml-1">{analysis.score}/5</span></div></div>
            <a href={resource.url} target="_blank" rel="noopener noreferrer" className="nv-btn nv-btn--outline nv-btn--sm !whitespace-normal mt-2"><ExternalLink className="h-3 w-3" />Open Resource</a>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default function ResourceComparisonTool({ progress, allResources }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState([]);
  const [analyses, setAnalyses] = useState({});
  const [loading, setLoading] = useState(false);
  const [winner, setWinner] = useState(null);

  // Flatten bookmarked resources
  const bookmarkedIds = progress?.bookmarked_resources || [];
  const bookmarkedResources = allResources.flatMap(cat =>
    cat.items.map((item, idx) => ({ ...item, id: `${cat.category}-${idx}`, category: cat.category }))
  ).filter(r => bookmarkedIds.includes(r.id));

  const toggleSelect = (resource) => {
    setSelected(prev => {
      if (prev.find(r => r.id === resource.id)) return prev.filter(r => r.id !== resource.id);
      if (prev.length >= 4) return prev;
      return [...prev, resource];
    });
    setAnalyses({});
    setWinner(null);
  };

  const removeFromComparison = (id) => {
    setSelected(prev => prev.filter(r => r.id !== id));
    setAnalyses(prev => { const n = { ...prev }; delete n[id]; return n; });
    setWinner(null);
  };

  const handleCompare = async () => {
    if (selected.length < 2) return;
    setLoading(true);
    setAnalyses({});
    setWinner(null);

    const resourceDescriptions = selected.map(r =>
      `Resource ID: ${r.id}\nName: ${r.name}\nOrg: ${r.org}\nType: ${r.type}\nDescription: ${r.description}\nTopics: ${(r.topics || []).join(', ')}`
    ).join('\n\n---\n\n');

    const result = (await base44.functions.invoke('aiGateway', {
      operation: 'compare_resources',
      data: { resourceDescriptionsText: resourceDescriptions, journeyStage: progress?.journey_stage || 'planning', count: selected.length },
    })).data.result;

    const newAnalyses = {};
    (result.analyses || []).forEach(a => { newAnalyses[a.resource_id] = a; });
    setAnalyses(newAnalyses);
    setWinner({ id: result.winner_id, reason: result.winner_reason });
    setLoading(false);

    base44.analytics.track({
      eventName: 'resource_comparison_generated',
      properties: {
        resource_count: selected.length,
        journey_stage: progress?.journey_stage || 'unknown'
      }
    });
  };

  if (bookmarkedResources.length < 2) return null;

  return (
    <Card className="nv-card--muted">
      <CardHeader className="pb-3">
        <button onClick={() => setOpen(o => !o)} aria-expanded={open} className="flex items-center justify-between gap-3 w-full text-left text-brand-text rounded-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
          <div className="flex items-center gap-3 min-w-0"><div className="p-2 rounded-lg bg-brand-primary shrink-0"><GitCompare className="h-5 w-5 text-primary-foreground" /></div><div><CardTitle className="text-brand-text text-lg">Compare Resources</CardTitle><p className="text-brand-muted-foreground text-sm mt-0.5">Select 2–4 saved resources to see a side-by-side breakdown</p></div></div>
          {open ? <ChevronUp className="h-5 w-5 text-brand-primary shrink-0" /> : <ChevronDown className="h-5 w-5 text-brand-primary shrink-0" />}
        </button>
      </CardHeader>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}>
            <CardContent className="pt-0 space-y-5">
              <div>
                <p className="text-brand-text text-sm mb-3 font-semibold">Your saved resources ({bookmarkedResources.length}) — select up to 4:</p>
                <div className="flex flex-wrap gap-2">
                  {bookmarkedResources.map(r => {
                    const isSelected = selected.find(s => s.id === r.id);
                    const isDisabled = !isSelected && selected.length >= 4;
                    return <button key={r.id} onClick={() => !isDisabled && toggleSelect(r)} disabled={isDisabled} aria-pressed={!!isSelected} className={`nv-btn nv-btn--sm !whitespace-normal ${isSelected ? '' : 'nv-btn--outline'}`}>{r.name.length > 35 ? r.name.slice(0, 35) + '…' : r.name}</button>;
                  })}
                </div>
              </div>
              <Button onClick={handleCompare} disabled={selected.length < 2 || loading} className="w-full sm:w-auto !whitespace-normal">{loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Analyzing…</> : <><Sparkles className="h-4 w-4 mr-2" />Compare {selected.length > 0 ? `${selected.length} Resources` : 'Selected'}</>}</Button>
              {winner && winner.id && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="nv-card flex items-start gap-3 p-4 bg-brand-cream">
                  <Zap className="h-5 w-5 text-brand-primary shrink-0 mt-0.5" /><div><p className="text-brand-text font-semibold text-sm">Top Recommendation</p><p className="text-brand-muted-foreground text-xs mt-1"><span className="font-semibold text-brand-text">{selected.find(r => r.id === winner.id)?.name}</span>{' — '}{winner.reason}</p></div>
                </motion.div>
              )}
              {selected.length > 0 && Object.keys(analyses).length > 0 && (
                <div className={`grid grid-cols-1 gap-4 ${selected.length === 2 ? 'sm:grid-cols-2' : selected.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2 lg:grid-cols-4'}`}>
                  {selected.map(r => <ComparisonCard key={r.id} resource={r} analysis={analyses[r.id]} onRemove={() => removeFromComparison(r.id)} />)}
                </div>
              )}
              {selected.length >= 2 && loading && (
                <div className={`grid grid-cols-1 gap-4 ${selected.length === 2 ? 'sm:grid-cols-2' : selected.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2 lg:grid-cols-4'}`}>
                  {selected.map(r => <ComparisonCard key={r.id} resource={r} analysis={null} onRemove={() => removeFromComparison(r.id)} />)}
                </div>
              )}
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}