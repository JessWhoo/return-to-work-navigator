import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { Smile, Zap, AlertCircle, Sparkles, ExternalLink, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { resources as allResources } from './resources/resourcesData';
import { toast } from 'sonner';

const MOODS = [
  { value: 'very_low', label: '😞 Very Low', color: 'border-red-500 bg-red-900/30 text-red-300' },
  { value: 'low', label: '😔 Low', color: 'border-orange-500 bg-orange-900/30 text-orange-300' },
  { value: 'neutral', label: '😐 Neutral', color: 'border-yellow-500 bg-yellow-900/30 text-yellow-300' },
  { value: 'good', label: '🙂 Good', color: 'border-teal-500 bg-teal-900/30 text-teal-300' },
  { value: 'excellent', label: '😄 Excellent', color: 'border-green-500 bg-green-900/30 text-green-300' },
];

const ENERGY_LEVELS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const CHALLENGES = [
  'Fatigue / low energy',
  'Anxiety about returning',
  'Cognitive fog / concentration',
  'Communicating with my employer',
  'Understanding my legal rights',
  'Requesting accommodations',
  'Managing pain or side effects',
  'Feeling isolated or unsupported',
  'Financial stress',
  'Rebuilding confidence',
];

// Flatten all resources into a single list with IDs
const flatResources = allResources.flatMap((cat, ci) =>
  cat.items.map((item, ii) => ({
    ...item,
    id: `${cat.category}-${ii}`,
    category: cat.category,
  }))
);

export default function DailyCheckIn() {
  const [open, setOpen] = useState(false);
  const [mood, setMood] = useState(null);
  const [energy, setEnergy] = useState(null);
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState(null);

  const canSubmit = mood && energy && challenge;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setLoading(true);
    setRecommendation(null);

    // Build a compact resource list to send to the LLM
    const resourceSummaries = flatResources.map((r, i) =>
      `${i}: "${r.name}" (${r.category}) — ${r.description.slice(0, 80)}`
    ).join('\n');

    const prompt = `A cancer survivor just logged their daily check-in:
- Mood: ${mood}
- Energy level: ${energy}/10
- Top challenge today: "${challenge}"

Here is a numbered list of resources available (index: name — description):
${resourceSummaries}

Based ONLY on their mood, energy, and challenge, pick the SINGLE most helpful resource index number. 
Reply with ONLY a JSON object like: {"index": 12, "reason": "one sentence explaining why this helps them today"}`;

    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: 'object',
          properties: {
            index: { type: 'number' },
            reason: { type: 'string' },
          },
          required: ['index', 'reason'],
        },
      });

      const idx = result?.index;
      if (typeof idx === 'number' && flatResources[idx]) {
        setRecommendation({ resource: flatResources[idx], reason: result.reason });
      } else {
        toast.error('Could not pick a recommendation. Try again.');
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setMood(null);
    setEnergy(null);
    setChallenge(null);
    setRecommendation(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="mb-10"
    >
      <Card className="bg-white border-2 border-teal-500 shadow-xl">
        <CardHeader
          className="cursor-pointer select-none"
          onClick={() => setOpen(o => !o)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 shadow-lg">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-slate-900 text-xl font-bold">Daily Check-In</CardTitle>
                <p className="text-slate-700 text-base mt-1 font-semibold">Log your mood & get a personalized resource</p>
              </div>
            </div>
            {open ? <ChevronUp className="h-6 w-6 text-slate-700" /> : <ChevronDown className="h-6 w-6 text-slate-700" />}
          </div>
        </CardHeader>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="checkin-body"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              style={{ overflow: 'hidden' }}
            >
              <CardContent className="pt-0 space-y-6">
                {!recommendation ? (
                  <>
                    {/* Mood */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Smile className="h-5 w-5 text-teal-600" />
                        <span className="text-slate-900 font-bold text-base">How are you feeling today?</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {MOODS.map(m => (
                          <button
                            key={m.value}
                            onClick={() => setMood(m.value)}
                            className={`px-4 py-2 rounded-lg border-2 text-base font-semibold transition-all ${
                              mood === m.value
                                ? 'border-teal-600 bg-teal-50 text-slate-900'
                                : 'border-slate-300 text-slate-800 hover:border-teal-500 bg-white'
                            }`}
                          >
                            {m.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Energy */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Zap className="h-5 w-5 text-amber-600" />
                        <span className="text-slate-900 font-bold text-base">Energy level (1–10)</span>
                        {energy && <span className="ml-auto text-teal-700 font-bold text-lg">{energy}/10</span>}
                      </div>
                      <div className="flex gap-1.5 flex-wrap">
                        {ENERGY_LEVELS.map(n => (
                          <button
                            key={n}
                            onClick={() => setEnergy(n)}
                            className={`w-10 h-10 rounded-lg text-base font-bold border-2 transition-all ${
                              energy === n
                                ? 'bg-gradient-to-br from-amber-500 to-orange-500 border-amber-500 text-white shadow-lg'
                                : 'border-slate-300 text-slate-800 hover:border-amber-500 bg-white'
                            }`}
                          >
                            {n}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Challenge */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <AlertCircle className="h-5 w-5 text-rose-600" />
                        <span className="text-slate-900 font-bold text-base">Your top challenge today</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {CHALLENGES.map(c => (
                          <button
                            key={c}
                            onClick={() => setChallenge(c)}
                            className={`px-4 py-2 rounded-lg border-2 text-sm font-semibold transition-all ${
                              challenge === c
                                ? 'border-rose-600 bg-rose-50 text-slate-900'
                                : 'border-slate-300 text-slate-800 hover:border-rose-500 bg-white'
                            }`}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>

                    <Button
                      onClick={handleSubmit}
                      disabled={!canSubmit || loading}
                      className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold text-base py-6 rounded-xl shadow-lg disabled:opacity-40"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2"><RefreshCw className="h-5 w-5 animate-spin" /> Finding your resource…</span>
                      ) : (
                        <span className="flex items-center gap-2"><Sparkles className="h-5 w-5" /> Get Today's Resource</span>
                      )}
                    </Button>
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Sparkles className="h-5 w-5 text-teal-600" />
                      <span className="text-teal-800 font-bold text-base">Your resource for today</span>
                    </div>

                    <div className="bg-teal-50 border-2 border-teal-500 rounded-xl p-4 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-slate-900 font-bold text-lg leading-snug">{recommendation.resource.name}</p>
                          <p className="text-slate-700 text-sm mt-1 font-semibold">{recommendation.resource.org}</p>
                        </div>
                        <Badge className="bg-slate-200 text-slate-900 text-sm font-semibold flex-shrink-0">
                          {recommendation.resource.type}
                        </Badge>
                      </div>
                      <p className="text-slate-900 text-base leading-relaxed font-medium">{recommendation.resource.description}</p>
                      <div className="bg-white border-2 border-teal-400 rounded-lg px-3 py-2">
                        <p className="text-slate-900 text-sm italic font-semibold">💡 {recommendation.reason}</p>
                      </div>
                      <a
                        href={recommendation.resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-teal-700 hover:text-teal-800 text-base font-bold transition-colors"
                      >
                        <ExternalLink className="h-5 w-5" /> Open Resource
                      </a>
                    </div>

                    <Button
                      onClick={reset}
                      variant="outline"
                      className="w-full border-2 border-slate-400 text-slate-900 bg-white hover:bg-slate-50 font-semibold text-base"
                    >
                      <RefreshCw className="h-5 w-5 mr-2" /> Log Again
                    </Button>
                  </motion.div>
                )}
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}