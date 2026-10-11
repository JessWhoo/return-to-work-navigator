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

      const dailyDataText = dailyData.map(d => {
        return `${d.date}:
  Energy: Morning ${d.morning_energy}/10, Afternoon ${d.afternoon_energy}/10, Evening ${d.evening_energy}/10
  Stress: ${d.stress}/10, Mood: ${d.mood}
  Symptoms: ${d.symptoms.length > 0 ? d.symptoms.map(s => `${s.title} (severity ${s.severity}/10)`).join(', ') : 'None'}
  Events: ${d.events.length > 0 ? d.events.map(e => `${e.title} (${e.type})`).join(', ') : 'None'}
  ${d.notes ? `Notes: ${d.notes}` : ''}`;
      }).join('\n\n');
      const response = (await base44.functions.invoke('aiGateway', {
        operation: 'activity_correlations',
        data: { dailyDataText },
      })).data.result;

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
    weak: 'text-brand-muted-foreground !bg-brand-muted !border-brand-border',
    moderate: 'text-brand-primary !bg-brand-compass-cream/40 !border-brand-primary',
    strong: 'text-brand-text !bg-brand-secondary/20 !border-brand-secondary'
  };

  return (
    <Card className="nv-card--muted">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="flex min-w-0 flex-wrap items-center gap-2 text-lg sm:text-xl">
            <TrendingUp className="h-5 w-5 text-brand-primary" />
            <span className="text-brand-text">Activity & Symptom Correlations</span>
            <Badge variant="secondary" className="rounded-pill">
              Pattern Analysis
            </Badge>
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            aria-label={isExpanded ? 'Collapse activity and symptom correlations' : 'Expand activity and symptom correlations'}
            aria-expanded={isExpanded}
            onClick={() => setIsExpanded(!isExpanded)}
            className="shrink-0"
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
        <p className="text-xs text-brand-muted-foreground mt-1">
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
            <CardContent className="space-y-4 [overflow-wrap:anywhere]">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center space-y-3">
                    <Loader2 className="h-8 w-8 animate-spin text-brand-primary mx-auto" />
                    <p className="text-sm text-brand-muted-foreground">Analyzing correlations...</p>
                  </div>
                </div>
              ) : correlations ? (
                <>
                  {/* Time of Day Patterns */}
                  {correlations.time_of_day_patterns && correlations.time_of_day_patterns.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-semibold text-brand-text text-sm flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        Time-of-Day Patterns
                      </h4>
                      {correlations.time_of_day_patterns.map((pattern, idx) => (
                        <div key={idx} className={`nv-card p-4 ${strengthColors[pattern.strength]}`}>
                          <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                            <p className="font-semibold text-brand-text capitalize">{pattern.time_period.replace('_', ' ')}</p>
                            <Badge variant="outline" className={`rounded-pill ${strengthColors[pattern.strength]}`}>
                              {pattern.strength} correlation
                            </Badge>
                          </div>
                          <p className="text-sm text-brand-text mb-1">{pattern.pattern}</p>
                          <p className="text-xs text-brand-muted-foreground italic">{pattern.evidence}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Activity Correlations */}
                  {correlations.activity_correlations && correlations.activity_correlations.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-semibold text-brand-text text-sm flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        Activity Impact Analysis
                      </h4>
                      {correlations.activity_correlations.map((corr, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className={`nv-card p-4 ${strengthColors[corr.correlation_strength]}`}
                        >
                          <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                            <div className="flex-1">
                              <p className="font-semibold text-brand-text">{corr.activity_type}</p>
                              <p className="text-xs text-brand-muted-foreground">{corr.time_lag}</p>
                            </div>
                            <Badge variant="outline" className={`rounded-pill ${strengthColors[corr.correlation_strength]}`}>
                              {corr.correlation_strength}
                            </Badge>
                          </div>
                          <p className="text-sm text-brand-text mb-1">{corr.impact}</p>
                          <p className="text-xs text-brand-muted-foreground mb-2 italic">{corr.evidence}</p>
                          <div className="rounded-brand border border-brand-border bg-brand-muted p-3">
                            <p className="text-xs text-brand-primary flex items-start">
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
                    <div className="nv-card nv-card--pink !border-destructive p-4">
                      <h4 className="font-semibold text-destructive text-sm mb-2">Identified Triggers</h4>
                      <div className="space-y-2">
                        {correlations.symptom_triggers.map((trigger, idx) => (
                          <div key={idx} className="nv-card p-3">
                            <p className="text-sm font-semibold text-brand-text">{trigger.trigger}</p>
                            <p className="text-xs text-brand-muted-foreground mb-1">
                              Affects: {trigger.symptoms_affected.join(', ')} ({trigger.frequency})
                            </p>
                            <p className="text-xs text-destructive">→ {trigger.avoidance_strategy}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Protective Factors */}
                  {correlations.protective_factors && correlations.protective_factors.length > 0 && (
                    <div className="nv-card nv-card--sage p-4">
                      <h4 className="font-semibold text-brand-text text-sm mb-2">Protective Factors</h4>
                      <div className="space-y-2">
                        {correlations.protective_factors.map((factor, idx) => (
                          <div key={idx} className="nv-card p-3">
                            <p className="text-sm font-semibold text-brand-text">{factor.factor}</p>
                            <p className="text-xs text-brand-text mb-1">{factor.benefit}</p>
                            <p className="text-xs text-brand-text">✓ {factor.recommendation}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-center text-brand-muted-foreground py-8">Log more data to discover correlations</p>
              )}
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}