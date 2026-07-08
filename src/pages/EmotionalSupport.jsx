import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  purple: { bg: 'bg-purple-900/40', icon: 'text-purple-300', border: 'border-purple-400', heading: 'text-purple-200' },
  amber:  { bg: 'bg-amber-900/40',  icon: 'text-amber-300',  border: 'border-amber-400',  heading: 'text-amber-200' },
  teal:   { bg: 'bg-teal-900/40',   icon: 'text-teal-300',   border: 'border-teal-400',   heading: 'text-teal-200' },
  blue:   { bg: 'bg-blue-900/40',   icon: 'text-blue-300',   border: 'border-blue-400',   heading: 'text-blue-200' },
  rose:   { bg: 'bg-rose-900/40',   icon: 'text-rose-300',   border: 'border-rose-400',   heading: 'text-rose-200' },
  green:  { bg: 'bg-green-900/40',  icon: 'text-green-300',  border: 'border-green-400',  heading: 'text-green-200' },
};

export default function EmotionalSupport() {

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
          Emotional Support & Well-Being
        </h1>
        <p className="text-lg text-slate-100 max-w-2xl mx-auto">
          Resources for managing anxiety, building confidence, and finding support
        </p>
      </div>

      {/* Strategies */}
      <div className="grid gap-6">
        {supportResources.map((resource) => {
          const Icon = resource.icon;
          return (
            <Card key={resource.title} className="bg-slate-800 border-slate-600">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${COLOR_MAP[resource.color]?.bg || 'bg-slate-700'}`}>
                    <Icon className={`h-6 w-6 ${COLOR_MAP[resource.color]?.icon || 'text-slate-300'}`} />
                  </div>
                  <span className="text-slate-100">{resource.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {resource.strategies.map((item, index) => (
                  <div key={index} className={`p-4 bg-slate-900/60 rounded-lg border-l-4 ${COLOR_MAP[resource.color]?.border || 'border-slate-400'}`}>
                    <h4 className={`font-semibold mb-2 ${COLOR_MAP[resource.color]?.heading || 'text-slate-200'}`}>{item.strategy}</h4>
                    <p className="text-sm text-slate-100 leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Peer Support */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-100 flex items-center space-x-2">
          <Users className="h-7 w-7 text-teal-600" />
          <span>Peer Support Networks</span>
        </h2>
        
        <div className="grid sm:grid-cols-2 gap-4">
          {peerSupport.map((org) => {
            const Icon = org.icon;
            return (
              <Card key={org.name} className="bg-slate-800 border-slate-600 hover:shadow-lg transition-all">
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-3 mb-3">
                    <div className={`p-2 rounded-lg ${COLOR_MAP[org.color]?.bg || 'bg-slate-700'}`}>
                      <Icon className={`h-5 w-5 ${COLOR_MAP[org.color]?.icon || 'text-slate-300'}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-100 mb-1">{org.name}</h3>
                      <p className="text-sm text-slate-100 leading-relaxed mb-2">{org.description}</p>
                      <p className="text-xs text-slate-200">{org.contact}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Coping Strategies */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-100 flex items-center space-x-2">
          <Book className="h-7 w-7 text-rose-600" />
          <span>Practical Coping Strategies</span>
        </h2>

        <div className="grid gap-6">
          {copingStrategies.map((strategy, index) => (
            <Card key={index} className="bg-slate-800 border-slate-600">
              <CardHeader>
                <CardTitle className="text-lg text-rose-400">{strategy.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3">
                  {strategy.steps.map((step, stepIndex) => (
                    <li key={stepIndex} className="flex items-start space-x-3">
                      <Badge className="bg-rose-100 text-rose-700 flex-shrink-0">
                        {stepIndex + 1}
                      </Badge>
                      <span className="text-slate-200 leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Supportive Message */}
      <Card className="bg-gradient-to-r from-pink-900/40 via-rose-900/40 to-teal-900/40 border-rose-700">
        <CardContent className="pt-6 text-center">
          <Heart className="h-12 w-12 text-rose-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-slate-100 mb-3">You're Doing Great</h3>
          <p className="text-slate-100 max-w-2xl mx-auto leading-relaxed mb-4">
            Some days will be harder than others. That's not weakness—that's being human. 
            Be patient with yourself. You've already proven how strong you are.
          </p>
          <p className="text-sm text-slate-200 italic">
            If you're struggling, please reach out to a mental health professional. 
            There's no shame in needing support.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}