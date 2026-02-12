import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Clock, Calendar, Loader2, ChevronDown, ChevronUp, Lightbulb } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';

export default function ActivitySymptomCorrelations({ progress }) {
  const [isExpanded, setIsExpanded] = useState(true);

  const { data: correlations, isLoading } = useQuery({
    queryKey: ['activitySymptomCorrelations', progress?.energy_logs?.length],
    queryFn: async () => {
      if (!progress) return null;

      const energyLogs = progress.energy_logs?.slice(-30) || [];
      const symptomRecords = await base44.entities.Record.filter({ type: 'symptom' }, '-date', 30);
      const calendarEvents = progress.calendar_events?.slice(-30) || [];

      // Prepare data for correlation analysis
      const dailyData = energyLogs.map(log => {
        const logDate = new Date(log.date);
        const symptoms = symptomRecords.filter(s => {
          const sDate = new Date(s.date);
          return sDate.toDateString() === logDate.toDateString();
        });
        
        const events = calendarEvents.filter(e => {
          const eDate = new Date(e.date);
          return eDate.toDateString() === logDate.toDateString();
        });

        return {
          date: log.date,
          morning_energy: log.morning_energy,
          afternoon_energy: log.afternoon_energy,
          evening_energy: log.evening_energy,
          stress: log.stress_level,
          mood: log.mood,
          symptoms: symptoms.map(s => ({
            title: s.title,
            severity: s.symptom_details?.severity,
            types: s.symptom_details?.symptom_type || []
          })),
          events: events.map(e => ({ title: e.title, type: e.type })),
          notes: log.notes
        };
      });

      const prompt = `You are an expert in health pattern analysis for cancer survivors. Analyze the data below to identify correlations between activities, times of day, and symptom patterns.

DAILY DATA (Last 30 days):
${dailyData.map(d => {
  const avgEnergy = ((d.morning_energy || 0) + (d.afternoon_energy || 0) + (d.evening_energy || 0)) / 3;
  return `${d.date}:
  Energy: Morning ${d.morning_energy}/10, Afternoon ${d.afternoon_energy}/10, Evening ${d.evening_energy}/10
  Stress: ${d.stress}/10, Mood: ${d.mood}
  Symptoms: ${d.symptoms.length > 0 ? d.symptoms.map(s => `${s.title} (severity ${s.severity}/10)`).join(', ') : 'None'}
  Events: ${d.events.length > 0 ? d.events.map(e => `${e.title} (${e.type})`).join(', ') : 'None'}
  ${d.notes ? `Notes: ${d.notes}` : ''}`;
}).join('\n\n')}

ANALYSIS TASKS:
1. **Time-of-Day Patterns**: Identify if symptoms or energy dips occur at specific times (morning/afternoon/evening)
2. **Activity Correlations**: Find connections between calendar events (meetings, medical appointments) and symptom onset or energy changes
3. **Multi-Day Patterns**: Detect if symptoms appear X days after certain activities
4. **Trigger Identification**: Identify specific activities or event types that precede increased symptoms or decreased energy
5. **Protective Factors**: Find activities or patterns associated with better energy and fewer symptoms

Provide 4-6 actionable correlations with strong evidence from the data.`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: 'object',
          properties: {
            time_of_day_patterns: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  time_period: { type: 'string', enum: ['morning', 'afternoon', 'evening', 'consistent_all_day'] },
                  pattern: { type: 'string' },
                  evidence: { type: 'string' },
                  strength: { type: 'string', enum: ['weak', 'moderate', 'strong'] }
                }
              }
            },
            activity_correlations: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  activity_type: { type: 'string' },
                  impact: { type: 'string', description: 'Positive or negative impact description' },
                  correlation_strength: { type: 'string', enum: ['weak', 'moderate', 'strong'] },
                  time_lag: { type: 'string', description: 'e.g., "same day", "1-2 days later"' },
                  evidence: { type: 'string' },
                  recommendation: { type: 'string' }
                }
              }
            },
            symptom_triggers: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  trigger: { type: 'string' },
                  symptoms_affected: { type: 'array', items: { type: 'string' } },
                  frequency: { type: 'string' },
                  avoidance_strategy: { type: 'string' }
                }
              }
            },
            protective_factors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  factor: { type: 'string' },
                  benefit: { type: 'string' },
                  recommendation: { type: 'string' }
                }
              }
            }
          },
          required: ['time_of_day_patterns', 'activity_correlations']
        }
      });

      // Track analysis
      base44.analytics.track({
        eventName: 'activity_symptom_correlations_analyzed',
        properties: {
          time_patterns_found: response.time_of_day_patterns?.length || 0,
          activity_correlations_found: response.activity_correlations?.length || 0
        }
      });

      return response;
    },
    enabled: !!progress && progress.energy_logs?.length >= 7,
    staleTime: 12 * 60 * 60 * 1000,
    retry: 1
  });

  if (!progress || progress.energy_logs?.length < 7) {
    return null;
  }

  const strengthColors = {
    weak: 'text-slate-400 bg-slate-500/20 border-slate-500',
    moderate: 'text-amber-400 bg-amber-500/20 border-amber-500',
    strong: 'text-green-400 bg-green-500/20 border-green-500'
  };

  return (
    <Card className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 border-2 border-cyan-600 shadow-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-cyan-400" />
            <span className="text-slate-200">Activity & Symptom Correlations</span>
            <Badge className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white">
              Pattern Analysis
            </Badge>
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-cyan-400 hover:text-cyan-300"
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Discovering connections between your activities and health patterns
        </p>
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
                    <Loader2 className="h-8 w-8 animate-spin text-cyan-400 mx-auto" />
                    <p className="text-sm text-slate-400">Analyzing correlations...</p>
                  </div>
                </div>
              ) : correlations ? (
                <>
                  {/* Time of Day Patterns */}
                  {correlations.time_of_day_patterns && correlations.time_of_day_patterns.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-semibold text-cyan-300 text-sm flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        Time-of-Day Patterns
                      </h4>
                      {correlations.time_of_day_patterns.map((pattern, idx) => (
                        <div key={idx} className={`bg-slate-800/70 rounded-lg p-3 border-2 ${strengthColors[pattern.strength]}`}>
                          <div className="flex items-start justify-between mb-2">
                            <p className="font-semibold text-slate-200 capitalize">{pattern.time_period.replace('_', ' ')}</p>
                            <Badge className={strengthColors[pattern.strength]}>
                              {pattern.strength} correlation
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-300 mb-1">{pattern.pattern}</p>
                          <p className="text-xs text-slate-400 italic">{pattern.evidence}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Activity Correlations */}
                  {correlations.activity_correlations && correlations.activity_correlations.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-semibold text-cyan-300 text-sm flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        Activity Impact Analysis
                      </h4>
                      {correlations.activity_correlations.map((corr, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className={`bg-slate-800/70 rounded-lg p-3 border-2 ${strengthColors[corr.correlation_strength]}`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <p className="font-semibold text-slate-200">{corr.activity_type}</p>
                              <p className="text-xs text-slate-400">{corr.time_lag}</p>
                            </div>
                            <Badge className={strengthColors[corr.correlation_strength]}>
                              {corr.correlation_strength}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-300 mb-1">{corr.impact}</p>
                          <p className="text-xs text-slate-400 mb-2 italic">{corr.evidence}</p>
                          <div className="bg-blue-900/30 rounded p-2 border border-blue-600">
                            <p className="text-xs text-blue-300 flex items-start">
                              <Lightbulb className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                              {corr.recommendation}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* Symptom Triggers */}
                  {correlations.symptom_triggers && correlations.symptom_triggers.length > 0 && (
                    <div className="bg-red-900/20 rounded-lg p-3 border border-red-600">
                      <h4 className="font-semibold text-red-300 text-sm mb-2">Identified Triggers</h4>
                      <div className="space-y-2">
                        {correlations.symptom_triggers.map((trigger, idx) => (
                          <div key={idx} className="bg-slate-800/50 rounded p-2">
                            <p className="text-sm font-semibold text-slate-200">{trigger.trigger}</p>
                            <p className="text-xs text-slate-400 mb-1">
                              Affects: {trigger.symptoms_affected.join(', ')} ({trigger.frequency})
                            </p>
                            <p className="text-xs text-red-300">→ {trigger.avoidance_strategy}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Protective Factors */}
                  {correlations.protective_factors && correlations.protective_factors.length > 0 && (
                    <div className="bg-green-900/20 rounded-lg p-3 border border-green-600">
                      <h4 className="font-semibold text-green-300 text-sm mb-2">Protective Factors</h4>
                      <div className="space-y-2">
                        {correlations.protective_factors.map((factor, idx) => (
                          <div key={idx} className="bg-slate-800/50 rounded p-2">
                            <p className="text-sm font-semibold text-slate-200">{factor.factor}</p>
                            <p className="text-xs text-slate-300 mb-1">{factor.benefit}</p>
                            <p className="text-xs text-green-300">✓ {factor.recommendation}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-center text-slate-400 py-8">Log more data to discover correlations</p>
              )}
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}