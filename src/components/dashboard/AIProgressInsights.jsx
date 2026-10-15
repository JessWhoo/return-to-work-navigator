import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, TrendingUp, TrendingDown, AlertCircle, CheckCircle, Loader2, RefreshCw, Lightbulb, Activity } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { getCompletedChecklistIds } from '@/components/checklist/checklistData';

export default function AIProgressInsights({ progress }) {
  const [isExpanded, setIsExpanded] = useState(true);

  const { data: insights, isLoading, refetch } = useQuery({
    queryKey: ['aiProgressInsights', progress?.id],
    queryFn: async () => {
      if (!progress) return null;

      // Prepare data for AI analysis (non-medical: energy pacing, mood, stress, and checklist progress only)
      const recentEnergyLogs = progress.energy_logs?.slice(-14) || [];
      
      const analysisData = {
        energy_trends: recentEnergyLogs.map(log => ({
          date: log.date,
          morning: log.morning_energy,
          afternoon: log.afternoon_energy,
          evening: log.evening_energy,
          avg: (log.morning_energy + log.afternoon_energy + log.evening_energy) / 3,
          mood: log.mood,
          stress: log.stress_level,
          notes: log.notes
        })),
        journey_stage: progress.journey_stage,
        return_date: progress.return_date,
        accommodations: progress.accommodations_requested?.length || 0,
        // Scoped to this checklist's ids so the number matches the Checklist page.
        checklist_progress: getCompletedChecklistIds(progress.completed_checklist_items).length,
      };

      const energyTrendsText = analysisData.energy_trends.slice(-14).map(log =>
        `${log.date}: Energy ${log.avg.toFixed(1)}/10 (Morning: ${log.morning}, Afternoon: ${log.afternoon}, Evening: ${log.evening}), Mood: ${log.mood}, Stress: ${log.stress}/10${log.notes ? `, Notes: ${log.notes}` : ''}`
      ).join('\n');
      const response = (await base44.functions.invoke('aiGateway', {
        operation: 'progress_insights',
        data: {
          journey_stage: analysisData.journey_stage,
          return_date: analysisData.return_date,
          accommodations: analysisData.accommodations,
          checklist_progress: analysisData.checklist_progress,
          energyTrendsText,
          recentSymptomsText: '',
        },
      })).data.result;

      // Track insights generation
      base44.analytics.track({
        eventName: 'ai_progress_insights_generated',
        properties: {
          overall_status: response.overall_status,
          concerns_count: response.concerns?.length || 0,
          tips_count: response.personalized_tips?.length || 0
        }
      });

      return response;
    },
    enabled: !!progress && progress.energy_logs?.length > 0,
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes
    retry: 1
  });

  if (!progress || !progress.energy_logs || progress.energy_logs.length === 0) {
    return (
      <Card className="nv-card--muted">
        <CardContent className="pt-6 text-center">
          <Sparkles className="h-12 w-12 text-brand-primary mx-auto mb-3 opacity-50" />
          <p className="text-brand-text text-sm">
            Start logging your energy and mood to receive AI-powered insights
          </p>
        </CardContent>
      </Card>
    );
  }

  const statusConfig = {
    improving: { icon: TrendingUp, color: 'text-brand-primary', bg: 'bg-secondary/30', border: 'border-secondary' },
    stable: { icon: Activity, color: 'text-brand-primary', bg: 'bg-muted', border: 'border-primary' },
    declining: { icon: TrendingDown, color: 'text-brand-primary', bg: 'bg-accent/30', border: 'border-accent' },
    concerning: { icon: AlertCircle, color: 'text-destructive', bg: 'bg-destructive/10', border: 'border-destructive' }
  };

  const config = statusConfig[insights?.overall_status] || statusConfig.stable;
  const StatusIcon = config.icon;

  return (
    <Card className="nv-card--muted">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="flex flex-wrap items-center gap-2">
            <Sparkles className="h-5 w-5 text-brand-primary" />
            <span className="text-brand-text">AI Progress Insights</span>
            <Badge variant="secondary" className="rounded-pill">
              Powered by AI
            </Badge>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => refetch()}
              disabled={isLoading}
              aria-label="Refresh progress insights"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              aria-expanded={isExpanded}
              aria-controls="progress-insights-details"
            >
              {isExpanded ? 'Collapse' : 'Expand'}
            </Button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent id="progress-insights-details" className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center space-y-3">
                <Loader2 className="h-8 w-8 animate-spin text-brand-primary mx-auto" />
                <p className="text-sm text-brand-muted-foreground">Analyzing your progress data...</p>
              </div>
            </div>
          ) : insights ? (
            <>
              {/* Overall Status */}
              <div className={`p-4 rounded-brand border ${config.border} ${config.bg}`}>
                <div className="flex items-start space-x-3">
                  <StatusIcon className={`h-6 w-6 ${config.color} mt-0.5`} />
                  <div className="flex-1">
                    <h3 className="font-semibold text-brand-text mb-1 capitalize">
                      {insights.overall_status} Trajectory
                    </h3>
                    <p className="text-sm text-brand-text">{insights.summary}</p>
                  </div>
                </div>
              </div>

              {/* Trends Analysis */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {insights.energy_trend && (
                  <div className="nv-card p-4">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <Activity className="h-4 w-4 text-brand-primary" />
                      <span className="text-xs font-semibold text-brand-text">Energy Trend</span>
                      <Badge variant="outline" className="text-xs capitalize">
                        {insights.energy_trend.direction}
                      </Badge>
                    </div>
                    <p className="text-xs text-brand-muted-foreground">{insights.energy_trend.insight}</p>
                  </div>
                )}

                {insights.mood_pattern && (
                  <div className="nv-card p-4">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <Sparkles className="h-4 w-4 text-brand-primary" />
                      <span className="text-xs font-semibold text-brand-text">Mood Pattern</span>
                      <Badge variant="outline" className="text-xs capitalize">
                        {insights.mood_pattern.dominant_mood}
                      </Badge>
                    </div>
                    <p className="text-xs text-brand-muted-foreground">{insights.mood_pattern.insight}</p>
                  </div>
                )}

                {insights.stress_analysis && (
                  <div className="nv-card p-4">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-brand-primary" />
                      <span className="text-xs font-semibold text-brand-text">Stress Level</span>
                      <Badge variant="outline" className="text-xs">
                        {insights.stress_analysis.average_level?.toFixed(1)}/10
                      </Badge>
                    </div>
                    <p className="text-xs text-brand-muted-foreground">{insights.stress_analysis.insight}</p>
                  </div>
                )}
              </div>

              {/* Correlations & Patterns */}
              {insights.correlations && insights.correlations.length > 0 && (
                <div className="nv-card nv-card--sage p-4">
                  <h4 className="font-semibold text-brand-primary mb-2 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Identified Patterns
                  </h4>
                  <div className="space-y-2">
                    {insights.correlations.map((correlation, idx) => (
                      <div key={idx} className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-brand-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-brand-text">{correlation.pattern}</p>
                          <p className="text-xs text-brand-muted-foreground">{correlation.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Concerns */}
              {insights.concerns && insights.concerns.length > 0 && (
                <div className="nv-card nv-card--pink p-4">
                  <h4 className="font-semibold text-brand-primary mb-2 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Areas Requiring Attention
                  </h4>
                  <ul className="space-y-1">
                    {insights.concerns.map((concern, idx) => (
                      <li key={idx} className="text-sm text-brand-text flex items-start">
                        <span className="text-brand-primary mr-2">•</span>
                        {concern}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Personalized Tips */}
              {insights.personalized_tips && insights.personalized_tips.length > 0 && (
                <div className="nv-card nv-card--muted p-4">
                  <h4 className="font-semibold text-brand-primary mb-3 flex items-center">
                    <Lightbulb className="h-4 w-4 mr-2" />
                    Personalized Tips for You
                  </h4>
                  <div className="space-y-3">
                    {insights.personalized_tips.map((item, idx) => (
                      <div key={idx} className="nv-card p-4">
                        <p className="text-sm font-medium text-brand-text mb-1">{item.tip}</p>
                        <p className="text-xs text-brand-muted-foreground">{item.rationale}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended Actions */}
              {insights.recommended_actions && insights.recommended_actions.length > 0 && (
                <div className="nv-card nv-card--sage p-4">
                  <h4 className="font-semibold text-brand-primary mb-2 flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Recommended Next Steps
                  </h4>
                  <ul className="space-y-1">
                    {insights.recommended_actions.map((action, idx) => (
                      <li key={idx} className="text-sm text-brand-text flex items-start">
                        <span className="text-brand-primary mr-2">→</span>
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-brand-muted-foreground">No insights available. Try refreshing.</p>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}