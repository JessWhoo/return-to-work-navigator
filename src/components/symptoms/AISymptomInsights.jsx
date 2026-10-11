import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, TrendingUp, AlertCircle, Lightbulb, Loader2, RefreshCw, Activity, Zap } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export default function AISymptomInsights({ symptomRecords, progress }) {
  const [isExpanded, setIsExpanded] = useState(true);

  const { data: insights, isLoading, refetch } = useQuery({
    queryKey: ['aiSymptomInsights', symptomRecords?.length],
    queryFn: async () => {
      if (!symptomRecords || symptomRecords.length === 0) return null;

      // Get recent energy logs for correlation
      const recentEnergyLogs = progress?.energy_logs?.slice(-14) || [];

      // Prepare symptom data
      const symptomData = symptomRecords.slice(0, 30).map(r => ({
        date: r.date,
        title: r.title,
        types: r.symptom_details?.symptom_type || [],
        severity: r.symptom_details?.severity,
        duration: r.symptom_details?.duration,
        triggers: r.symptom_details?.triggers,
        relief: r.symptom_details?.relief_measures,
        notes: r.content
      }));

      // Build prompt for AI
      const symptomLogsText = symptomData.map(s =>
        `${s.date}: ${s.title} - Types: ${s.types.join(', ') || 'N/A'}, Severity: ${s.severity}/10, Duration: ${s.duration || 'N/A'}${s.triggers ? `, Triggers: ${s.triggers}` : ''}${s.relief ? `, Relief: ${s.relief}` : ''}`
      ).join('\n');
      const recentEnergyText = recentEnergyLogs.map(log =>
        `${log.date}: Energy ${((log.morning_energy + log.afternoon_energy + log.evening_energy) / 3).toFixed(1)}/10, Mood: ${log.mood}, Stress: ${log.stress_level}/10`
      ).join('\n');
      const response = (await base44.functions.invoke('aiGateway', {
        operation: 'symptom_insights',
        data: { symptomLogsText, recentEnergyText },
      })).data.result;

      // Track insights generation (non-blocking)
      try {
        base44.analytics.track({
          eventName: 'ai_symptom_insights_generated',
          properties: {
            overall_assessment: response.overall_assessment,
            patterns_found: response.recurring_patterns?.length || 0,
            concerns_count: response.concerns?.length || 0
          }
        });
      } catch (error) {
        console.error('Analytics tracking failed:', error);
      }

      return response;
    },
    enabled: !!symptomRecords && symptomRecords.length > 0,
    staleTime: 10 * 60 * 1000,
    retry: 1
  });

  if (!symptomRecords || symptomRecords.length === 0) {
    return null;
  }

  const assessmentConfig = {
    stable: { icon: Activity, color: 'text-primary', bg: 'nv-card--muted', border: 'border-brand-border' },
    improving: { icon: TrendingUp, color: 'text-brand-text', bg: 'nv-card--sage', border: 'border-brand-border' },
    fluctuating: { icon: Zap, color: 'text-primary', bg: 'nv-card--pink', border: 'border-brand-border' },
    concerning: { icon: AlertCircle, color: 'text-destructive', bg: 'nv-card--pink', border: '!border-destructive' }
  };

  const config = assessmentConfig[insights?.overall_assessment] || assessmentConfig.stable;
  const AssessmentIcon = config.icon;

  return (
    <Card className="nv-card--muted">
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <CardTitle className="flex min-w-0 flex-wrap items-center gap-2 text-lg sm:text-xl">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="text-brand-text">AI Symptom Pattern Analysis</span>
            <Badge variant="secondary" className="rounded-pill">
              Powered by AI
            </Badge>
          </CardTitle>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Refresh symptom pattern analysis"
              onClick={() => refetch()}
              disabled={isLoading}
              className="shrink-0"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              aria-expanded={isExpanded}
              className="shrink-0"
            >
              {isExpanded ? 'Collapse' : 'Expand'}
            </Button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-4 [overflow-wrap:anywhere]">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center space-y-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                <p className="text-sm text-brand-muted-foreground">Analyzing symptom patterns...</p>
              </div>
            </div>
          ) : insights ? (
            <>
              {/* Overall Assessment */}
              <div className={`nv-card ${config.bg} ${config.border} p-4`}>
                <div className="flex items-start space-x-3">
                  <AssessmentIcon className={`mt-0.5 h-6 w-6 shrink-0 ${config.color}`} strokeWidth={1.75} aria-hidden="true" />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-brand-text mb-1 capitalize">
                      {insights.overall_assessment} Pattern
                    </h3>
                    <p className="text-sm text-brand-text">{insights.summary}</p>
                  </div>
                </div>
              </div>

              {/* Recurring Patterns */}
              {insights.recurring_patterns && insights.recurring_patterns.length > 0 && (
                <div className="nv-card p-4">
                  <h4 className="font-semibold text-primary mb-3 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Recurring Patterns Detected
                  </h4>
                  <div className="space-y-2">
                    {insights.recurring_patterns.map((pattern, idx) => (
                      <div key={idx} className="nv-card p-3">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <p className="text-sm font-medium text-brand-text">{pattern.pattern}</p>
                          <Badge variant="outline" className="rounded-pill text-xs">
                            {pattern.frequency}
                          </Badge>
                        </div>
                        <p className="text-xs text-brand-muted-foreground">{pattern.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Correlations */}
              {insights.correlations && insights.correlations.length > 0 && (
                <div className="nv-card nv-card--muted p-4">
                  <h4 className="font-semibold text-primary mb-3 flex items-center">
                    <Zap className="h-4 w-4 mr-2" />
                    Energy & Mood Correlations
                  </h4>
                  <div className="space-y-2">
                    {insights.correlations.map((correlation, idx) => (
                      <div key={idx} className="flex items-start space-x-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-brand-text">{correlation.correlation}</p>
                          <p className="text-xs text-brand-muted-foreground">{correlation.insight}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Identified Triggers */}
              {insights.identified_triggers && insights.identified_triggers.length > 0 && (
                <div className="nv-card nv-card--pink p-4">
                  <h4 className="font-semibold text-brand-text mb-3 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Potential Triggers
                  </h4>
                  <div className="space-y-2">
                    {insights.identified_triggers.map((trigger, idx) => (
                      <div key={idx} className="nv-card p-3">
                        <p className="text-sm font-medium text-brand-text mb-1">{trigger.trigger}</p>
                        <p className="text-xs text-brand-muted-foreground">{trigger.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Concerns */}
              {insights.concerns && insights.concerns.length > 0 && (
                <div className="nv-card nv-card--pink !border-destructive p-4">
                  <h4 className="font-semibold text-destructive mb-2 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Patterns Requiring Attention
                  </h4>
                  <ul className="space-y-1">
                    {insights.concerns.map((concern, idx) => (
                      <li key={idx} className="text-sm text-brand-text flex items-start">
                        <span className="text-destructive mr-2">•</span>
                        {concern}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Management Tips */}
              {insights.management_tips && insights.management_tips.length > 0 && (
                <div className="nv-card nv-card--sage p-4">
                  <h4 className="font-semibold text-brand-text mb-3 flex items-center">
                    <Lightbulb className="h-4 w-4 mr-2" />
                    Personalized Management Tips
                  </h4>
                  <div className="space-y-3">
                    {insights.management_tips.map((item, idx) => (
                      <div key={idx} className="nv-card p-3">
                        <p className="text-sm font-medium text-brand-text mb-1">{item.tip}</p>
                        <p className="text-xs text-brand-muted-foreground">{item.rationale}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Accommodation Suggestions */}
              {insights.accommodation_suggestions && insights.accommodation_suggestions.length > 0 && (
                <div className="nv-card p-4">
                  <h4 className="font-semibold text-primary mb-2 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Suggested Workplace Adjustments
                  </h4>
                  <ul className="space-y-1">
                    {insights.accommodation_suggestions.map((suggestion, idx) => (
                      <li key={idx} className="text-sm text-brand-text flex items-start">
                        <span className="text-primary mr-2">→</span>
                        {suggestion}
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