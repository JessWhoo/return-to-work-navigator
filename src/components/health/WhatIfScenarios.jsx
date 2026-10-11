import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, Play, AlertTriangle, TrendingUp, Loader2 } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';

export default function WhatIfScenarios({ progress }) {
  const [scenario, setScenario] = useState({
    type: 'work_hours',
    change_amount: '',
    timeframe: 'week'
  });

  const scenarioMutation = useMutation({
    mutationFn: async (scenarioConfig) => {
      const recentEnergyLogs = progress.energy_logs?.slice(-30) || [];
      const symptomRecords = await base44.entities.Record.filter({ type: 'symptom' }, '-date', 30);

      // Calculate current baselines
      const avgEnergy = recentEnergyLogs.length > 0
        ? recentEnergyLogs.reduce((sum, log) => {
            return sum + ((log.morning_energy + log.afternoon_energy + log.evening_energy) / 3);
          }, 0) / recentEnergyLogs.length
        : 0;

      const avgStress = recentEnergyLogs.length > 0
        ? recentEnergyLogs.reduce((sum, log) => sum + (log.stress_level || 0), 0) / recentEnergyLogs.length
        : 0;

      const avgSymptomSeverity = symptomRecords.length > 0
        ? symptomRecords.reduce((sum, s) => sum + (s.symptom_details?.severity || 0), 0) / symptomRecords.length
        : 0;

      const baselineText = `- Average Energy Level: ${avgEnergy.toFixed(1)}/10 (last 30 days)
- Average Stress Level: ${avgStress.toFixed(1)}/10
- Average Symptom Severity: ${avgSymptomSeverity.toFixed(1)}/10
- Recent Symptom Frequency: ${symptomRecords.length} symptoms in 30 days
- Journey Stage: ${progress.journey_stage || 'planning'}`;
      const recentPatternsText = `Energy Logs (last 7 days):
${recentEnergyLogs.slice(-7).map(log =>
  `${log.date}: Energy ${((log.morning_energy + log.afternoon_energy + log.evening_energy) / 3).toFixed(1)}/10, Stress ${log.stress_level}/10, Mood: ${log.mood}`
).join('\n')}

Recent Symptoms:
${symptomRecords.slice(0, 5).map(s =>
  `${s.date}: ${s.title} (Severity ${s.symptom_details?.severity}/10)`
).join('\n')}`;
      const scenarioText = `${scenarioConfig.type === 'work_hours' ? `Increase work hours by ${scenarioConfig.change_amount} hours per ${scenarioConfig.timeframe}` : ''}
${scenarioConfig.type === 'reduce_hours' ? `Decrease work hours by ${scenarioConfig.change_amount} hours per ${scenarioConfig.timeframe}` : ''}
${scenarioConfig.type === 'add_commute' ? `Add ${scenarioConfig.change_amount} hours of commuting per ${scenarioConfig.timeframe}` : ''}
${scenarioConfig.type === 'remove_wfh' ? `Remove work-from-home option, return to office ${scenarioConfig.change_amount} days per ${scenarioConfig.timeframe}` : ''}
${scenarioConfig.type === 'add_activity' ? `Add ${scenarioConfig.change_amount} hours of additional activity per ${scenarioConfig.timeframe}` : ''}`;
      const response = (await base44.functions.invoke('aiGateway', {
        operation: 'what_if',
        data: { baselineText, recentPatternsText, scenarioText },
      })).data.result;

      // Track scenario analysis
      base44.analytics.track({
        eventName: 'what_if_scenario_analyzed',
        properties: {
          scenario_type: scenarioConfig.type,
          risk_level: response.overall_risk,
          feasibility: response.feasibility
        }
      });

      return response;
    }
  });

  const handleAnalyze = () => {
    if (!scenario.change_amount) return;
    scenarioMutation.mutate(scenario);
  };

  const riskConfig = {
    low: { color: 'text-brand-text', bg: 'bg-brand-secondary/20', border: 'border-brand-secondary' },
    moderate: { color: 'text-brand-primary', bg: 'bg-brand-compass-cream/40', border: 'border-brand-primary' },
    high: { color: 'text-destructive', bg: 'bg-destructive/10', border: 'border-destructive' }
  };

  const feasibilityConfig = {
    recommended: { text: 'Recommended', color: 'bg-brand-secondary text-brand-text' },
    possible_with_caution: { text: 'Possible with Caution', color: 'bg-brand-compass-cream text-brand-text' },
    not_recommended: { text: 'Not Recommended', color: 'bg-destructive text-destructive-foreground' }
  };

  return (
    <Card className="nv-card--muted">
      <CardHeader>
        <CardTitle className="flex flex-wrap items-center gap-2 min-w-0">
          <Sparkles className="h-5 w-5 text-brand-primary" />
          <span className="text-brand-text">What-If Scenario Analysis</span>
          <Badge className="bg-brand-primary text-brand-on-primary">
            Predictive
          </Badge>
        </CardTitle>
        <p className="text-xs text-brand-muted-foreground mt-1">
          Model potential changes before implementing them
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Scenario Configuration */}
        <div className="space-y-3">
          <div>
            <Label className="text-brand-text text-sm">What change are you considering?</Label>
            <Select value={scenario.type} onValueChange={(v) => setScenario({ ...scenario, type: v })}>
              <SelectTrigger className="nv-input mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="work_hours">Increase work hours</SelectItem>
                <SelectItem value="reduce_hours">Reduce work hours</SelectItem>
                <SelectItem value="add_commute">Add commute time</SelectItem>
                <SelectItem value="remove_wfh">Return to office (remove WFH)</SelectItem>
                <SelectItem value="add_activity">Add additional activity</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-brand-text text-sm">Amount (hours)</Label>
              <Input
                type="number"
                value={scenario.change_amount}
                onChange={(e) => setScenario({ ...scenario, change_amount: e.target.value })}
                placeholder="e.g., 2"
                className="nv-input mt-1"
              />
            </div>
            <div>
              <Label className="text-brand-text text-sm">Per</Label>
              <Select value={scenario.timeframe} onValueChange={(v) => setScenario({ ...scenario, timeframe: v })}>
                <SelectTrigger className="nv-input mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Day</SelectItem>
                  <SelectItem value="week">Week</SelectItem>
                  <SelectItem value="month">Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={handleAnalyze}
            disabled={!scenario.change_amount || scenarioMutation.isPending}
            className="w-full"
          >
            {scenarioMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Run Analysis
              </>
            )}
          </Button>
        </div>

        {/* Results */}
        <AnimatePresence>
          {scenarioMutation.data && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3 pt-4 border-t border-brand-border"
            >
              {/* Risk & Feasibility */}
              <div className="grid grid-cols-2 gap-3">
                <div className={`p-3 rounded-lg border-2 ${riskConfig[scenarioMutation.data.overall_risk].border} ${riskConfig[scenarioMutation.data.overall_risk].bg}`}>
                  <p className="text-xs text-brand-muted-foreground mb-1">Risk Level</p>
                  <p className={`text-lg font-bold ${riskConfig[scenarioMutation.data.overall_risk].color} capitalize`}>
                    {scenarioMutation.data.overall_risk}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-brand-surface border-2 border-brand-border">
                  <p className="text-xs text-brand-muted-foreground mb-1">Recommendation</p>
                  <Badge className={`${feasibilityConfig[scenarioMutation.data.feasibility].color} text-xs whitespace-normal`}>
                    {feasibilityConfig[scenarioMutation.data.feasibility].text}
                  </Badge>
                </div>
              </div>

              {/* Predicted Impacts */}
              <div className="bg-brand-surface rounded-lg p-3 border border-brand-border">
                <h4 className="font-semibold text-brand-text text-sm mb-2 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2 text-brand-primary" />
                  Predicted Impacts
                </h4>
                <div className="space-y-1 text-sm">
                  <p className="text-brand-text">
                    <span className="text-brand-muted-foreground">Energy:</span> {scenarioMutation.data.predicted_impacts.energy_change}
                  </p>
                  <p className="text-brand-text">
                    <span className="text-brand-muted-foreground">Stress:</span> {scenarioMutation.data.predicted_impacts.stress_change}
                  </p>
                  <p className="text-brand-text">
                    <span className="text-brand-muted-foreground">Symptoms:</span> {scenarioMutation.data.predicted_impacts.symptom_likelihood}
                  </p>
                  <p className="text-brand-text">
                    <span className="text-brand-muted-foreground">Fatigue:</span> {scenarioMutation.data.predicted_impacts.fatigue_risk}
                  </p>
                </div>
              </div>

              {/* Reasoning */}
              <div className="bg-brand-sky/30 rounded-lg p-3 border border-brand-border">
                <p className="text-xs font-semibold text-brand-text mb-1">Analysis Reasoning:</p>
                <p className="text-xs text-brand-text">{scenarioMutation.data.reasoning}</p>
              </div>

              {/* Mitigation Strategies */}
              {scenarioMutation.data.mitigation_strategies && scenarioMutation.data.mitigation_strategies.length > 0 && (
                <div className="bg-brand-secondary/20 rounded-lg p-3 border border-brand-secondary">
                  <h4 className="font-semibold text-brand-text text-sm mb-2">Mitigation Strategies:</h4>
                  <ul className="space-y-1">
                    {scenarioMutation.data.mitigation_strategies.map((strategy, idx) => (
                      <li key={idx} className="text-xs text-brand-text flex items-start">
                        <span className="text-brand-primary mr-2">✓</span>
                        {strategy}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Gradual Implementation */}
              {scenarioMutation.data.gradual_implementation?.recommended && (
                <div className="bg-brand-compass-cream/40 rounded-lg p-3 border border-brand-primary">
                  <h4 className="font-semibold text-brand-text text-sm mb-2 flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Gradual Implementation Recommended:
                  </h4>
                  <ol className="space-y-1 ml-4 list-decimal">
                    {scenarioMutation.data.gradual_implementation.plan.map((step, idx) => (
                      <li key={idx} className="text-xs text-brand-text">{step}</li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Monitoring Checklist */}
              {scenarioMutation.data.monitoring_checklist && scenarioMutation.data.monitoring_checklist.length > 0 && (
                <div className="bg-brand-muted rounded-lg p-3 border border-brand-border">
                  <h4 className="font-semibold text-brand-text text-sm mb-2">What to Monitor:</h4>
                  <ul className="space-y-1">
                    {scenarioMutation.data.monitoring_checklist.map((item, idx) => (
                      <li key={idx} className="text-xs text-brand-text flex items-start">
                        <span className="text-brand-primary mr-2">→</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}