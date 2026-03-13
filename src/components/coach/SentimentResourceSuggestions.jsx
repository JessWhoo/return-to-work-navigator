import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Sparkles, Heart, Zap, AlertTriangle, Brain, Shield, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Keyword → sentiment + resource topic mapping
const SENTIMENT_RULES = [
  {
    keywords: ['scared', 'afraid', 'terrified', 'fear', 'worried', 'anxiety', 'anxious', 'nervous', 'panic', 'dread'],
    sentiment: 'anxious',
    label: 'Feeling Anxious',
    color: 'amber',
    icon: AlertTriangle,
    resources: [
      { name: 'Anxiety Management for Return to Work', org: 'Mental Health America', url: 'https://www.mhanational.org', topic: 'Managing return-to-work anxiety' },
      { name: 'Guided Meditation for Workplace Stress', org: 'Calm', url: 'https://www.calm.com/blog/meditation-for-stress', topic: 'Quick stress relief' },
      { name: 'Breathwork for Anxiety Management', org: 'Calm', url: 'https://www.calm.com/blog/breathing-exercises', topic: 'Breathing techniques' }
    ]
  },
  {
    keywords: ['tired', 'exhausted', 'fatigue', 'drained', 'energy', 'no energy', 'worn out', 'wiped', 'can\'t keep up', 'so tired'],
    sentiment: 'overwhelmed',
    label: 'Managing Fatigue',
    color: 'orange',
    icon: Zap,
    resources: [
      { name: 'Managing Fatigue During Cancer Treatment', org: 'Cancer Support Community', url: 'https://www.cancersupportcommunity.org/living-cancer/side-effects/fatigue', topic: 'Evidence-based fatigue strategies' },
      { name: 'Managing Energy and Fatigue at Work', org: 'American Cancer Society', url: 'https://www.cancer.org/treatment/treatments-and-side-effects/physical-side-effects/fatigue.html', topic: 'Pacing techniques' },
      { name: 'Managing Fatigue at Work Workshop', org: 'Cancer Support Community', url: 'https://www.cancersupportcommunity.org/programs-services', topic: 'Practical workshop' }
    ]
  },
  {
    keywords: ['sad', 'depressed', 'hopeless', 'crying', 'grief', 'loss', 'lonely', 'alone', 'isolated', 'upset', 'devastated'],
    sentiment: 'sad',
    label: 'Emotional Support',
    color: 'blue',
    icon: Heart,
    resources: [
      { name: 'CancerCare Counseling Services', org: 'CancerCare', url: 'https://www.cancercare.org/counseling', topic: 'Free professional counseling' },
      { name: 'Cancer Support Community', org: 'Cancer Support Community', url: 'https://www.cancersupportcommunity.org', topic: 'Support groups & community' },
      { name: 'Loving-Kindness Meditation for Self-Compassion', org: 'Greater Good Science Center', url: 'https://ggsc.berkeley.edu', topic: 'Building self-compassion' }
    ]
  },
  {
    keywords: ['forget', 'memory', 'fog', 'confused', 'concentration', 'focus', 'brain', 'chemo brain', 'can\'t think', 'confused'],
    sentiment: 'frustrated',
    label: 'Cognitive Support',
    color: 'purple',
    icon: Brain,
    resources: [
      { name: 'Managing Cognitive Changes at Work', org: 'Cancer and Careers', url: 'https://www.cancerandcareers.org/en/at-work/managing-work/chemo-brain', topic: 'Chemo brain strategies' },
      { name: 'Cognitive Strategies for Chemo Brain', org: 'American Cancer Society', url: 'https://www.cancer.org/treatment/treatments-and-side-effects/physical-side-effects/changes-in-mood-or-thinking/chemo-brain.html', topic: 'Focus techniques' }
    ]
  },
  {
    keywords: ['rights', 'ada', 'fmla', 'discriminat', 'illegal', 'unfair', 'retaliation', 'fired', 'legal', 'lawsuit', 'eeoc'],
    sentiment: 'frustrated',
    label: 'Legal Resources',
    color: 'red',
    icon: Shield,
    resources: [
      { name: 'EEOC: Cancer in the Workplace and the ADA', org: 'EEOC', url: 'https://www.eeoc.gov/laws/guidance/cancer-workplace-and-ada', topic: 'Your ADA rights' },
      { name: 'Working Through Cancer: Your Legal Rights', org: 'Triage Cancer', url: 'https://triagecancer.org/employmentrights', topic: 'Comprehensive legal guide' },
      { name: 'Employment Attorney Q&A on Discrimination', org: 'Workplace Fairness', url: 'https://www.workplacefairness.org', topic: 'Discrimination Q&A' }
    ]
  },
  {
    keywords: ['accommodation', 'request', 'modification', 'flexible', 'schedule', 'remote', 'work from home', 'wfh', 'adjust'],
    sentiment: 'neutral',
    label: 'Accommodation Help',
    color: 'teal',
    icon: Users,
    resources: [
      { name: 'Job Accommodation Network (JAN)', org: 'JAN', url: 'https://askjan.org', topic: 'Free personalized accommodation guidance' },
      { name: 'Job Accommodation Network - Sample Letters', org: 'JAN', url: 'https://askjan.org/publications/Sample-Accommodation-Request-Letters.cfm', topic: 'Request letter templates' },
      { name: 'Understanding Workplace Accommodations', org: 'JAN', url: 'https://askjan.org', topic: 'Video tutorial' }
    ]
  },
  {
    keywords: ['confidence', 'doubt', 'imposter', 'insecure', 'not good enough', 'failing', 'can\'t do it', 'struggle', 'behind'],
    sentiment: 'sad',
    label: 'Building Confidence',
    color: 'green',
    icon: Sparkles,
    resources: [
      { name: 'Building Confidence After Cancer', org: 'Cancer Support Community', url: 'https://www.cancersupportcommunity.org/living-cancer/emotional-support', topic: 'Rebuilding professional confidence' },
      { name: 'Coping with Imposter Syndrome After Treatment', org: 'Psychology Today', url: 'https://www.psychologytoday.com', topic: 'Overcoming inadequacy' },
      { name: 'Career Coach on Rebuilding Professional Identity', org: 'Cancer and Careers', url: 'https://www.cancerandcareers.org/en/looking-for-work/career-coaching', topic: 'Career coaching' }
    ]
  }
];

const SENTIMENT_EMPATHY = {
  anxious: { message: "It sounds like you're feeling anxious. That's completely valid.", color: 'amber' },
  overwhelmed: { message: "Managing fatigue while working is genuinely hard. You're not alone.", color: 'orange' },
  sad: { message: "These feelings are real and okay to have. Be gentle with yourself.", color: 'blue' },
  frustrated: { message: "Your frustration makes sense — you're navigating something really challenging.", color: 'red' },
  hopeful: { message: "Your positive outlook is a real strength to lean into.", color: 'green' },
  neutral: { message: "Here are some resources that may be helpful for your situation.", color: 'purple' },
  positive: { message: "Keep that momentum going — you're doing great!", color: 'green' }
};

const colorMap = {
  amber: { bg: 'bg-amber-900/30', border: 'border-amber-600/40', badge: 'bg-amber-600', text: 'text-amber-300', dot: 'bg-amber-400' },
  orange: { bg: 'bg-orange-900/30', border: 'border-orange-600/40', badge: 'bg-orange-600', text: 'text-orange-300', dot: 'bg-orange-400' },
  blue: { bg: 'bg-blue-900/30', border: 'border-blue-600/40', badge: 'bg-blue-600', text: 'text-blue-300', dot: 'bg-blue-400' },
  red: { bg: 'bg-red-900/30', border: 'border-red-600/40', badge: 'bg-red-600', text: 'text-red-300', dot: 'bg-red-400' },
  teal: { bg: 'bg-teal-900/30', border: 'border-teal-600/40', badge: 'bg-teal-600', text: 'text-teal-300', dot: 'bg-teal-400' },
  green: { bg: 'bg-green-900/30', border: 'border-green-600/40', badge: 'bg-green-600', text: 'text-green-300', dot: 'bg-green-400' },
  purple: { bg: 'bg-purple-900/30', border: 'border-purple-600/40', badge: 'bg-purple-600', text: 'text-purple-300', dot: 'bg-purple-400' }
};

export function detectSentimentAndResources(text) {
  if (!text) return null;
  const lower = text.toLowerCase();
  const matches = [];

  for (const rule of SENTIMENT_RULES) {
    const hit = rule.keywords.some(kw => lower.includes(kw));
    if (hit) matches.push(rule);
  }

  // Return the first (most specific) match
  return matches.length > 0 ? matches[0] : null;
}

export default function SentimentResourceSuggestions({ lastUserMessage }) {
  const match = useMemo(() => detectSentimentAndResources(lastUserMessage), [lastUserMessage]);

  if (!match || !lastUserMessage) return null;

  const empathy = SENTIMENT_EMPATHY[match.sentiment] || SENTIMENT_EMPATHY.neutral;
  const colors = colorMap[match.color] || colorMap.purple;
  const Icon = match.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.3 }}
      >
        <Card className={`${colors.bg} border ${colors.border} mt-2`}>
          <CardContent className="pt-4 pb-4 space-y-3">
            {/* Sentiment header */}
            <div className="flex items-start gap-2">
              <div className={`mt-0.5 h-2 w-2 rounded-full ${colors.dot} flex-shrink-0 mt-1.5`} />
              <div>
                <p className={`text-xs font-semibold ${colors.text} mb-0.5`}>
                  <Icon className="inline h-3 w-3 mr-1" />
                  {match.label} Detected
                </p>
                <p className="text-xs text-slate-400 italic">{empathy.message}</p>
              </div>
            </div>

            {/* Resources */}
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-slate-300">Proactively suggested resources:</p>
              {match.resources.map((resource, idx) => (
                <a
                  key={idx}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start justify-between gap-2 p-2 rounded-lg bg-slate-800/60 hover:bg-slate-700/60 transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-200 group-hover:text-white truncate">{resource.name}</p>
                    <p className="text-xs text-slate-500">{resource.org} · {resource.topic}</p>
                  </div>
                  <ExternalLink className="h-3 w-3 text-slate-500 group-hover:text-slate-300 flex-shrink-0 mt-0.5" />
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}