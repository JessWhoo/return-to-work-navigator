import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, TrendingUp, Calendar, Zap, Activity, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';

export default function PredictiveHealthAlerts({ progress }) {
  const [isExpanded, setIsExpanded] = useState(true);

  const { data: predictions, isLoading } = useQuery({
    queryKey: ['predictiveHealthAlerts', progress?.energy_logs?.length, progress?.calendar_events?.length],
    queryFn: async () => {
      if (!progress) return null;

      const recentEnergyLogs = progress.energy_logs?.slice(-30) || [];
      const symptomRecords = await base44.entities.Record.filter({ type: 'symptom' }, '-date', 30);
      const upcomingEvents = progress.calendar_events?.filter(e => 
        new Date(e.date) >= new Date() && 
        new Date(e.date) <= new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      ) || [];

      // Prepare historical data for AI analysis
      const energyTrends = recentEnergyLogs.map(log => ({
        date: log.date,
        avg_energy: ((log.morning_energy || 0) + (log.afternoon_energy || 0) + (log.evening_energy || 0)) / 3,
        stress: log.stress_level,
        mood: log.mood,
        notes: log.notes
      }));

      const symptomPatterns = symptomRecords.map(s => ({
        date: s.date,
        title: s.title,
        severity: s.symptom_details?.severity,
        types: s.symptom_details?.symptom_type || [],
        triggers: s.symptom_details?.triggers
      }));

      const prompt = `You are a health analytics AI specializing in predicting health patterns for cancer survivors returning to work.

HISTORICAL DATA (Last 30 days):

Energy & Stress Logs:
${energyTrends.map(e => `${e.date}: Energy ${e.avg_energy.toFixed(1)}/10, Stress ${e.stress}/10, Mood: ${e.mood}${e.notes ? `, Notes: ${e.notes}` : ''}`).join('\n')}

Symptom Records:
${symptomPatterns.map(s => `${s.date}: ${s.title}, Severity ${s.severity}/10, Types: ${s.types.join(', ')}${s.triggers ? `, Triggers: ${s.triggers}` : ''}`).join('\n')}

Upcoming Calendar Events (Next 14 days):
${upcomingEvents.length > 0 ? upcomingEvents.map(e => `${e.date}: ${e.title} (${e.type})`).join('\n') : 'No upcoming events scheduled'}

Current Journey Stage: ${progress.journey_stage || 'planning'}
Days to Return: ${progress.return_date ? Math.ceil((new Date(progress.return_date) - new Date()) / (1000 * 60 * 60 * 24)) : 'not set'}

TASK:
Analyze the historical patterns and predict potential flare-ups or challenging periods in the next 7-14 days. Consider:

1. **Historical Patterns**: Identify recurring patterns (e.g., symptoms spike every X days, energy crashes after certain events)
2. **Trend Analysis**: Detect if symptoms/energy are trending upward or downward
3. **Event Triggers**: Correlate past calendar events with energy drops or symptom increases
4. **Upcoming Risks**: Predict how upcoming events might impact health based on past patterns
5. **Risk Level**: Assign risk level (low/medium/high) for each predicted period

Provide 3-5 actionable predictions with specific dates/periods, reasoning, and prevention strategies.`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: 'object',
          properties: {
            overall_risk_level: {
              type: 'string',
              enum: ['low', 'moderate', 'high'],
              description: 'Overall health risk in next 14 days'
            },
            trend_direction: {
              type: 'string',
              enum: ['improving', 'stable', 'declining', 'fluctuating'],
              description: 'Overall health trajectory'
            },
            predictions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  period: { type: 'string', description: 'Time period (e.g., "Feb 15-18", "Next week")' },
                  risk_level: { type: 'string', enum: ['low', 'moderate', 'high'] },
                  predicted_issue: { type: 'string', description: 'What might happen' },
                  confidence: { type: 'string', enum: ['low', 'medium', 'high'] },
                  reasoning: { type: 'string', description: 'Why this prediction is made' },
                  triggers: { 
                    type: 'array', 
                    items: { type: 'string' },
                    description: 'Potential triggers identified'
                  },
                  prevention_strategies: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'How to prevent or mitigate'
                  }
                }
              }
            },
            recommendations: {
              type: 'array',
              items: { type: 'string' },
              description: 'General recommendations for the next 2 weeks'
            }
          },
          required: ['overall_risk_level', 'trend_direction', 'predictions']
        }
      });

      // Track prediction generation
      base44.analytics.track({
        eventName: 'predictive_health_alerts_generated',
        properties: {
          risk_level: response.overall_risk_level,
          predictions_count: response.predictions?.length || 0,
          trend: response.trend_direction
        }
      });

      return response;
    },
    enabled: !!progress && (progress.energy_logs?.length > 0 || false),
    staleTime: 6 * 60 * 60 * 1000, // 6 hours
    retry: 1
  });

  if (!progress || !progress.energy_logs?.length) {
    return null;
  }

  const riskConfig = {
    low: { color: 'text-green-400', bg: 'bg-green-500/20', border: 'border-green-500', icon: TrendingUp },
    moderate: { color: 'text-amber-400', bg: 'bg-amber-500/20', border: 'border-amber-500', icon: AlertTriangle },
    high: { color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500', icon: AlertTriangle }
  };

  const trendConfig = {
    improving: { text: 'Improving Trend', color: 'text-green-400' },
    stable: { text: 'Stable Pattern', color: 'text-blue-400' },
    declining: { text: 'Declining Trend', color: 'text-red-400' },
    fluctuating: { text: 'Fluctuating Pattern', color: 'text-amber-400' }
  };

  return (
    <Card className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border-2 border-indigo-600 shadow-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-indigo-400" />
            <span className="text-slate-200">Predictive Health Analytics</span>
            <Badge className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
              AI-Powered
            </Badge>
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-indigo-400 hover:text-indigo-300"
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
        {predictions && (
          <p className="text-xs text-slate-400 mt-1">
            Analyzing patterns to predict potential health challenges in the next 14 days
          </p>
        )}
      </CardHeader>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <CardContent className="space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center space-y-3">
                    <Loader2 className="h-8 w-8 animate-spin text-indigo-400 mx-auto" />
                    <p className="text-sm text-slate-400">Analyzing health patterns...</p>
                  </div>
                </div>
              ) : predictions ? (
                <>
                  {/* Overall Status */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className={`p-3 rounded-lg border-2 ${riskConfig[predictions.overall_risk_level].border} ${riskConfig[predictions.overall_risk_level].bg}`}>
                      <p className="text-xs text-slate-400 mb-1">Risk Level (14 days)</p>
                      <p className={`text-lg font-bold ${riskConfig[predictions.overall_risk_level].color} capitalize`}>
                        {predictions.overall_risk_level}
                      </p>
                    </div>
                    <div className="p-3 rounded-lg border-2 border-slate-600 bg-slate-800/50">
                      <p className="text-xs text-slate-400 mb-1">Health Trend</p>
                      <p className={`text-lg font-bold ${trendConfig[predictions.trend_direction].color}`}>
                        {trendConfig[predictions.trend_direction].text}
                      </p>
                    </div>
                  </div>

                  {/* Predictions */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-indigo-300 text-sm flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      Predicted Challenges & Prevention
                    </h4>
                    {predictions.predictions?.map((pred, idx) => {
                      const config = riskConfig[pred.risk_level];
                      const Icon = config.icon;
                      return (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className={`bg-slate-800/70 rounded-lg p-4 border-2 ${config.border}`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <Icon className={`h-5 w-5 ${config.color}`} />
                              <div>
                                <p className="font-semibold text-slate-200">{pred.period}</p>
                                <p className="text-xs text-slate-400">{pred.predicted_issue}</p>
                              </div>
                            </div>
                            <div className="flex flex-col items-end space-y-1">
                              <Badge className={`${config.bg} ${config.color} border-0 capitalize`}>
                                {pred.risk_level} Risk
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {pred.confidence} confidence
                              </Badge>
                            </div>
                          </div>

                          <div className="mt-3 space-y-2 text-sm">
                            <div>
                              <p className="text-xs font-semibold text-slate-400 mb-1">Why this prediction:</p>
                              <p className="text-slate-300 text-xs">{pred.reasoning}</p>
                            </div>

                            {pred.triggers && pred.triggers.length > 0 && (
                              <div>
                                <p className="text-xs font-semibold text-slate-400 mb-1">Potential Triggers:</p>
                                <div className="flex flex-wrap gap-1">
                                  {pred.triggers.map((trigger, tidx) => (
                                    <Badge key={tidx} variant="outline" className="text-xs">
                                      {trigger}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                            {pred.prevention_strategies && pred.prevention_strategies.length > 0 && (
                              <div className="bg-green-900/20 rounded-lg p-2 border border-green-600">
                                <p className="text-xs font-semibold text-green-300 mb-1">Prevention Strategies:</p>
                                <ul className="space-y-1">
                                  {pred.prevention_strategies.map((strategy, sidx) => (
                                    <li key={sidx} className="text-xs text-slate-300 flex items-start">
                                      <span className="text-green-400 mr-1">✓</span>
                                      {strategy}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* General Recommendations */}
                  {predictions.recommendations && predictions.recommendations.length > 0 && (
                    <div className="bg-blue-900/20 rounded-lg p-3 border border-blue-600">
                      <h4 className="font-semibold text-blue-300 text-sm mb-2">General Recommendations:</h4>
                      <ul className="space-y-1">
                        {predictions.recommendations.map((rec, idx) => (
                          <li key={idx} className="text-xs text-slate-300 flex items-start">
                            <Zap className="h-3 w-3 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-center text-slate-400 py-8">No predictions available</p>
              )}
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}