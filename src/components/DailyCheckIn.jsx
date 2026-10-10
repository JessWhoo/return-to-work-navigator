import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, ExternalLink, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { resources as allResources } from './resources/resourcesData';
import { toast } from 'sonner';
import { CompassIcon } from '@/components/brand/BrandIcon';

const MOODS = [
  { value: 'very_low', label: '😞 Very low' },
  { value: 'low', label: '😔 Low' },
  { value: 'neutral', label: '😐 Neutral' },
  { value: 'good', label: '🙂 Good' },
  { value: 'excellent', label: '😄 Excellent' },
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
const flatResources = allResources.flatMap((cat) =>
  cat.items.map((item, ii) => ({
    ...item,
    id: `${cat.category}-${ii}`,
    category: cat.category,
  }))
);

/**
 * Daily check-in — the design system's Daily check-in card (mauve prompt)
 * carrying this app's real mood, energy and challenge questions.
 */
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

    try {
      const result = (await base44.functions.invoke('aiGateway', {
        operation: 'check_in_recommendation',
        data: { mood, energy, challenge, resourceSummaries },
      })).data.result;

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
      transition={{ delay: 0.2 }}
      className="mb-12"
    >
      <div className="nv-checkin">
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          aria-expanded={open}
          className="flex w-full items-start justify-between gap-4 text-left"
        >
          <span className="flex items-start gap-3">
            <span className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand-cream text-brand-primary">
              <CompassIcon className="h-5 w-5" />
            </span>
            <span className="flex flex-col gap-1">
              <span className="e">Daily check-in</span>
              <h3>How's your energy today?</h3>
            </span>
          </span>
          {open ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>

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
              {!recommendation ? (
                <div className="flex flex-col gap-5 pt-1">
                  <div className="flex flex-col gap-2">
                    <span className="lbl">How are you feeling today?</span>
                    <div className="nv-checkin-optrow">
                      {MOODS.map(m => (
                        <button
                          key={m.value}
                          type="button"
                          onClick={() => setMood(m.value)}
                          aria-pressed={mood === m.value}
                          className={`nv-opt ${mood === m.value ? 'on' : ''}`}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <span className="lbl">
                      Energy level (1–10){energy ? ` — ${energy}/10` : ''}
                    </span>
                    <div className="nv-checkin-optrow">
                      {ENERGY_LEVELS.map(n => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setEnergy(n)}
                          aria-pressed={energy === n}
                          className={`nv-opt ${energy === n ? 'on' : ''}`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <span className="lbl">Your top challenge today</span>
                    <div className="nv-checkin-optrow">
                      {CHALLENGES.map(c => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setChallenge(c)}
                          aria-pressed={challenge === c}
                          className={`nv-opt ${challenge === c ? 'on' : ''}`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!canSubmit || loading}
                    className="nv-checkin-btn inline-flex items-center gap-2"
                  >
                    {loading ? (
                      <><RefreshCw className="h-4 w-4 animate-spin" /> Finding your resource…</>
                    ) : (
                      'Get today\'s resource'
                    )}
                  </button>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="nv-card flex flex-col gap-3 p-5 pt-5"
                >
                  <span className="nv-eyebrow nv-eyebrow--primary">
                    {recommendation.resource.type} · For today
                  </span>
                  <h3 className="font-heading text-xl font-bold text-brand-text">
                    {recommendation.resource.name}
                  </h3>
                  <p className="text-sm text-brand-muted-foreground">
                    {recommendation.resource.org}
                  </p>
                  <p className="text-sm leading-relaxed text-brand-text">
                    {recommendation.resource.description}
                  </p>
                  <p className="rounded-brand bg-brand-muted p-3 text-sm italic text-brand-text">
                    {recommendation.reason}
                  </p>
                  <a
                    href={recommendation.resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-brand-primary underline transition-colors hover:text-brand-text"
                  >
                    <ExternalLink className="h-4 w-4" /> Open resource
                  </a>
                  <Button variant="outline" size="sm" onClick={reset} className="self-start">
                    <RefreshCw className="h-4 w-4" /> Check in again
                  </Button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}