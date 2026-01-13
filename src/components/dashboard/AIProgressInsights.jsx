import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, TrendingUp, TrendingDown, AlertCircle, CheckCircle, Loader2, RefreshCw, Lightbulb, Activity } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export default function AIProgressInsights({ progress }) {
  const [isExpanded, setIsExpanded] = useState(true);

  const { data: insights, isLoading, refetch } = useQuery({
    queryKey: ['aiProgressInsights', progress?.id],
    queryFn: async () => {
      if (!progress) return null;

      // Fetch recent records for additional context
      const records = await base44.entities.Record.list('-date', 20);
      
      // Prepare data for AI analysis
      const recentEnergyLogs = progress.energy_logs?.slice(-14) || [];
      const symptomRecords = records.filter(r => r.type === 'symptom');
      
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
        checklist_progress: progress.completed_checklist_items?.length || 0,
        recent_symptoms: symptomRecords.slice(0, 5).map(s => ({
          date: s.date,
          type: s.symptom_details?.symptom_type,
          severity: s.symptom_details?.severity,
          triggers: s.symptom_details?.triggers
        }))
      };

      const prompt = `You are an expert health analytics coach for cancer survivors returning to work. Analyze this user's progress data and provide actionable insights.

USER DATA:
Journey Stage: ${analysisData.journey_stage}
Return Date: ${analysisData.return_date || 'Not set'}
Accommodations Requested: ${analysisData.accommodations}
Checklist Items Completed: ${analysisData.checklist_progress}

ENERGY & MOOD TRENDS (Last 14 days):
${analysisData.energy_trends.slice(-14).map(log => 
  `${log.date}: Energy ${log.avg.toFixed(1)}/10 (Morning: ${log.morning}, Afternoon: ${log.afternoon}, Evening: ${log.evening}), Mood: ${log.mood}, Stress: ${log.stress}/10${log.notes ? `, Notes: ${log.notes}` : ''}`
).join('\n')}

RECENT SYMPTOMS (Last 5):
${analysisData.recent_symptoms.map(s => 
  `${s.date}: ${s.type?.join(', ') || 'N/A'} - Severity ${s.severity}/10${s.triggers ? `, Triggers: ${s.triggers}` : ''}`
).join('\n')}

ANALYSIS TASKS:
1. Identify energy level trends (improving, declining, stable)
2. Detect mood patterns and correlations with energy/stress
3. Spot potential triggers or patterns in symptoms
4. Identify concerning patterns requiring attention
5. Provide 3-5 personalized, actionable tips for managing stress and fatigue
6. Suggest potential accommodations or adjustments based on data

Be specific, empathetic, and actionable. Focus on patterns over the last 7-14 days.`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: 'object',
          properties: {
            overall_status: {
              type: 'string',
              enum: ['improving', 'stable', 'declining', 'concerning'],
              description: 'Overall trajectory'
            },
            summary: {
              type: 'string',
              description: '2-3 sentence summary of current state'
            },
            energy_trend: {
              type: 'object',
              properties: {
                direction: { type: 'string', enum: ['up', 'down', 'stable', 'fluctuating'] },
                insight: { type: 'string' }
              }
            },
            mood_pattern: {
              type: 'object',
              properties: {
                dominant_mood: { type: 'string' },
                insight: { type: 'string' }
              }
            },
            stress_analysis: {
              type: 'object',
              properties: {
                average_level: { type: 'number' },
                insight: { type: 'string' }
              }
            },
            correlations: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  pattern: { type: 'string' },
                  description: { type: 'string' }
                }
              },
              description: 'Identified correlations or patterns'
            },
            concerns: {
              type: 'array',
              items: { type: 'string' },
              description: 'Any concerning patterns requiring attention'
            },
            personalized_tips: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  tip: { type: 'string' },
                  rationale: { type: 'string' }
                }
              },
              description: '3-5 actionable tips specific to this user'
            },
            recommended_actions: {
              type: 'array',
              items: { type: 'string' },
              description: 'Specific next steps or adjustments to consider'
            }
          },
          required: ['overall_status', 'summary', 'personalized_tips']
        }
      });

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
      <Card className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-2 border-purple-600">
        <CardContent className="pt-6 text-center">
          <Sparkles className="h-12 w-12 text-purple-400 mx-auto mb-3 opacity-50" />
          <p className="text-slate-300 text-sm">
            Start logging your energy and mood to receive AI-powered insights
          </p>
        </CardContent>
      </Card>
    );
  }

  const statusConfig = {
    improving: { icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-500/20', border: 'border-green-500' },
    stable: { icon: Activity, color: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500' },
    declining: { icon: TrendingDown, color: 'text-orange-400', bg: 'bg-orange-500/20', border: 'border-orange-500' },
    concerning: { icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500' }
  };

  const config = statusConfig[insights?.overall_status] || statusConfig.stable;
  const StatusIcon = config.icon;

  return (
    <Card className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border-2 border-purple-600 shadow-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-purple-400" />
            <span className="text-slate-200">AI Progress Insights</span>
            <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              Powered by AI
            </Badge>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => refetch()}
              disabled={isLoading}
              className="text-purple-400 hover:text-purple-300"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-purple-400 hover:text-purple-300"
            >
              {isExpanded ? 'Collapse' : 'Expand'}
            </Button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center space-y-3">
                <Loader2 className="h-8 w-8 animate-spin text-purple-400 mx-auto" />
                <p className="text-sm text-slate-400">Analyzing your progress data...</p>
              </div>
            </div>
          ) : insights ? (
            <>
              {/* Overall Status */}
              <div className={`p-4 rounded-lg border-2 ${config.border} ${config.bg}`}>
                <div className="flex items-start space-x-3">
                  <StatusIcon className={`h-6 w-6 ${config.color} mt-0.5`} />
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-200 mb-1 capitalize">
                      {insights.overall_status} Trajectory
                    </h3>
                    <p className="text-sm text-slate-300">{insights.summary}</p>
                  </div>
                </div>
              </div>

              {/* Trends Analysis */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {insights.energy_trend && (
                  <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
                    <div className="flex items-center space-x-2 mb-2">
                      <Activity className="h-4 w-4 text-cyan-400" />
                      <span className="text-xs font-semibold text-slate-300">Energy Trend</span>
                      <Badge variant="outline" className="text-xs capitalize">
                        {insights.energy_trend.direction}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-400">{insights.energy_trend.insight}</p>
                  </div>
                )}

                {insights.mood_pattern && (
                  <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
                    <div className="flex items-center space-x-2 mb-2">
                      <Sparkles className="h-4 w-4 text-purple-400" />
                      <span className="text-xs font-semibold text-slate-300">Mood Pattern</span>
                      <Badge variant="outline" className="text-xs capitalize">
                        {insights.mood_pattern.dominant_mood}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-400">{insights.mood_pattern.insight}</p>
                  </div>
                )}

                {insights.stress_analysis && (
                  <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertCircle className="h-4 w-4 text-orange-400" />
                      <span className="text-xs font-semibold text-slate-300">Stress Level</span>
                      <Badge variant="outline" className="text-xs">
                        {insights.stress_analysis.average_level?.toFixed(1)}/10
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-400">{insights.stress_analysis.insight}</p>
                  </div>
                )}
              </div>

              {/* Correlations & Patterns */}
              {insights.correlations && insights.correlations.length > 0 && (
                <div className="bg-cyan-900/20 rounded-lg p-4 border border-cyan-600">
                  <h4 className="font-semibold text-cyan-300 mb-2 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Identified Patterns
                  </h4>
                  <div className="space-y-2">
                    {insights.correlations.map((correlation, idx) => (
                      <div key={idx} className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-slate-200">{correlation.pattern}</p>
                          <p className="text-xs text-slate-400">{correlation.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Concerns */}
              {insights.concerns && insights.concerns.length > 0 && (
                <div className="bg-orange-900/20 rounded-lg p-4 border border-orange-600">
                  <h4 className="font-semibold text-orange-300 mb-2 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Areas Requiring Attention
                  </h4>
                  <ul className="space-y-1">
                    {insights.concerns.map((concern, idx) => (
                      <li key={idx} className="text-sm text-slate-300 flex items-start">
                        <span className="text-orange-400 mr-2">•</span>
                        {concern}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Personalized Tips */}
              {insights.personalized_tips && insights.personalized_tips.length > 0 && (
                <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-600">
                  <h4 className="font-semibold text-purple-300 mb-3 flex items-center">
                    <Lightbulb className="h-4 w-4 mr-2" />
                    Personalized Tips for You
                  </h4>
                  <div className="space-y-3">
                    {insights.personalized_tips.map((item, idx) => (
                      <div key={idx} className="bg-slate-800/50 rounded-lg p-3">
                        <p className="text-sm font-medium text-slate-200 mb-1">{item.tip}</p>
                        <p className="text-xs text-slate-400">{item.rationale}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended Actions */}
              {insights.recommended_actions && insights.recommended_actions.length > 0 && (
                <div className="bg-green-900/20 rounded-lg p-4 border border-green-600">
                  <h4 className="font-semibold text-green-300 mb-2 flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Recommended Next Steps
                  </h4>
                  <ul className="space-y-1">
                    {insights.recommended_actions.map((action, idx) => (
                      <li key={idx} className="text-sm text-slate-300 flex items-start">
                        <span className="text-green-400 mr-2">→</span>
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-slate-400">No insights available. Try refreshing.</p>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}