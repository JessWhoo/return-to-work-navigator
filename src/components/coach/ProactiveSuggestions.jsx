import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Lightbulb, AlertCircle, TrendingDown, Calendar, 
  Heart, CheckCircle2, Sparkles, ArrowRight
} from 'lucide-react';

const ProactiveSuggestion = ({ suggestion, onApply }) => {
  const typeConfig = {
    energy: { 
      icon: TrendingDown, 
      color: 'amber',
      gradient: 'from-amber-500 to-orange-500',
      bg: 'bg-amber-50',
      border: 'border-amber-200'
    },
    checklist: { 
      icon: CheckCircle2, 
      color: 'green',
      gradient: 'from-green-500 to-emerald-500',
      bg: 'bg-green-50',
      border: 'border-green-200'
    },
    emotional: { 
      icon: Heart, 
      color: 'rose',
      gradient: 'from-rose-500 to-pink-500',
      bg: 'bg-rose-50',
      border: 'border-rose-200'
    },
    wellness: { 
      icon: Sparkles, 
      color: 'purple',
      gradient: 'from-purple-500 to-pink-500',
      bg: 'bg-purple-50',
      border: 'border-purple-200'
    },
    stage: { 
      icon: Calendar, 
      color: 'blue',
      gradient: 'from-blue-500 to-indigo-500',
      bg: 'bg-blue-50',
      border: 'border-blue-200'
    },
    insight: { 
      icon: Lightbulb, 
      color: 'purple',
      gradient: 'from-purple-500 to-violet-500',
      bg: 'bg-purple-50',
      border: 'border-purple-200'
    }
  };

  const config = typeConfig[suggestion.type] || typeConfig.insight;
  const Icon = config.icon;

  return (
    <Card className={`${config.bg} border-2 ${config.border} hover:shadow-lg transition-all`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg bg-gradient-to-br ${config.gradient}`}>
              <Icon className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-base font-bold text-gray-800">
                {suggestion.title}
              </CardTitle>
              {suggestion.priority === 'high' && (
                <Badge className="mt-1 bg-red-500 text-white text-xs">Needs Attention</Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-gray-700 leading-relaxed">{suggestion.insight}</p>
        
        {suggestion.actions && suggestion.actions.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-600 uppercase">Suggested Actions:</p>
            <ul className="space-y-1">
              {suggestion.actions.map((action, idx) => (
                <li key={idx} className="flex items-start space-x-2 text-sm text-gray-700">
                  <ArrowRight className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {suggestion.resources && suggestion.resources.length > 0 && (
          <div className="pt-2 border-t border-gray-200">
            <p className="text-xs font-semibold text-gray-600 uppercase mb-2">Helpful Resources:</p>
            <div className="flex flex-wrap gap-2">
              {suggestion.resources.map((resource, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {resource}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {onApply && (
          <Button
            onClick={() => onApply(suggestion)}
            size="sm"
            className={`w-full bg-gradient-to-r ${config.gradient} hover:opacity-90 text-white`}
          >
            Ask Coach About This
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default function ProactiveSuggestions({ progress, onSelectSuggestion }) {
  const generateSuggestions = () => {
    const suggestions = [];
    
    if (!progress) return suggestions;

    // Energy pattern analysis
    if (progress.energy_logs && progress.energy_logs.length > 0) {
      const recentLogs = progress.energy_logs.slice(-7);
      const avgEnergy = recentLogs.reduce((sum, log) => {
        const dayAvg = (log.morning_energy + log.afternoon_energy + log.evening_energy) / 3;
        return sum + dayAvg;
      }, 0) / recentLogs.length;

      if (avgEnergy < 5 && progress.accommodations_requested?.length === 0) {
        suggestions.push({
          type: 'energy',
          priority: 'high',
          title: 'Low Energy Pattern Detected',
          insight: `Your average energy level is ${avgEnergy.toFixed(1)}/10. You may benefit from workplace accommodations.`,
          actions: [
            'Request flexible work hours or reduced schedule',
            'Ask about work-from-home options',
            'Schedule important tasks during your peak energy times'
          ],
          resources: ['Accommodations Page', 'Job Accommodation Network', 'Energy Management Tips']
        });
      }

      // Check for afternoon dips
      const afternoonDips = recentLogs.filter(log => 
        log.afternoon_energy < log.morning_energy - 2
      ).length;
      
      if (afternoonDips >= 4) {
        suggestions.push({
          type: 'energy',
          priority: 'medium',
          title: 'Afternoon Energy Dips',
          insight: 'You consistently experience afternoon fatigue. This is very common after cancer treatment.',
          actions: [
            'Schedule challenging work in the morning',
            'Take a short rest break after lunch',
            'Consider adjusting your lunch to lighter, energizing foods'
          ],
          resources: ['Energy & Fatigue Page', 'Pacing Strategies']
        });
      }
    }

    // Checklist stagnation
    const completedCount = progress.completed_checklist_items?.length || 0;
    if (progress.journey_stage === 'planning' && completedCount < 3) {
      suggestions.push({
        type: 'checklist',
        priority: 'high',
        title: 'Get Started with Your Checklist',
        insight: "You're in the planning stage. Let's build momentum by completing a few foundational items.",
        actions: [
          'Review your legal rights (ADA, FMLA)',
          'Gather medical documentation',
          'Start thinking about what accommodations you might need'
        ],
        resources: ['My Checklist', 'Legal Rights Page', 'Communication Templates']
      });
    }

    // Journey stage guidance
    if (progress.journey_stage === 'first_week') {
      suggestions.push({
        type: 'stage',
        priority: 'medium',
        title: 'First Week Survival Tips',
        insight: "You're in your first week back! This is often the hardest part. Be gentle with yourself.",
        actions: [
          'Focus on just getting through each day',
          'Use your energy tracking to identify patterns',
          'Don\'t hesitate to use your accommodations',
          'Check in with your supervisor about workload'
        ],
        resources: ['Energy Management', 'Communication Tools', 'Emotional Support']
      });
    }

    // Mood and stress analysis
    if (progress.energy_logs && progress.energy_logs.length > 0) {
      const recentLogs = progress.energy_logs.slice(-7);
      
      // Check for low mood patterns
      const lowMoodCount = recentLogs.filter(log => 
        log.mood === 'very_low' || log.mood === 'low'
      ).length;
      
      if (lowMoodCount >= 4) {
        suggestions.push({
          type: 'wellness',
          priority: 'high',
          title: 'Mood Support Needed',
          insight: 'You\'ve had several days of low mood recently. This is understandable, but let\'s find some relief.',
          actions: [
            'Try the 5-4-3-2-1 grounding technique when overwhelmed',
            'Practice daily gratitude - even small things count',
            'Consider reaching out to a therapist or counselor',
            'Use the Self-Compassion Break exercise'
          ],
          resources: ['Wellness Resources', 'Emotional Support', 'CancerCare Counseling']
        });
      }
      
      // Check for high stress patterns
      const avgStress = recentLogs.reduce((sum, log) => sum + (log.stress_level || 5), 0) / recentLogs.length;
      
      if (avgStress >= 7) {
        suggestions.push({
          type: 'wellness',
          priority: 'high',
          title: 'High Stress Levels Detected',
          insight: `Your average stress level is ${avgStress.toFixed(1)}/10. Let's work on stress reduction techniques.`,
          actions: [
            'Practice Box Breathing for 5 minutes daily',
            'Try Progressive Muscle Relaxation before bed',
            'Schedule "Worry Time" to contain anxiety',
            'Consider workplace accommodations to reduce pressure'
          ],
          resources: ['Wellness Resources', 'Energy Management', 'Accommodations']
        });
      }
    }

    // Emotional support check
    if (!progress.bookmarked_resources?.some(r => r.includes('Emotional')) && completedCount > 5) {
      suggestions.push({
        type: 'emotional',
        priority: 'medium',
        title: 'Don\'t Forget Emotional Well-being',
        insight: 'Returning to work after cancer is emotionally challenging. Support resources can help.',
        actions: [
          'Explore anxiety management techniques',
          'Consider joining a support group',
          'Practice self-compassion daily'
        ],
        resources: ['Emotional Support Page', 'Wellness Resources', 'CancerCare']
      });
    }

    // Celebration of progress
    if (completedCount >= 8) {
      suggestions.push({
        type: 'insight',
        priority: 'low',
        title: '🎉 Celebrate Your Progress!',
        insight: `You've completed ${completedCount} checklist items! That's significant progress. Take a moment to acknowledge how far you've come.`,
        actions: [
          'Write down 3 things you\'re proud of',
          'Share your progress with someone supportive',
          'Reward yourself for this milestone'
        ]
      });
    }

    return suggestions;
  };

  const suggestions = generateSuggestions();

  if (suggestions.length === 0) {
    return (
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
        <CardContent className="pt-6 text-center">
          <Sparkles className="h-12 w-12 text-green-500 mx-auto mb-3" />
          <h3 className="font-bold text-gray-800 mb-1">You're Doing Great!</h3>
          <p className="text-sm text-gray-600">
            No urgent suggestions right now. Keep up the good work!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Lightbulb className="h-5 w-5 text-purple-600" />
        <h3 className="font-bold text-gray-800">Insights & Suggestions</h3>
        <Badge variant="secondary" className="ml-auto">{suggestions.length}</Badge>
      </div>
      
      <div className="grid gap-4">
        {suggestions.map((suggestion, idx) => (
          <ProactiveSuggestion
            key={idx}
            suggestion={suggestion}
            onApply={onSelectSuggestion}
          />
        ))}
      </div>
    </div>
  );
}