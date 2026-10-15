import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, Brain, Wind, Waves, Moon, Sparkles, CheckCircle2
} from 'lucide-react';
import useSEO from '@/hooks/useSEO';

const copingMechanisms = [
  {
    category: 'Stress Reduction',
    icon: Wind,
    color: 'blue',
    techniques: [
      {
        name: 'Box Breathing',
        duration: '5 minutes',
        description: 'Breathe in for 4, hold for 4, out for 4, hold for 4. Repeat.',
        steps: [
          'Sit comfortably with your back straight',
          'Exhale slowly through your mouth',
          'Breathe in through your nose for 4 counts',
          'Hold your breath for 4 counts',
          'Exhale through your mouth for 4 counts',
          'Hold empty for 4 counts',
          'Repeat 5-10 times'
        ]
      },
      {
        name: '4-7-8 Breathing',
        duration: '3 minutes',
        description: 'Calms the nervous system and reduces anxiety.',
        steps: [
          'Place tongue tip behind upper front teeth',
          'Exhale completely through mouth (whoosh sound)',
          'Close mouth, inhale through nose for 4 counts',
          'Hold breath for 7 counts',
          'Exhale through mouth for 8 counts (whoosh)',
          'Repeat 4 times'
        ]
      }
    ]
  },
  {
    category: 'Mood Boosters',
    icon: Sparkles,
    color: 'amber',
    techniques: [
      {
        name: '5-4-3-2-1 Grounding',
        duration: '5 minutes',
        description: 'Brings you back to the present moment when overwhelmed.',
        steps: [
          'Name 5 things you can SEE around you',
          'Name 4 things you can TOUCH',
          'Name 3 things you can HEAR',
          'Name 2 things you can SMELL',
          'Name 1 thing you can TASTE',
          'Take three deep breaths'
        ]
      },
      {
        name: 'Gratitude Practice',
        duration: '5 minutes',
        description: 'Shifts focus to positive aspects of your life.',
        steps: [
          'Get a notebook or open notes app',
          'Write today\'s date',
          'List 3 things you\'re grateful for today',
          'Include WHY you\'re grateful for each',
          'Can be as small as "warm coffee" or "sunny day"',
          'Do this daily, preferably at the same time'
        ]
      }
    ]
  },
  {
    category: 'Anxiety Management',
    icon: Heart,
    color: 'rose',
    techniques: [
      {
        name: 'Progressive Muscle Relaxation',
        duration: '10 minutes',
        description: 'Releases physical tension throughout your body.',
        steps: [
          'Lie down or sit comfortably',
          'Tense your feet for 5 seconds, then release',
          'Move up: calves, thighs, buttocks (tense & release)',
          'Continue: stomach, chest, hands, arms',
          'Finish with shoulders, neck, face',
          'Notice the difference between tension and relaxation',
          'Breathe slowly throughout'
        ]
      },
      {
        name: 'Worry Time',
        duration: '15 minutes',
        description: 'Contain anxiety by scheduling time to process worries.',
        steps: [
          'Set aside 15 minutes daily at the same time',
          'Write down all your worries',
          'During the day, tell yourself "I\'ll think about that at worry time"',
          'In worry time, review each worry',
          'For each: Can I control this? If yes, make a plan. If no, let it go.',
          'When time is up, close your notebook and move on'
        ]
      }
    ]
  },
  {
    category: 'Sleep & Relaxation',
    icon: Moon,
    color: 'indigo',
    techniques: [
      {
        name: 'Body Scan Meditation',
        duration: '10 minutes',
        description: 'Promotes deep relaxation and better sleep.',
        steps: [
          'Lie down in a comfortable position',
          'Close your eyes and breathe naturally',
          'Focus on your toes - notice any sensations',
          'Slowly move attention up through each body part',
          'Don\'t try to change anything, just observe',
          'If mind wanders, gently return to body awareness',
          'End by wiggling fingers and toes, then stretch'
        ]
      },
      {
        name: 'Sleep Hygiene Routine',
        duration: 'Ongoing',
        description: 'Improves sleep quality for better energy.',
        steps: [
          'Same bedtime and wake time daily (even weekends)',
          'No screens 1 hour before bed',
          'Keep bedroom cool (60-67°F)',
          'Use bedroom only for sleep',
          'No caffeine after 2 PM',
          'Write tomorrow\'s to-do list before bed (clear mind)',
          'If awake 20+ minutes, leave bed until sleepy'
        ]
      }
    ]
  },
  {
    category: 'Emotional Processing',
    icon: Brain,
    color: 'purple',
    techniques: [
      {
        name: 'Feelings Journal',
        duration: '10 minutes',
        description: 'Process emotions in a healthy, structured way.',
        steps: [
          'Write: "Today I feel..." and name the emotion',
          'Rate intensity 1-10',
          'Write: "This feeling started when..."',
          'Write: "This feeling is telling me..."',
          'Write: "What I need right now is..."',
          'No judgments - all feelings are valid',
          'Review weekly to spot patterns'
        ]
      },
      {
        name: 'Self-Compassion Break',
        duration: '5 minutes',
        description: 'Practice kindness toward yourself in difficult moments.',
        steps: [
          'Acknowledge: "This is a moment of suffering"',
          'Remind: "Suffering is part of life. I\'m not alone."',
          'Place hand on heart or hug yourself',
          'Say: "May I be kind to myself"',
          'Say: "May I give myself the compassion I need"',
          'Ask: "What do I need right now?"',
          'Give yourself permission to meet that need'
        ]
      }
    ]
  }
];

// Static class maps — Tailwind purges dynamically built class names.
const CAT_BG_SOFT = { blue: 'bg-brand-sky', teal: 'bg-muted', amber: 'bg-muted', rose: 'bg-muted', indigo: 'bg-brand-sky', purple: 'bg-muted' };
const CAT_TEXT = { blue: 'text-primary', teal: 'text-brand-secondary', amber: 'text-primary', rose: 'text-destructive', indigo: 'text-primary', purple: 'text-primary' };
const CAT_BORDER_SOFT = { blue: 'border-primary', teal: 'border-brand-secondary', amber: 'border-primary', rose: 'border-destructive', indigo: 'border-primary', purple: 'border-primary' };
const CAT_BG_TINT = { blue: 'bg-muted', teal: 'bg-muted', amber: 'bg-muted', rose: 'bg-muted', indigo: 'bg-muted', purple: 'bg-muted' };
const CAT_BG_SOLID = { blue: 'bg-primary', teal: 'bg-brand-secondary', amber: 'bg-primary', rose: 'bg-destructive', indigo: 'bg-primary', purple: 'bg-primary' };

const quickExercises = [
  {
    name: 'Mini Breathing Break',
    icon: Wind,
    duration: '2 min',
    color: 'blue',
    instructions: 'Take 10 slow, deep breaths. Count to 4 on inhale, 6 on exhale.'
  },
  {
    name: 'Stretch & Release',
    icon: Waves,
    duration: '3 min',
    color: 'teal',
    instructions: 'Stand up. Roll shoulders back 5x. Stretch arms overhead. Touch toes gently.'
  },
  {
    name: 'Gratitude Moment',
    icon: Sparkles,
    duration: '1 min',
    color: 'amber',
    instructions: 'Think of 3 small things you\'re grateful for right now. Really feel it.'
  },
  {
    name: 'Self-Compassion',
    icon: Heart,
    duration: '2 min',
    color: 'rose',
    instructions: 'Place hand on heart. Say: "I\'m doing my best. That\'s enough."'
  }
];

export default function WellnessResources({ embedded = false }) {
  useSEO({
    title: 'Stress Relief, Breathing & Coping Techniques at Work',
    description:
      'Quick 3-minute desk exercises, grounding techniques, sleep hygiene habits, and cognitive strategies to manage workplace stress after cancer treatment.',
    path: '/WellnessResources',
    enabled: !embedded,
  });
  const [expandedTechnique, setExpandedTechnique] = useState(null);

  const toggleTechnique = (category, techniqueName) => {
    const key = `${category}-${techniqueName}`;
    setExpandedTechnique(expandedTechnique === key ? null : key);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Header */}
      {!embedded && (
        <div className="space-y-4 text-center">
          <h1 className="font-heading text-4xl font-bold text-foreground">
            Workplace Stress Relief &amp; Wellness Techniques
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Science-backed breathing, grounding, sleep, and cognitive techniques for cancer survivors at work
          </p>
        </div>
      )}

      {/* Quick Exercises */}
      <Card className="nv-card--muted">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span>Quick Relief (Under 3 Minutes)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {quickExercises.map((exercise) => {
              const Icon = exercise.icon;
              return (
                <Card key={exercise.name}>
                  <CardContent className="space-y-3 pt-6 text-center">
                    <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-pill ${CAT_BG_SOFT[exercise.color]}`}>
                      <Icon className={`h-8 w-8 ${CAT_TEXT[exercise.color]}`} />
                    </div>
                    <h3 className="font-bold text-foreground">{exercise.name}</h3>
                    <Badge variant="secondary">{exercise.duration}</Badge>
                    <p className="text-sm text-muted-foreground">{exercise.instructions}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Techniques */}
      <div className="space-y-6">
        {copingMechanisms.map((category) => {
          const Icon = category.icon;
          return (
            <Card key={category.category}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <div className={`rounded-brand p-2 ${CAT_BG_SOFT[category.color]}`}>
                    <Icon className={`h-6 w-6 ${CAT_TEXT[category.color]}`} />
                  </div>
                  <span className="text-foreground">{category.category}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {category.techniques.map((technique) => {
                  const isExpanded = expandedTechnique === `${category.category}-${technique.name}`;
                  return (
                    <div key={technique.name} className={`overflow-hidden rounded-brand border-2 transition-all ${
                      isExpanded ? `${CAT_BORDER_SOFT[category.color]} ${CAT_BG_TINT[category.color]}` : 'border-border bg-brand-surface'
                    }`}>
                      <button
                        onClick={() => toggleTechnique(category.category, technique.name)}
                        aria-expanded={isExpanded}
                        className="min-h-11 w-full p-4 text-left transition-colors hover:bg-muted"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="mb-1 font-bold text-foreground">{technique.name}</h4>
                            <p className="mb-2 text-sm text-muted-foreground">{technique.description}</p>
                            <Badge variant="outline" className="text-xs">{technique.duration}</Badge>
                          </div>
                          <CheckCircle2 className={`h-6 w-6 transition-transform ${
                            isExpanded ? 'rotate-90 text-brand-secondary' : 'text-muted-foreground'
                          }`} />
                        </div>
                      </button>
                      
                      {isExpanded && (
                        <div className="border-t border-border bg-muted p-4">
                          <h5 className="mb-3 text-sm font-semibold text-muted-foreground">Step-by-Step:</h5>
                          <ol className="space-y-2">
                            {technique.steps.map((step, idx) => (
                              <li key={idx} className="flex items-start space-x-3">
                                <Badge className={`${CAT_BG_SOLID[category.color]} ${category.color === 'teal' ? 'text-secondary-foreground' : 'text-primary-foreground'} shrink-0 rounded-pill`}>
                                  {idx + 1}
                                </Badge>
                                <span className="text-sm text-foreground">{step}</span>
                              </li>
                            ))}
                          </ol>
                        </div>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Important Note */}
      <Card className="nv-card--muted">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <Heart className="mt-1 h-6 w-6 flex-shrink-0 text-primary" />
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">These Techniques Take Practice</h3>
              <p className="text-sm text-muted-foreground">
                Don't expect instant results. Like any skill, these techniques become more effective with regular practice. 
                Start with one technique and practice it daily for a week. If you're struggling with severe anxiety or depression, 
                please reach out to a mental health professional - these tools complement but don't replace professional care.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}