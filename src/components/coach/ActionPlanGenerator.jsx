import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, Loader2, CheckCircle2, Target, Calendar, 
  TrendingUp, Download, Share2
} from 'lucide-react';
import { toast } from 'sonner';

export default function ActionPlanGenerator({ progress, onSendToCoach }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [actionPlan, setActionPlan] = useState(null);

  const generateActionPlan = async () => {
    setIsGenerating(true);
    
    try {
      // Prepare context for AI
      const context = {
        journey_stage: progress?.journey_stage || 'planning',
        completed_items: progress?.completed_checklist_items?.length || 0,
        energy_logs_count: progress?.energy_logs?.length || 0,
        accommodations_requested: progress?.accommodations_requested?.length || 0,
        return_date: progress?.return_date,
        recent_energy: progress?.energy_logs?.slice(-7),
        has_calendar_events: (progress?.calendar_events?.length || 0) > 0
      };

      // Calculate average recent energy and stress
      const recentLogs = progress?.energy_logs?.slice(-7) || [];
      const avgEnergy = recentLogs.length > 0 
        ? recentLogs.reduce((sum, log) => sum + ((log.morning_energy + log.afternoon_energy + log.evening_energy) / 3), 0) / recentLogs.length
        : null;
      const avgStress = recentLogs.length > 0
        ? recentLogs.reduce((sum, log) => sum + (log.stress_level || 5), 0) / recentLogs.length
        : null;

      const prompt = `You are a supportive return-to-work coach for cancer survivors. Generate a personalized 30-day action plan based on this user's data:

Journey Stage: ${context.journey_stage}
Checklist Items Completed: ${context.completed_items}
Energy Tracking: ${context.energy_logs_count} days logged${avgEnergy ? `, avg energy ${avgEnergy.toFixed(1)}/10` : ''}
Stress Level: ${avgStress ? `${avgStress.toFixed(1)}/10` : 'Not tracked'}
Accommodations Requested: ${context.accommodations_requested}
Return Date: ${context.return_date ? new Date(context.return_date).toLocaleDateString() : 'Not set'}
Has Calendar Events: ${context.has_calendar_events ? 'Yes' : 'No'}

Create a supportive, actionable 30-day plan with:
1. Week 1-2 Goals (3-4 specific, achievable goals)
2. Week 3-4 Goals (3-4 specific, achievable goals)
3. Key Focus Areas (3-4 areas to prioritize)
4. Daily Practices (3-4 simple daily habits)
5. Success Metrics (how they'll know they're making progress)

Be encouraging, realistic, and specific to their current stage. Focus on gradual progress and self-care.`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            overview: { type: 'string' },
            week_1_2_goals: {
              type: 'array',
              items: { type: 'string' }
            },
            week_3_4_goals: {
              type: 'array',
              items: { type: 'string' }
            },
            key_focus_areas: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  area: { type: 'string' },
                  why: { type: 'string' }
                }
              }
            },
            daily_practices: {
              type: 'array',
              items: { type: 'string' }
            },
            success_metrics: {
              type: 'array',
              items: { type: 'string' }
            },
            encouragement: { type: 'string' }
          }
        }
      });

      setActionPlan(response);
      toast.success('Action plan generated!');
    } catch (error) {
      console.error('Error generating action plan:', error);
      toast.error('Failed to generate action plan');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadPlan = () => {
    if (!actionPlan) return;

    const planText = `${actionPlan.title}

${actionPlan.overview}

WEEKS 1-2 GOALS:
${actionPlan.week_1_2_goals.map((goal, i) => `${i + 1}. ${goal}`).join('\n')}

WEEKS 3-4 GOALS:
${actionPlan.week_3_4_goals.map((goal, i) => `${i + 1}. ${goal}`).join('\n')}

KEY FOCUS AREAS:
${actionPlan.key_focus_areas.map(area => `• ${area.area}\n  Why: ${area.why}`).join('\n\n')}

DAILY PRACTICES:
${actionPlan.daily_practices.map((practice, i) => `${i + 1}. ${practice}`).join('\n')}

SUCCESS METRICS:
${actionPlan.success_metrics.map(metric => `✓ ${metric}`).join('\n')}

${actionPlan.encouragement}

Generated on ${new Date().toLocaleDateString()}`;

    const blob = new Blob([planText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '30-day-action-plan.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Action plan downloaded!');
  };

  const discussWithCoach = () => {
    if (!actionPlan) return;
    const message = `I just generated a 30-day action plan. Here's the overview:\n\n${actionPlan.overview}\n\nCan you help me understand how to implement these goals and adjust them if needed?`;
    onSendToCoach(message);
  };

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-lg">
          <Target className="h-5 w-5 text-purple-600" />
          <span>Personalized Action Plan</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!actionPlan ? (
          <div className="text-center space-y-4">
            <p className="text-sm text-gray-700">
              Generate a custom 30-day action plan based on your progress, energy levels, and goals.
            </p>
            <Button
              onClick={generateActionPlan}
              disabled={isGenerating}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate My Action Plan
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Overview */}
            <div>
              <h3 className="text-xl font-bold text-purple-900 mb-2">{actionPlan.title}</h3>
              <p className="text-sm text-gray-700">{actionPlan.overview}</p>
            </div>

            {/* Weeks 1-2 Goals */}
            <div className="bg-white/60 rounded-lg p-4 space-y-2">
              <div className="flex items-center space-x-2 mb-3">
                <Calendar className="h-4 w-4 text-purple-600" />
                <h4 className="font-semibold text-purple-900">Weeks 1-2 Goals</h4>
              </div>
              {actionPlan.week_1_2_goals.map((goal, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-800">{goal}</span>
                </div>
              ))}
            </div>

            {/* Weeks 3-4 Goals */}
            <div className="bg-white/60 rounded-lg p-4 space-y-2">
              <div className="flex items-center space-x-2 mb-3">
                <Calendar className="h-4 w-4 text-pink-600" />
                <h4 className="font-semibold text-pink-900">Weeks 3-4 Goals</h4>
              </div>
              {actionPlan.week_3_4_goals.map((goal, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-pink-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-800">{goal}</span>
                </div>
              ))}
            </div>

            {/* Key Focus Areas */}
            <div className="bg-white/60 rounded-lg p-4 space-y-3">
              <div className="flex items-center space-x-2 mb-3">
                <Target className="h-4 w-4 text-purple-600" />
                <h4 className="font-semibold text-purple-900">Key Focus Areas</h4>
              </div>
              {actionPlan.key_focus_areas.map((area, index) => (
                <div key={index}>
                  <p className="font-medium text-sm text-gray-900">{area.area}</p>
                  <p className="text-xs text-gray-600 ml-4">{area.why}</p>
                </div>
              ))}
            </div>

            {/* Daily Practices */}
            <div className="bg-white/60 rounded-lg p-4 space-y-2">
              <div className="flex items-center space-x-2 mb-3">
                <TrendingUp className="h-4 w-4 text-pink-600" />
                <h4 className="font-semibold text-pink-900">Daily Practices</h4>
              </div>
              {actionPlan.daily_practices.map((practice, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <Badge variant="outline" className="bg-white text-xs">{index + 1}</Badge>
                  <span className="text-sm text-gray-800">{practice}</span>
                </div>
              ))}
            </div>

            {/* Encouragement */}
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-4 border-2 border-purple-200">
              <p className="text-sm text-purple-900 font-medium">{actionPlan.encouragement}</p>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={downloadPlan}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button
                onClick={discussWithCoach}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Discuss
              </Button>
              <Button
                onClick={generateActionPlan}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Regenerate
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}