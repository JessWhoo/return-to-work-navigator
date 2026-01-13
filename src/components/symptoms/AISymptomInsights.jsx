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
      const prompt = `You are an expert symptom analyst helping cancer survivors manage their return to work. Analyze the symptom patterns below and provide actionable insights.

SYMPTOM LOGS (Last 30):
${symptomData.map(s => 
  `${s.date}: ${s.title} - Types: ${s.types.join(', ') || 'N/A'}, Severity: ${s.severity}/10, Duration: ${s.duration || 'N/A'}${s.triggers ? `, Triggers: ${s.triggers}` : ''}${s.relief ? `, Relief: ${s.relief}` : ''}`
).join('\n')}

RECENT ENERGY & MOOD DATA (Last 14 days):
${recentEnergyLogs.map(log => 
  `${log.date}: Energy ${((log.morning_energy + log.afternoon_energy + log.evening_energy) / 3).toFixed(1)}/10, Mood: ${log.mood}, Stress: ${log.stress_level}/10`
).join('\n')}

ANALYSIS TASKS:
1. Identify recurring symptom patterns (frequency, timing, types)
2. Detect correlations between symptoms and energy/mood/stress levels
3. Identify potential symptom triggers (activities, times, conditions)
4. Spot concerning patterns that may need medical attention
5. Provide 4-6 personalized tips for managing these specific symptoms
6. Suggest practical accommodations or adjustments based on symptom patterns

Focus on actionable insights that can help the user manage symptoms while returning to work.`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: 'object',
          properties: {
            overall_assessment: {
              type: 'string',
              enum: ['stable', 'improving', 'fluctuating', 'concerning'],
              description: 'Overall symptom trajectory'
            },
            summary: {
              type: 'string',
              description: '2-3 sentence overview of symptom patterns'
            },
            recurring_patterns: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  pattern: { type: 'string' },
                  frequency: { type: 'string' },
                  description: { type: 'string' }
                }
              },
              description: 'Identified recurring symptom patterns'
            },
            correlations: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  correlation: { type: 'string' },
                  insight: { type: 'string' }
                }
              },
              description: 'Correlations between symptoms and energy/mood/activities'
            },
            identified_triggers: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  trigger: { type: 'string' },
                  description: { type: 'string' }
                }
              },
              description: 'Potential symptom triggers identified'
            },
            concerns: {
              type: 'array',
              items: { type: 'string' },
              description: 'Patterns requiring medical attention'
            },
            management_tips: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  tip: { type: 'string' },
                  rationale: { type: 'string' }
                }
              },
              description: 'Personalized tips for managing symptoms'
            },
            accommodation_suggestions: {
              type: 'array',
              items: { type: 'string' },
              description: 'Workplace adjustments to consider'
            }
          },
          required: ['overall_assessment', 'summary', 'management_tips']
        }
      });

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
    stable: { icon: Activity, color: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500' },
    improving: { icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-500/20', border: 'border-green-500' },
    fluctuating: { icon: Zap, color: 'text-orange-400', bg: 'bg-orange-500/20', border: 'border-orange-500' },
    concerning: { icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500' }
  };

  const config = assessmentConfig[insights?.overall_assessment] || assessmentConfig.stable;
  const AssessmentIcon = config.icon;

  return (
    <Card className="bg-gradient-to-br from-rose-900/40 to-orange-900/40 border-2 border-rose-600 shadow-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-rose-400" />
            <span className="text-slate-200">AI Symptom Pattern Analysis</span>
            <Badge className="bg-gradient-to-r from-rose-600 to-orange-600 text-white">
              Powered by AI
            </Badge>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => refetch()}
              disabled={isLoading}
              className="text-rose-400 hover:text-rose-300"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-rose-400 hover:text-rose-300"
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
                <Loader2 className="h-8 w-8 animate-spin text-rose-400 mx-auto" />
                <p className="text-sm text-slate-400">Analyzing symptom patterns...</p>
              </div>
            </div>
          ) : insights ? (
            <>
              {/* Overall Assessment */}
              <div className={`p-4 rounded-lg border-2 ${config.border} ${config.bg}`}>
                <div className="flex items-start space-x-3">
                  <AssessmentIcon className={`h-6 w-6 ${config.color} mt-0.5`} />
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-200 mb-1 capitalize">
                      {insights.overall_assessment} Pattern
                    </h3>
                    <p className="text-sm text-slate-300">{insights.summary}</p>
                  </div>
                </div>
              </div>

              {/* Recurring Patterns */}
              {insights.recurring_patterns && insights.recurring_patterns.length > 0 && (
                <div className="bg-cyan-900/20 rounded-lg p-4 border border-cyan-600">
                  <h4 className="font-semibold text-cyan-300 mb-3 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Recurring Patterns Detected
                  </h4>
                  <div className="space-y-2">
                    {insights.recurring_patterns.map((pattern, idx) => (
                      <div key={idx} className="bg-slate-800/50 rounded-lg p-3">
                        <div className="flex items-center space-x-2 mb-1">
                          <p className="text-sm font-medium text-slate-200">{pattern.pattern}</p>
                          <Badge variant="outline" className="text-xs">
                            {pattern.frequency}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-400">{pattern.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Correlations */}
              {insights.correlations && insights.correlations.length > 0 && (
                <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-600">
                  <h4 className="font-semibold text-purple-300 mb-3 flex items-center">
                    <Zap className="h-4 w-4 mr-2" />
                    Energy & Mood Correlations
                  </h4>
                  <div className="space-y-2">
                    {insights.correlations.map((correlation, idx) => (
                      <div key={idx} className="flex items-start space-x-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-purple-400 mt-1.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-slate-200">{correlation.correlation}</p>
                          <p className="text-xs text-slate-400">{correlation.insight}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Identified Triggers */}
              {insights.identified_triggers && insights.identified_triggers.length > 0 && (
                <div className="bg-orange-900/20 rounded-lg p-4 border border-orange-600">
                  <h4 className="font-semibold text-orange-300 mb-3 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Potential Triggers
                  </h4>
                  <div className="space-y-2">
                    {insights.identified_triggers.map((trigger, idx) => (
                      <div key={idx} className="bg-slate-800/50 rounded-lg p-3">
                        <p className="text-sm font-medium text-slate-200 mb-1">{trigger.trigger}</p>
                        <p className="text-xs text-slate-400">{trigger.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Concerns */}
              {insights.concerns && insights.concerns.length > 0 && (
                <div className="bg-red-900/20 rounded-lg p-4 border border-red-600">
                  <h4 className="font-semibold text-red-300 mb-2 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Patterns Requiring Attention
                  </h4>
                  <ul className="space-y-1">
                    {insights.concerns.map((concern, idx) => (
                      <li key={idx} className="text-sm text-slate-300 flex items-start">
                        <span className="text-red-400 mr-2">•</span>
                        {concern}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Management Tips */}
              {insights.management_tips && insights.management_tips.length > 0 && (
                <div className="bg-green-900/20 rounded-lg p-4 border border-green-600">
                  <h4 className="font-semibold text-green-300 mb-3 flex items-center">
                    <Lightbulb className="h-4 w-4 mr-2" />
                    Personalized Management Tips
                  </h4>
                  <div className="space-y-3">
                    {insights.management_tips.map((item, idx) => (
                      <div key={idx} className="bg-slate-800/50 rounded-lg p-3">
                        <p className="text-sm font-medium text-slate-200 mb-1">{item.tip}</p>
                        <p className="text-xs text-slate-400">{item.rationale}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Accommodation Suggestions */}
              {insights.accommodation_suggestions && insights.accommodation_suggestions.length > 0 && (
                <div className="bg-indigo-900/20 rounded-lg p-4 border border-indigo-600">
                  <h4 className="font-semibold text-indigo-300 mb-2 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Suggested Workplace Adjustments
                  </h4>
                  <ul className="space-y-1">
                    {insights.accommodation_suggestions.map((suggestion, idx) => (
                      <li key={idx} className="text-sm text-slate-300 flex items-start">
                        <span className="text-indigo-400 mr-2">→</span>
                        {suggestion}
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