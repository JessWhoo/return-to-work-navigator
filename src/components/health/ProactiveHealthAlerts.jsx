import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, Heart, Activity, Brain, Phone, 
  Coffee, CheckCircle, X, Sparkles, Loader2
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserProgress } from '@/hooks/useUserProgress';

export default function ProactiveHealthAlerts() {
  const [dismissedAlerts, setDismissedAlerts] = useState([]);

  const { data: progress } = useUserProgress();

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

      const energyDataText = energyData.map(e => `${e.date}: Energy ${e.avg}/10, Mood: ${e.mood}, Stress: ${e.stress}/10`).join('\n');
      const symptomDataText = symptomData.map(s => `${s.date}: ${s.title} - Severity: ${s.severity}/10, Types: ${s.types.join(', ')}`).join('\n');
      const response = (await base44.functions.invoke('aiGateway', {
        operation: 'proactive_alerts',
        data: {
          energyDataText,
          symptomDataText,
          journeyStage: progress.journey_stage,
          returnDate: progress.return_date,
          daysTracked: progress.energy_logs?.length || 0,
        },
      })).data.result;

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
      <Card className="nv-card--muted">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-brand-primary" />
            <span className="ml-2 text-brand-text">Analyzing your health data...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!alerts || visibleAlerts.length === 0) {
    return (
      <Card className="nv-card--sage">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-6 w-6 text-brand-text" />
            <div>
              <h3 className="font-semibold text-brand-text">All Systems Good</h3>
              <p className="text-sm text-brand-text">No health alerts at this time. Keep up the great work!</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const priorityConfig = {
    high: {
      icon: AlertTriangle,
      color: 'text-destructive',
      bg: 'nv-card--pink',
      border: '!border-destructive',
      badge: 'bg-destructive text-destructive-foreground'
    },
    medium: {
      icon: Activity,
      color: 'text-brand-primary',
      bg: 'nv-card--pink',
      border: 'border-brand-border',
      badge: 'bg-brand-primary text-brand-on-primary'
    },
    low: {
      icon: Heart,
      color: 'text-brand-primary',
      bg: 'nv-card--muted',
      border: 'border-brand-border',
      badge: 'bg-brand-sky text-brand-text'
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
      <div className="flex flex-wrap items-center gap-2">
        <Sparkles className="h-5 w-5 text-brand-primary" />
        <h3 className="text-lg font-semibold text-brand-text">Health Alerts</h3>
        <Badge variant="secondary" className="rounded-pill">{visibleAlerts.length}</Badge>
      </div>

      <AnimatePresence>
        {visibleAlerts.map((alert) => {
          const config = priorityConfig[alert.priority] || priorityConfig.low;
          const PriorityIcon = config.icon;
          const TypeIcon = typeIcons[alert.type] || Heart;

          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.3 }}
            >
              <Card className={`${config.bg} ${config.border} [overflow-wrap:anywhere]`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row">
                      <div className="w-fit shrink-0 rounded-pill bg-brand-surface p-2">
                        <PriorityIcon className={`h-5 w-5 ${config.color}`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <CardTitle className="text-brand-text text-base">
                            {alert.title}
                          </CardTitle>
                          <Badge variant="outline" className={`rounded-pill ${config.badge}`}>
                            {alert.priority}
                          </Badge>
                          <Badge variant="outline" className="rounded-pill text-xs">
                            <TypeIcon className="h-3 w-3 mr-1" />
                            {alert.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-brand-text mb-3">{alert.description}</p>

                        {/* Actions */}
                        {alert.actions && alert.actions.length > 0 && (
                          <div className="nv-card mb-3 p-3">
                            <p className="text-xs font-semibold text-brand-muted-foreground mb-2">Recommended Actions:</p>
                            <ul className="space-y-1">
                              {alert.actions.map((action, idx) => (
                                <li key={idx} className="text-xs text-brand-text flex items-start">
                                  <span className={`${config.color} mr-2`}>→</span>
                                  {action}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Contact Provider Warning */}
                        {alert.contact_provider && (
                          <div className="mb-3 flex items-start gap-2 rounded-brand border border-destructive bg-destructive/10 p-3">
                            <Phone className="h-4 w-4 shrink-0 text-destructive" strokeWidth={1.75} aria-hidden="true" />
                            <p className="text-xs text-destructive font-medium">
                              Consider contacting your healthcare provider
                            </p>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-wrap items-center gap-2">
                          <Button
                            size="sm"
                            onClick={() => acknowledgeAlert(alert.id)}
                            className=""
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Got it
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => dismissAlert(alert.id)}
                            className=""
                          >
                            Dismiss
                          </Button>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Dismiss ${alert.title}`}
                      onClick={() => dismissAlert(alert.id)}
                      className="shrink-0"
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