import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, Heart, Activity, Brain, Phone, 
  Coffee, Bed, CheckCircle, X, Sparkles, Loader2
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { format, parseISO, subDays } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProactiveHealthAlerts() {
  const queryClient = useQueryClient();
  const [dismissedAlerts, setDismissedAlerts] = useState([]);

  const { data: progress } = useQuery({
    queryKey: ['userProgress'],
    queryFn: async () => {
      const progressList = await base44.entities.UserProgress.list();
      return progressList[0] || null;
    }
  });

  const { data: symptomRecords } = useQuery({
    queryKey: ['recentSymptoms'],
    queryFn: async () => {
      return await base44.entities.Record.filter({ type: 'symptom' }, '-date', 20);
    }
  });

  const { data: alerts, isLoading } = useQuery({
    queryKey: ['healthAlerts', progress?.updated_date, symptomRecords?.length],
    queryFn: async () => {
      if (!progress) return [];

      const recentEnergyLogs = progress.energy_logs?.slice(-7) || [];
      const recentSymptoms = symptomRecords?.slice(0, 10) || [];

      // Prepare data for AI analysis
      const energyData = recentEnergyLogs.map(log => ({
        date: log.date,
        morning: log.morning_energy,
        afternoon: log.afternoon_energy,
        evening: log.evening_energy,
        avg: ((log.morning_energy + log.afternoon_energy + log.evening_energy) / 3).toFixed(1),
        mood: log.mood,
        stress: log.stress_level
      }));

      const symptomData = recentSymptoms.map(s => ({
        date: s.date,
        title: s.title,
        severity: s.symptom_details?.severity,
        types: s.symptom_details?.symptom_type || []
      }));

      const prompt = `You are a health monitoring AI for cancer survivors returning to work. Analyze the data below and generate proactive health alerts.

RECENT ENERGY LOGS (Last 7 days):
${energyData.map(e => `${e.date}: Energy ${e.avg}/10, Mood: ${e.mood}, Stress: ${e.stress}/10`).join('\n')}

RECENT SYMPTOMS (Last 10):
${symptomData.map(s => `${s.date}: ${s.title} - Severity: ${s.severity}/10, Types: ${s.types.join(', ')}`).join('\n')}

CURRENT STATUS:
- Journey Stage: ${progress.journey_stage}
- Return Date: ${progress.return_date || 'Not set'}
- Days Tracked: ${progress.energy_logs?.length || 0}

ANALYSIS REQUIREMENTS:
1. Identify concerning patterns (energy drops, stress spikes, symptom severity)
2. Detect early warning signs that need attention
3. Generate 2-4 actionable alerts with specific recommendations
4. Each alert should have: priority (high/medium/low), type (energy/stress/symptom/general), title, description, and recommended actions
5. Focus on preventive care and early intervention

Return proactive, supportive alerts that help the user maintain their health.`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: 'object',
          properties: {
            alerts: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  priority: {
                    type: 'string',
                    enum: ['high', 'medium', 'low']
                  },
                  type: {
                    type: 'string',
                    enum: ['energy', 'stress', 'symptom', 'general']
                  },
                  title: { type: 'string' },
                  description: { type: 'string' },
                  actions: {
                    type: 'array',
                    items: { type: 'string' }
                  },
                  contact_provider: { type: 'boolean' }
                }
              }
            }
          },
          required: ['alerts']
        }
      });

      // Track alert generation
      base44.analytics.track({
        eventName: 'proactive_health_alerts_generated',
        properties: {
          alert_count: response.alerts?.length || 0,
          high_priority: response.alerts?.filter(a => a.priority === 'high').length || 0
        }
      });

      return response.alerts || [];
    },
    enabled: !!progress,
    staleTime: 5 * 60 * 1000,
    retry: 1
  });

  const dismissAlert = (alertId) => {
    setDismissedAlerts(prev => [...prev, alertId]);
    
    base44.analytics.track({
      eventName: 'health_alert_dismissed',
      properties: { alert_id: alertId }
    });
  };

  const acknowledgeAlert = (alertId) => {
    dismissAlert(alertId);
    
    base44.analytics.track({
      eventName: 'health_alert_acknowledged',
      properties: { alert_id: alertId }
    });
  };

  const visibleAlerts = alerts?.filter(a => !dismissedAlerts.includes(a.id)) || [];

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border-2 border-purple-600">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-purple-400" />
            <span className="ml-2 text-slate-300">Analyzing your health data...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!alerts || visibleAlerts.length === 0) {
    return (
      <Card className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 border-2 border-green-600">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-6 w-6 text-green-400" />
            <div>
              <h3 className="font-semibold text-green-400">All Systems Good</h3>
              <p className="text-sm text-slate-300">No health alerts at this time. Keep up the great work!</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const priorityConfig = {
    high: {
      icon: AlertTriangle,
      color: 'text-red-400',
      bg: 'from-red-900/40 to-orange-900/40',
      border: 'border-red-600',
      badge: 'bg-red-600'
    },
    medium: {
      icon: Activity,
      color: 'text-orange-400',
      bg: 'from-orange-900/40 to-amber-900/40',
      border: 'border-orange-600',
      badge: 'bg-orange-600'
    },
    low: {
      icon: Heart,
      color: 'text-blue-400',
      bg: 'from-blue-900/40 to-cyan-900/40',
      border: 'border-blue-600',
      badge: 'bg-blue-600'
    }
  };

  const typeIcons = {
    energy: Coffee,
    stress: Brain,
    symptom: Activity,
    general: Heart
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <Sparkles className="h-5 w-5 text-purple-400" />
        <h3 className="text-lg font-semibold text-slate-200">Health Alerts</h3>
        <Badge className="bg-purple-600">{visibleAlerts.length}</Badge>
      </div>

      <AnimatePresence>
        {visibleAlerts.map((alert) => {
          const config = priorityConfig[alert.priority];
          const PriorityIcon = config.icon;
          const TypeIcon = typeIcons[alert.type];

          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.3 }}
            >
              <Card className={`bg-gradient-to-br ${config.bg} border-2 ${config.border}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className={`p-2 rounded-lg bg-slate-900/50`}>
                        <PriorityIcon className={`h-5 w-5 ${config.color}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <CardTitle className="text-slate-200 text-base">
                            {alert.title}
                          </CardTitle>
                          <Badge className={config.badge}>
                            {alert.priority}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            <TypeIcon className="h-3 w-3 mr-1" />
                            {alert.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-300 mb-3">{alert.description}</p>

                        {/* Actions */}
                        {alert.actions && alert.actions.length > 0 && (
                          <div className="bg-slate-900/50 rounded-lg p-3 mb-3">
                            <p className="text-xs font-semibold text-slate-400 mb-2">Recommended Actions:</p>
                            <ul className="space-y-1">
                              {alert.actions.map((action, idx) => (
                                <li key={idx} className="text-xs text-slate-300 flex items-start">
                                  <span className={`${config.color} mr-2`}>→</span>
                                  {action}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Contact Provider Warning */}
                        {alert.contact_provider && (
                          <div className="flex items-center space-x-2 bg-red-900/30 rounded-lg p-2 mb-3">
                            <Phone className="h-4 w-4 text-red-400" />
                            <p className="text-xs text-red-300 font-medium">
                              Consider contacting your healthcare provider
                            </p>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            onClick={() => acknowledgeAlert(alert.id)}
                            className="bg-slate-700 hover:bg-slate-600 text-white"
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Got it
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => dismissAlert(alert.id)}
                            className="text-slate-400 hover:text-slate-200"
                          >
                            Dismiss
                          </Button>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => dismissAlert(alert.id)}
                      className="text-slate-500 hover:text-slate-300 ml-2"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}