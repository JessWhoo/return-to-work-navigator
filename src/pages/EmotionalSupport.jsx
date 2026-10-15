import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import PageHeader from '@/components/brand/PageHeader';
import SupportNetworkCard from '@/components/support/SupportNetworkCard';
import useSEO from '@/hooks/useSEO';
import { 
  Heart, Brain, Users, Sparkles, 
  MessageCircle, Phone, Video, Book
} from 'lucide-react';

const supportResources = [
  {
    title: 'Managing Return-to-Work Anxiety',
    icon: Brain,
    color: 'purple',
    strategies: [
      {
        strategy: 'Reframe Your Thoughts',
        description: 'Replace "What if I fail?" with "I\'m taking this one day at a time and doing my best."'
      },
      {
        strategy: 'Practice Grounding Techniques',
        description: 'Use 5-4-3-2-1 method: Name 5 things you see, 4 you hear, 3 you can touch, 2 you smell, 1 you taste'
      },
      {
        strategy: 'Set Micro-Goals',
        description: 'Instead of "survive the whole day," try "make it to lunch break" then reassess'
      },
      {
        strategy: 'Prepare Your Anchor Phrases',
        description: 'Have ready responses like "I\'m focusing on my recovery" to deflect uncomfortable questions'
      }
    ]
  },
  {
    title: 'Confidence Building',
    icon: Sparkles,
    color: 'amber',
    strategies: [
      {
        strategy: 'List Your Wins',
        description: 'You survived cancer treatment. You\'re stronger than you think. Write down 3 things you\'re proud of.'
      },
      {
        strategy: 'Visualize Success',
        description: 'Spend 5 minutes daily imagining yourself confident and capable at work'
      },
      {
        strategy: 'Start Small',
        description: 'Begin with short work periods or easy tasks to rebuild confidence gradually'
      },
      {
        strategy: 'Celebrate Progress',
        description: 'Acknowledge every achievement, no matter how small it seems'
      }
    ]
  },
  {
    title: 'Professional Support Options',
    icon: MessageCircle,
    color: 'teal',
    strategies: [
      {
        strategy: 'Therapy/Counseling',
        description: 'Many cancer centers offer free counseling. Ask your oncology team for referrals.'
      },
      {
        strategy: 'Support Groups',
        description: 'Connect with other survivors who\'ve returned to work through organizations like Cancer Support Community'
      },
      {
        strategy: 'Occupational Therapy',
        description: 'OTs can help with fatigue management and workplace adaptation strategies'
      },
      {
        strategy: 'Career Coaching',
        description: 'Cancer and Careers offers free career coaching specifically for survivors'
      }
    ]
  }
];

const peerSupport = [
  {
    name: 'Cancer Support Community',
    description: 'Support groups, both in-person and online, facilitated by licensed professionals',
    contact: 'www.cancersupportcommunity.org',
    icon: Users,
    color: 'blue'
  },
  {
    name: 'Imerman Angels',
    description: 'Free one-on-one support by pairing you with someone who fought the same cancer',
    contact: 'www.imermanangels.org',
    icon: Heart,
    color: 'rose'
  },
  {
    name: 'CancerCare',
    description: 'Free professional counseling, support groups, and workshops',
    contact: '1-800-813-HOPE (4673) | www.cancercare.org',
    icon: Phone,
    color: 'green'
  },
  {
    name: 'Stupid Cancer',
    description: 'Community specifically for adolescents and young adults affected by cancer',
    contact: 'www.stupidcancer.org',
    icon: Video,
    color: 'purple'
  }
];

const copingStrategies = [
  {
    title: 'When You Feel Overwhelmed at Work',
    steps: [
      'Step away to a quiet space (bathroom, car, outside)',
      'Do 3 deep breaths: in for 4, hold for 4, out for 6',
      'Name the emotion without judgment: "I\'m feeling anxious right now"',
      'Ask yourself: "What do I need in this moment?"',
      'Take the smallest next step, not the whole staircase'
    ]
  },
  {
    title: 'Dealing with Changed Workplace Relationships',
    steps: [
      'Some people won\'t know what to say - that\'s about them, not you',
      'Others may treat you differently - set boundaries kindly but firmly',
      'It\'s okay to correct misconceptions about your capabilities',
      'Find your people - those who treat you normally are gold',
      'Remember: you don\'t owe anyone your emotional labor'
    ]
  },
  {
    title: 'Managing "Imposter Syndrome" After Treatment',
    steps: [
      'Your brain and body went through trauma - adjustment takes time',
      '"Chemo brain" is real and temporary for most people',
      'You\'re not faking limitations - they\'re real recovery needs',
      'Comparing yourself to "before cancer you" is unfair',
      'Give yourself the same compassion you\'d give a friend'
    ]
  }
];

const COLOR_MAP = {
  purple: { bg: 'bg-muted', icon: 'text-primary', border: 'border-primary' },
  amber:  { bg: 'bg-muted', icon: 'text-primary', border: 'border-primary' },
  teal:   { bg: 'bg-muted', icon: 'text-primary', border: 'border-brand-secondary' },
  blue:   { bg: 'bg-muted', icon: 'text-primary', border: 'border-primary' },
  rose:   { bg: 'bg-muted', icon: 'text-destructive', border: 'border-destructive' },
  green:  { bg: 'bg-muted', icon: 'text-primary', border: 'border-brand-secondary' },
};

export default function EmotionalSupport({ embedded = false }) {
  useSEO({
    title: 'Managing Return-to-Work Anxiety & Emotional Recovery',
    description:
      'Practical coping strategies for cancer survivors navigating return-to-work anxiety, imposter syndrome, scanxiety, and coworker conversations.',
    path: '/EmotionalSupport',
    enabled: !embedded,
  });

  return (
    <div className="mx-auto max-w-5xl space-y-8 [overflow-wrap:anywhere]">
      {/* Header */}
      <PageHeader center={!embedded} headingLevel={embedded ? 'h2' : 'h1'} title="Emotional Support & Return-to-Work Anxiety Guide" subtitle="Practical strategies for managing workplace anxiety, rebuilding confidence, and finding peer support" />

      {/* Strategies */}
      <div className="grid gap-6">
        {supportResources.map((resource) => {
          const Icon = resource.icon;
          return (
            <Card key={resource.title}>
              <CardHeader>
                <CardTitle className="flex items-start gap-3 text-lg sm:text-xl">
                  <div className={`shrink-0 rounded-brand p-2 ${COLOR_MAP[resource.color]?.bg || 'bg-muted'}`}>
                    <Icon className={`h-6 w-6 ${COLOR_MAP[resource.color]?.icon || 'text-primary'}`} />
                  </div>
                  <span className="text-foreground">{resource.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {resource.strategies.map((item, index) => (
                  <div key={index} className={`rounded-brand border-l-4 bg-muted p-4 ${COLOR_MAP[resource.color]?.border || 'border-border'}`}>
                    <h4 className="mb-2 font-semibold text-foreground">{item.strategy}</h4>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Peer Support */}
      <div className="space-y-4">
        <h2 className="flex items-start gap-3 font-heading text-xl font-bold text-foreground sm:text-2xl">
          <Users className="h-6 w-6 shrink-0 text-primary" strokeWidth={1.75} aria-hidden="true" />
          <span>Peer Support Networks</span>
        </h2>
        
        <div className="grid gap-4 sm:grid-cols-2">
          {peerSupport.map(org => <SupportNetworkCard key={org.name} organization={org} />)}
        </div>
      </div>

      {/* Coping Strategies */}
      <div className="space-y-4">
        <h2 className="flex items-start gap-3 font-heading text-xl font-bold text-foreground sm:text-2xl">
          <Book className="h-6 w-6 shrink-0 text-primary" strokeWidth={1.75} aria-hidden="true" />
          <span>Practical Coping Strategies</span>
        </h2>

        <div className="grid gap-6">
          {copingStrategies.map((strategy, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg text-foreground">{strategy.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3">
                  {strategy.steps.map((step, stepIndex) => (
                    <li key={stepIndex} className="flex items-start space-x-3">
                      <Badge variant="secondary" className="shrink-0 rounded-pill">
                        {stepIndex + 1}
                      </Badge>
                      <span className="min-w-0 text-foreground">{step}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Supportive Message */}
      <Card className="nv-card--muted">
        <CardContent className="pt-6 text-center">
          <Heart className="mx-auto mb-4 h-12 w-12 text-destructive" />
          <h3 className="mb-3 font-heading text-2xl font-bold text-foreground">You're Doing Great</h3>
          <p className="mx-auto mb-4 max-w-2xl text-muted-foreground">
            Some days will be harder than others. That's not weakness—that's being human. 
            Be patient with yourself. You've already proven how strong you are.
          </p>
          <p className="text-sm italic text-muted-foreground">
            If you're struggling, please reach out to a mental health professional. 
            There's no shame in needing support.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}