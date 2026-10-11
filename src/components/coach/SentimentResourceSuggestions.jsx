import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
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
      { name: 'Feelings and Cancer', org: 'National Cancer Institute', url: 'https://www.cancer.gov/about-cancer/coping/feelings', topic: 'Coping with worry and fear' },
      { name: 'Anxiety Disorders', org: 'National Institute of Mental Health', url: 'https://www.nimh.nih.gov/health/topics/anxiety-disorders', topic: 'Understanding anxiety' },
      { name: 'Relaxation Techniques', org: 'NIH – NCCIH', url: 'https://www.nccih.nih.gov/health/relaxation-techniques-what-you-need-to-know', topic: 'Breathing & relaxation' }
    ]
  },
  {
    keywords: ['tired', 'exhausted', 'fatigue', 'drained', 'energy', 'no energy', 'worn out', 'wiped', 'can\'t keep up', 'so tired'],
    sentiment: 'overwhelmed',
    label: 'Managing Fatigue',
    color: 'orange',
    icon: Zap,
    resources: [
      { name: 'Fatigue and Cancer Treatment', org: 'National Cancer Institute', url: 'https://www.cancer.gov/about-cancer/treatment/side-effects/fatigue', topic: 'Evidence-based fatigue strategies' },
      { name: 'Cancer-Related Fatigue', org: 'American Cancer Society', url: 'https://www.cancer.org/cancer/side-effects/fatigue-weakness-sleep/fatigue.html', topic: 'Pacing techniques' },
      { name: 'Programs & Support', org: 'Cancer Support Community', url: 'https://www.cancersupportcommunity.org/get-support', topic: 'Free programs and workshops' }
    ]
  },
  {
    keywords: ['sad', 'depressed', 'hopeless', 'crying', 'grief', 'loss', 'lonely', 'alone', 'isolated', 'upset', 'devastated'],
    sentiment: 'sad',
    label: 'Emotional Support',
    color: 'blue',
    icon: Heart,
    resources: [
      { name: 'CancerCare Counseling Services', org: 'CancerCare', url: 'https://www.cancercare.org/counseling', topic: 'Free counseling (NY/NJ) & Hopeline 800-813-4673' },
      { name: 'Cancer Support Community', org: 'Cancer Support Community', url: 'https://www.cancersupportcommunity.org/get-support', topic: 'Support groups & community' },
      { name: 'Self-Compassion Practices', org: 'Dr. Kristin Neff', url: 'https://self-compassion.org/self-compassion-practices/', topic: 'Building self-compassion' }
    ]
  },
  {
    keywords: ['forget', 'memory', 'fog', 'confused', 'concentration', 'focus', 'brain', 'chemo brain', 'can\'t think', 'confused'],
    sentiment: 'frustrated',
    label: 'Cognitive Support',
    color: 'purple',
    icon: Brain,
    resources: [
      { name: 'Memory and Concentration Changes', org: 'National Cancer Institute', url: 'https://www.cancer.gov/about-cancer/treatment/side-effects/memory', topic: 'Chemo brain strategies' },
      { name: 'Chemo Brain', org: 'American Cancer Society', url: 'https://www.cancer.org/cancer/side-effects/changes-in-mood-or-thinking/chemo-brain.html', topic: 'Focus techniques' }
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
      { name: 'Employment Rights & Cancer', org: 'Triage Cancer', url: 'https://triagecancer.org/employment', topic: 'Comprehensive legal guide' },
      { name: 'Family and Medical Leave Act (FMLA)', org: 'U.S. Department of Labor', url: 'https://www.dol.gov/agencies/whd/fmla', topic: 'Medical leave rights' }
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
      { name: 'Accommodation Ideas for Cancer', org: 'JAN', url: 'https://askjan.org/disabilities/Cancer.cfm', topic: 'Cancer-specific accommodations' },
      { name: 'Reasonable Accommodation Guidance', org: 'EEOC', url: 'https://www.eeoc.gov/laws/guidance/enforcement-guidance-reasonable-accommodation-and-undue-hardship-under-ada', topic: 'Official ADA guidance' }
    ]
  },
  {
    keywords: ['confidence', 'doubt', 'imposter', 'insecure', 'not good enough', 'failing', 'can\'t do it', 'struggle', 'behind'],
    sentiment: 'sad',
    label: 'Building Confidence',
    color: 'green',
    icon: Sparkles,
    resources: [
      { name: 'Life After Cancer Treatment', org: 'National Cancer Institute', url: 'https://www.cancer.gov/about-cancer/coping/survivorship', topic: 'Rebuilding confidence' },
      { name: 'Emotional Support Programs', org: 'Cancer Support Community', url: 'https://www.cancersupportcommunity.org/get-support', topic: 'Support groups & counseling' },
      { name: 'Work & Career Resources', org: 'Cancer and Careers', url: 'https://www.cancerandcareers.org/career-coach', topic: 'Career coaching & tools' }
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
  amber: { text: 'text-primary', dot: 'bg-primary' },
  orange: { text: 'text-brand-accent', dot: 'bg-brand-accent' },
  blue: { text: 'text-primary', dot: 'bg-brand-sky' },
  red: { text: 'text-destructive', dot: 'bg-destructive' },
  teal: { text: 'text-brand-secondary', dot: 'bg-brand-secondary' },
  green: { text: 'text-brand-secondary', dot: 'bg-brand-secondary' },
  purple: { text: 'text-primary', dot: 'bg-primary' }
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
        <Card className="nv-card--muted mt-2">
          <CardContent className="space-y-3 pt-4 pb-4">
            {/* Sentiment header */}
            <div className="flex items-start gap-2">
              <div className={`mt-1.5 h-2 w-2 flex-shrink-0 rounded-full ${colors.dot}`} />
              <div>
                <p className={`mb-0.5 text-xs font-semibold ${colors.text}`}>
                  <Icon className="mr-1 inline h-3 w-3" />
                  {match.label} Detected
                </p>
                <p className="text-xs italic text-muted-foreground">{empathy.message}</p>
              </div>
            </div>

            {/* Resources */}
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-foreground">Proactively suggested resources:</p>
              {match.resources.map((resource, idx) => (
                <a
                  key={idx}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start justify-between gap-2 rounded-brand border border-border bg-surface p-2 transition-colors hover:bg-muted"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium text-foreground">{resource.name}</p>
                    <p className="text-xs text-muted-foreground">{resource.org} · {resource.topic}</p>
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