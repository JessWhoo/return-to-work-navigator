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
    <Card className="bg-white border-2 border-indigo-200 flex flex-col min-w-0">
      <CardHeader className="pb-3 relative">
        <button
          onClick={onRemove}
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
        <Badge className="w-fit bg-indigo-100 text-indigo-700 border border-indigo-300 mb-2 text-xs">
          {resource.type}
        </Badge>
        <CardTitle className="text-sm font-bold text-slate-800 leading-snug pr-6">
          {resource.name}
        </CardTitle>
        <p className="text-xs text-indigo-600 font-medium">{resource.org}</p>
      </CardHeader>

      <CardContent className="flex-1 space-y-4 pt-0">
        {!analysis ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-5 w-5 animate-spin text-indigo-400" />
          </div>
        ) : (
          <>
            {/* Benefits */}
            <div>
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Key Benefits</p>
              <ul className="space-y-1">
                {(analysis.benefits || []).map((b, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-xs text-slate-700">
                    <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            {/* Difficulty */}
            <div>
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Difficulty</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-slate-100 rounded-full h-2">
                  <div className={`h-2 rounded-full ${diff.bar} ${diff.width}`} />
                </div>
                <Badge className={`text-xs border ${diff.color}`}>{diff.label}</Badge>
              </div>
            </div>

            {/* Time Required */}
            <div>
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">Time Required</p>
              <div className="flex items-center gap-1.5">
                <Clock className={`h-3.5 w-3.5 ${time.color}`} />
                <span className={`text-xs font-medium ${time.color}`}>{time.label}</span>
              </div>
            </div>

            {/* Best For */}
            <div>
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">Best For</p>
              <p className="text-xs text-slate-600 italic">{analysis.best_for}</p>
            </div>

            {/* Overall Score */}
            <div className="pt-2 border-t border-slate-100">
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">Overall Score</p>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star
                    key={s}
                    className={`h-4 w-4 ${s <= (analysis.score || 0) ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}`}
                  />
                ))}
                <span className="text-xs text-slate-500 ml-1">{analysis.score}/5</span>
              </div>
            </div>

            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 font-medium mt-2"
            >
              <ExternalLink className="h-3 w-3" />
              Open Resource
            </a>
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

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are an expert career coach helping cancer survivors return to work. Analyze these ${selected.length} resources and provide a structured comparison.

Resources:
${resourceDescriptions}

User Journey Stage: ${progress?.journey_stage || 'planning'}

For EACH resource, provide:
- benefits: array of 3 short specific benefits (each under 10 words)
- difficulty: "low", "medium", or "high" (how hard it is to use/apply this resource)
- time_requirement: "quick" (<15min), "short" (15-60min), "long" (1-4 hours), or "ongoing"
- best_for: one sentence on who benefits most from this resource
- score: 1-5 overall recommendation score for this user's journey stage

Also identify the single best overall recommendation (winner_id) with a short reason (winner_reason).

Respond ONLY with valid JSON.`,
      response_json_schema: {
        type: 'object',
        properties: {
          analyses: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                resource_id: { type: 'string' },
                benefits: { type: 'array', items: { type: 'string' } },
                difficulty: { type: 'string' },
                time_requirement: { type: 'string' },
                best_for: { type: 'string' },
                score: { type: 'number' }
              }
            }
          },
          winner_id: { type: 'string' },
          winner_reason: { type: 'string' }
        }
      }
    });

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
    <Card className="bg-slate-800/90 backdrop-blur-sm border-2 border-indigo-500 shadow-lg">
      <CardHeader className="pb-3">
        <button
          onClick={() => setOpen(o => !o)}
          className="flex items-center justify-between w-full text-left"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-600">
              <GitCompare className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-white text-lg">Compare Resources</CardTitle>
              <p className="text-indigo-300 text-sm mt-0.5">Select 2–4 saved resources to see a side-by-side breakdown</p>
            </div>
          </div>
          {open ? <ChevronUp className="h-5 w-5 text-indigo-300" /> : <ChevronDown className="h-5 w-5 text-indigo-300" />}
        </button>
      </CardHeader>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <CardContent className="pt-0 space-y-5">
              {/* Resource Selector */}
              <div>
                <p className="text-slate-300 text-sm mb-3 font-medium">
                  Your saved resources ({bookmarkedResources.length}) — select up to 4:
                </p>
                <div className="flex flex-wrap gap-2">
                  {bookmarkedResources.map(r => {
                    const isSelected = selected.find(s => s.id === r.id);
                    const isDisabled = !isSelected && selected.length >= 4;
                    return (
                      <button
                        key={r.id}
                        onClick={() => !isDisabled && toggleSelect(r)}
                        disabled={isDisabled}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                          isSelected
                            ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-900/50'
                            : isDisabled
                            ? 'bg-slate-700/30 border-slate-600 text-slate-500 cursor-not-allowed'
                            : 'bg-slate-700 border-slate-500 text-slate-200 hover:border-indigo-400 hover:text-white'
                        }`}
                      >
                        {r.name.length > 35 ? r.name.slice(0, 35) + '…' : r.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Compare Button */}
              <Button
                onClick={handleCompare}
                disabled={selected.length < 2 || loading}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white w-full sm:w-auto"
              >
                {loading ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Analyzing…</>
                ) : (
                  <><Sparkles className="h-4 w-4 mr-2" />Compare {selected.length > 0 ? `${selected.length} Resources` : 'Selected'}</>
                )}
              </Button>

              {/* Winner Banner */}
              {winner && winner.id && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-amber-500/20 to-yellow-500/10 border border-amber-400/40"
                >
                  <Zap className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-amber-300 font-semibold text-sm">Top Recommendation</p>
                    <p className="text-slate-300 text-xs mt-1">
                      <span className="font-medium text-white">{selected.find(r => r.id === winner.id)?.name}</span>
                      {' — '}{winner.reason}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Comparison Grid */}
              {selected.length > 0 && Object.keys(analyses).length > 0 && (
                <div className={`grid gap-4 ${selected.length === 2 ? 'grid-cols-2' : selected.length === 3 ? 'grid-cols-3' : 'grid-cols-2 lg:grid-cols-4'}`}>
                  {selected.map(r => (
                    <ComparisonCard
                      key={r.id}
                      resource={r}
                      analysis={analyses[r.id]}
                      onRemove={() => removeFromComparison(r.id)}
                    />
                  ))}
                </div>
              )}

              {selected.length >= 2 && loading && (
                <div className={`grid gap-4 ${selected.length === 2 ? 'grid-cols-2' : selected.length === 3 ? 'grid-cols-3' : 'grid-cols-2 lg:grid-cols-4'}`}>
                  {selected.map(r => (
                    <ComparisonCard key={r.id} resource={r} analysis={null} onRemove={() => removeFromComparison(r.id)} />
                  ))}
                </div>
              )}
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}