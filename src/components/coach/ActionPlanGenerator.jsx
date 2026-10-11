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
import { parseISO } from 'date-fns';

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

      const response = (await base44.functions.invoke('aiGateway', {
        operation: 'action_plan',
        data: {
          journey_stage: context.journey_stage,
          completed_items: context.completed_items,
          energy_logs_count: context.energy_logs_count,
          avgEnergy: avgEnergy ? avgEnergy.toFixed(1) : null,
          avgStress: avgStress ? avgStress.toFixed(1) : null,
          accommodations_requested: context.accommodations_requested,
          return_date: context.return_date ? parseISO(context.return_date).toLocaleDateString() : 'Not set',
          has_calendar_events: context.has_calendar_events,
        },
      })).data.result;

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
    <Card className="nv-card--muted">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-lg">
          <Target className="h-5 w-5 text-primary" />
          <span>Personalized Action Plan</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!actionPlan ? (
          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Generate a custom 30-day action plan based on your progress, energy levels, and goals.
            </p>
            <Button
              onClick={generateActionPlan}
              disabled={isGenerating}
              className="!whitespace-normal"
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
              <h3 className="text-xl font-bold text-foreground mb-2">{actionPlan.title}</h3>
              <p className="text-sm text-muted-foreground">{actionPlan.overview}</p>
            </div>

            {/* Weeks 1-2 Goals */}
            <div className="nv-card p-4 space-y-2">
              <div className="flex items-center space-x-2 mb-3">
                <Calendar className="h-4 w-4 text-primary" />
                <h4 className="font-semibold text-foreground">Weeks 1-2 Goals</h4>
              </div>
              {actionPlan.week_1_2_goals.map((goal, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-foreground">{goal}</span>
                </div>
              ))}
            </div>

            {/* Weeks 3-4 Goals */}
            <div className="nv-card p-4 space-y-2">
              <div className="flex items-center space-x-2 mb-3">
                <Calendar className="h-4 w-4 text-primary" />
                <h4 className="font-semibold text-foreground">Weeks 3-4 Goals</h4>
              </div>
              {actionPlan.week_3_4_goals.map((goal, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-foreground">{goal}</span>
                </div>
              ))}
            </div>

            {/* Key Focus Areas */}
            <div className="nv-card p-4 space-y-3">
              <div className="flex items-center space-x-2 mb-3">
                <Target className="h-4 w-4 text-primary" />
                <h4 className="font-semibold text-foreground">Key Focus Areas</h4>
              </div>
              {actionPlan.key_focus_areas.map((area, index) => (
                <div key={index}>
                  <p className="font-medium text-sm text-foreground">{area.area}</p>
                  <p className="text-xs text-muted-foreground ml-4">{area.why}</p>
                </div>
              ))}
            </div>

            {/* Daily Practices */}
            <div className="nv-card p-4 space-y-2">
              <div className="flex items-center space-x-2 mb-3">
                <TrendingUp className="h-4 w-4 text-primary" />
                <h4 className="font-semibold text-foreground">Daily Practices</h4>
              </div>
              {actionPlan.daily_practices.map((practice, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <Badge variant="outline" className="rounded-pill bg-brand-surface text-xs">{index + 1}</Badge>
                  <span className="text-sm text-foreground">{practice}</span>
                </div>
              ))}
            </div>

            {/* Encouragement */}
            <div className="nv-card nv-card--pink p-4">
              <p className="text-sm text-foreground font-medium">{actionPlan.encouragement}</p>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <Button
                onClick={downloadPlan}
                variant="outline"
                size="sm"
                className="flex-1 !whitespace-normal"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button
                onClick={discussWithCoach}
                variant="outline"
                size="sm"
                className="flex-1 !whitespace-normal"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Discuss
              </Button>
              <Button
                onClick={generateActionPlan}
                variant="outline"
                size="sm"
                className="flex-1 !whitespace-normal"
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