import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink, BookOpen, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { resources as allResourceCategories } from '../resources/resourcesData';

// Flatten all library resources into one array with an id
function getAllLibraryResources() {
  const flat = [];
  for (const cat of allResourceCategories) {
    cat.items.forEach((item, idx) => {
      flat.push({ ...item, id: `${cat.category}-${idx}`, category: cat.category });
    });
  }
  return flat;
}

const ALL_RESOURCES = getAllLibraryResources();

// Topic keyword → resource topics mapping
const TOPIC_SIGNALS = [
  { signals: ['fatigue', 'tired', 'exhausted', 'energy', 'rest', 'pacing'], topic: 'managing fatigue' },
  { signals: ['anxiety', 'stress', 'nervous', 'worried', 'overwhelm', 'breathe', 'calm', 'relax'], topic: 'stress reduction' },
  { signals: ['accommodation', 'adjust', 'modification', 'schedule', 'flexible', 'remote', 'wfh'], topic: 'accommodations' },
  { signals: ['rights', 'ada', 'fmla', 'legal', 'law', 'protect', 'discriminat', 'eeoc', 'retaliation'], topic: 'workplace rights' },
  { signals: ['finance', 'money', 'cost', 'insurance', 'disability', 'benefit', 'copay', 'afford'], topic: 'financial assistance' },
  { signals: ['brain', 'memory', 'fog', 'focus', 'concentrate', 'chemo brain', 'cognitive'], topic: 'cognitive health' },
  { signals: ['emotion', 'depress', 'sad', 'grief', 'mental health', 'therapy', 'counsel', 'support group'], topic: 'emotional support' },
  { signals: ['nutrition', 'diet', 'eat', 'food', 'weight'], topic: 'nutrition' },
  { signals: ['exercise', 'physical', 'move', 'walk', 'yoga', 'stretch'], topic: 'exercise' },
  { signals: ['resume', 'job', 'career', 'interview', 'linkedin', 'networking', 'work search'], topic: 'career resources' },
  { signals: ['disclosure', 'tell boss', 'tell employer', 'reveal', 'share diagnosis', 'privacy'], topic: 'disclosure' },
  { signals: ['meditation', 'mindful', 'peace', 'breath'], topic: 'mindfulness' },
];

function detectTopicsFromText(text) {
  if (!text) return [];
  const lower = text.toLowerCase();
  const matched = new Set();
  for (const { signals, topic } of TOPIC_SIGNALS) {
    if (signals.some(s => lower.includes(s))) matched.add(topic);
  }
  return [...matched];
}

function findMatchingResources(topics, limit = 3) {
  if (!topics.length) return [];
  const scored = ALL_RESOURCES.map(r => {
    const resourceTopics = (r.topics || []).map(t => t.toLowerCase());
    const score = topics.filter(t => resourceTopics.some(rt => rt.includes(t) || t.includes(rt))).length;
    return { ...r, score };
  }).filter(r => r.score > 0);
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit);
}

export default function ProactiveResourceSuggestions({ messages }) {
  const suggestions = useMemo(() => {
    if (!messages || messages.length < 2) return [];
    // Look at the last 4 messages (user + assistant) for context
    const recentText = messages.slice(-4).map(m => m.content || '').join(' ');
    const topics = detectTopicsFromText(recentText);
    return findMatchingResources(topics, 3);
  }, [messages]);

  if (!suggestions.length) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="px-4 pb-3"
      >
        <Card className="nv-card--muted">
          <CardContent className="pt-3 pb-3">
            <div className="mb-2.5 flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <p className="text-xs font-semibold text-foreground">Relevant Library Resources</p>
              <span className="nv-chip nv-chip--muted ml-auto">
                <BookOpen className="h-2.5 w-2.5" />
                From your library
              </span>
            </div>
            <div className="space-y-1.5">
              {suggestions.map((resource, idx) => (
                <a
                  key={idx}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start justify-between gap-2 rounded-brand border border-border bg-brand-surface p-2 transition-colors hover:bg-muted"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium text-foreground">{resource.name}</p>
                    <p className="truncate text-[10px] text-muted-foreground">{resource.org} · {resource.category}</p>
                  </div>
                  <ExternalLink className="mt-0.5 h-3 w-3 flex-shrink-0 text-muted-foreground group-hover:text-primary" />
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}