import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, TrendingDown, TrendingUp, AlertTriangle, 
  CheckCircle2, Clock, Zap, Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { parseISO, differenceInDays } from 'date-fns';

export default function SmartInsights({ progress, onAskCoach }) {
  const [insights, setInsights] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (progress) {
      generateInsights();
    }
  }, [progress]);

  const generateInsights = async () => {
    if (!progress) return;

    setIsGenerating(true);
    const generatedInsights = [];

    try {
      // Energy Pattern Analysis
      if (progress.energy_logs && progress.energy_logs.length >= 3) {
        const recentLogs = progress.energy_logs.slice(-7);
        const avgMorning = recentLogs.reduce((sum, log) => sum + log.morning_energy, 0) / recentLogs.length;
        const avgAfternoon = recentLogs.reduce((sum, log) => sum + log.afternoon_energy, 0) / recentLogs.length;
        const avgEvening = recentLogs.reduce((sum, log) => sum + log.evening_energy, 0) / recentLogs.length;

        const bestTime = avgMorning > avgAfternoon && avgMorning > avgEvening ? 'morning' 
          : avgAfternoon > avgEvening ? 'afternoon' : 'evening';

        if (avgMorning < 5 || avgAfternoon < 5 || avgEvening < 5) {
          generatedInsights.push({
            type: 'warning',
            icon: TrendingDown,
            color: 'amber',
            title: 'Low Energy Pattern Detected',
            message: `Your energy levels have been low recently. Your best time is ${bestTime}s (avg ${Math.max(avgMorning, avgAfternoon, avgEvening).toFixed(1)}/10). Consider scheduling important tasks during this window.`,
            action: 'Get energy management tips'
          });
        } else {
          generatedInsights.push({
            type: 'success',
            icon: Zap,
            color: 'green',
            title: 'Energy Pattern Identified',
            message: `You have the most energy in the ${bestTime} (avg ${Math.max(avgMorning, avgAfternoon, avgEvening).toFixed(1)}/10). Schedule important work during this time!`,
            action: 'Optimize my schedule'
          });
        }

        // Stress Analysis
        const avgStress = recentLogs.reduce((sum, log) => sum + (log.stress_level || 5), 0) / recentLogs.length;
        if (avgStress >= 7) {
          generatedInsights.push({
            type: 'alert',
            icon: AlertTriangle,
            color: 'red',
            title: 'Elevated Stress Levels',
            message: `Your average stress is ${avgStress.toFixed(1)}/10. This is quite high. Consider stress-reduction techniques or discussing accommodations with your employer.`,
            action: 'Learn stress management'
          });
        }
      }

      // Return Date Analysis
      if (progress.return_date) {
        const returnDate = parseISO(progress.return_date);
        const daysUntil = differenceInDays(returnDate, new Date());

        if (daysUntil >= 0 && daysUntil <= 14) {
          generatedInsights.push({
            type: 'info',
            icon: Clock,
            color: 'blue',
            title: 'Return Date Approaching',
            message: `Your return date is in ${daysUntil} days. Now is the time to finalize accommodations, review your checklist, and prepare mentally.`,
            action: 'Review my readiness'
          });
        }
      }

      // Checklist Progress
      const completedCount = progress.completed_checklist_items?.length || 0;
      if (completedCount === 0 && progress.journey_stage === 'planning') {
        generatedInsights.push({
          type: 'info',
          icon: CheckCircle2,
          color: 'purple',
          title: 'Get Started with Your Checklist',
          message: 'You haven\'t started your checklist yet. Completing these items will help you feel more prepared and confident.',
          action: 'View checklist'
        });
      } else if (completedCount >= 10) {
        generatedInsights.push({
          type: 'success',
          icon: TrendingUp,
          color: 'green',
          title: 'Great Progress!',
          message: `You've completed ${completedCount} checklist items. You're taking important steps toward a successful return to work!`,
          action: 'See what\'s next'
        });
      }

      // Accommodation Analysis
      if (progress.accommodations_requested && progress.accommodations_requested.length === 0 && progress.journey_stage !== 'completed') {
        generatedInsights.push({
          type: 'info',
          icon: AlertTriangle,
          color: 'orange',
          title: 'Consider Workplace Accommodations',
          message: 'You haven\'t requested any accommodations yet. Most cancer survivors benefit from at least some workplace adjustments.',
          action: 'Explore accommodations'
        });
      }

      // AI-Enhanced Insight
      const recentLogs = progress.energy_logs?.slice(-7) || [];
      if (recentLogs?.length >= 5) {
        try {
          const aiPrompt = `Analyze this cancer survivor's return-to-work data and provide ONE specific, actionable insight:

Journey Stage: ${progress.journey_stage}
Completed Tasks: ${completedCount}
Recent Energy Logs: ${JSON.stringify(recentLogs.map(log => ({
  morning: log.morning_energy,
  afternoon: log.afternoon_energy,
  evening: log.evening_energy,
  stress: log.stress_level,
  mood: log.mood
})))}
Accommodations: ${progress.accommodations_requested?.length || 0}

Provide a SHORT (1-2 sentences), specific insight about their pattern or something they should focus on.`;

          const aiResponse = await base44.integrations.Core.InvokeLLM({
            prompt: aiPrompt
          });

          if (aiResponse) {
            generatedInsights.push({
              type: 'ai',
              icon: Brain,
              color: 'purple',
              title: 'AI-Powered Insight',
              message: aiResponse,
              action: 'Discuss this with coach'
            });
          }
        } catch (error) {
          console.error('Error generating AI insight:', error);
        }
      }

      setInsights(generatedInsights);
    } catch (error) {
      console.error('Error generating insights:', error);
      toast.error('Failed to generate insights');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAction = (insight) => {
    const message = `I saw this insight: "${insight.message}"\n\nCan you help me with this?`;
    onAskCoach(message);
  };

  const colorMap = {
    amber: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800', iconBg: 'bg-amber-500' },
    green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800', iconBg: 'bg-green-500' },
    red: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800', iconBg: 'bg-red-500' },
    blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', iconBg: 'bg-blue-500' },
    purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-800', iconBg: 'bg-purple-500' },
    orange: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-800', iconBg: 'bg-orange-500' }
  };

  if (isGenerating) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardContent className="pt-6 flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
          <span className="ml-2 text-sm text-gray-600">Analyzing your data...</span>
        </CardContent>
      </Card>
    );
  }

  if (insights.length === 0) {
    return null;
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-sm flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-4 w-4 text-purple-600" />
            <span>Smart Insights</span>
          </div>
          <Badge className="bg-purple-500 text-white text-xs">{insights.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {insights.map((insight, index) => {
          const Icon = insight.icon;
          const colors = colorMap[insight.color];
          
          return (
            <div
              key={index}
              className={`${colors.bg} ${colors.border} border-2 rounded-lg p-3 space-y-2`}
            >
              <div className="flex items-start space-x-3">
                <div className={`${colors.iconBg} p-2 rounded-lg flex-shrink-0`}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={`font-semibold text-sm ${colors.text}`}>{insight.title}</h4>
                  <p className="text-xs text-gray-700 mt-1">{insight.message}</p>
                </div>
              </div>
              <Button
                onClick={() => handleAction(insight)}
                variant="outline"
                size="sm"
                className="w-full text-xs"
              >
                {insight.action}
              </Button>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}