import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Heart, Brain, Wind, Waves, Moon, Sparkles,
  Play, Pause, Volume2, VolumeX, CheckCircle2
} from 'lucide-react';

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

export default function WellnessResources() {
  const [expandedTechnique, setExpandedTechnique] = useState(null);

  const toggleTechnique = (category, techniqueName) => {
    const key = `${category}-${techniqueName}`;
    setExpandedTechnique(expandedTechnique === key ? null : key);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Wellness Resources
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Science-backed techniques for managing stress, improving mood, and enhancing well-being
        </p>
      </div>

      {/* Quick Exercises */}
      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="h-6 w-6 text-purple-600" />
            <span>Quick Relief (Under 3 Minutes)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickExercises.map((exercise) => {
              const Icon = exercise.icon;
              return (
                <Card key={exercise.name} className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all">
                  <CardContent className="pt-6 text-center space-y-3">
                    <div className={`p-3 rounded-full bg-${exercise.color}-100 w-16 h-16 mx-auto flex items-center justify-center`}>
                      <Icon className={`h-8 w-8 text-${exercise.color}-600`} />
                    </div>
                    <h3 className="font-bold text-gray-800">{exercise.name}</h3>
                    <Badge variant="secondary">{exercise.duration}</Badge>
                    <p className="text-sm text-gray-600 leading-relaxed">{exercise.instructions}</p>
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
            <Card key={category.category} className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg bg-${category.color}-100`}>
                    <Icon className={`h-6 w-6 text-${category.color}-600`} />
                  </div>
                  <span>{category.category}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {category.techniques.map((technique) => {
                  const isExpanded = expandedTechnique === `${category.category}-${technique.name}`;
                  return (
                    <div key={technique.name} className={`border-2 rounded-lg overflow-hidden transition-all ${
                      isExpanded ? `border-${category.color}-300 bg-${category.color}-50` : 'border-gray-200 bg-white'
                    }`}>
                      <button
                        onClick={() => toggleTechnique(category.category, technique.name)}
                        className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-800 mb-1">{technique.name}</h4>
                            <p className="text-sm text-gray-600 mb-2">{technique.description}</p>
                            <Badge variant="outline" className="text-xs">{technique.duration}</Badge>
                          </div>
                          <CheckCircle2 className={`h-6 w-6 transition-transform ${
                            isExpanded ? 'rotate-90 text-green-600' : 'text-gray-400'
                          }`} />
                        </div>
                      </button>
                      
                      {isExpanded && (
                        <div className="p-4 border-t border-gray-200 bg-white">
                          <h5 className="font-semibold text-sm text-gray-700 mb-3">Step-by-Step:</h5>
                          <ol className="space-y-2">
                            {technique.steps.map((step, idx) => (
                              <li key={idx} className="flex items-start space-x-3">
                                <Badge className={`bg-${category.color}-500 text-white flex-shrink-0`}>
                                  {idx + 1}
                                </Badge>
                                <span className="text-sm text-gray-700 leading-relaxed">{step}</span>
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
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <Heart className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
            <div className="space-y-2">
              <h3 className="font-semibold text-blue-900">These Techniques Take Practice</h3>
              <p className="text-sm text-blue-800 leading-relaxed">
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