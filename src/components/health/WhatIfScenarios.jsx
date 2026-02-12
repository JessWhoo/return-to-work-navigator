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

      const prompt = `You are a predictive health analytics AI for cancer survivors. Perform a 'what-if' scenario analysis.

CURRENT BASELINE:
- Average Energy Level: ${avgEnergy.toFixed(1)}/10 (last 30 days)
- Average Stress Level: ${avgStress.toFixed(1)}/10
- Average Symptom Severity: ${avgSymptomSeverity.toFixed(1)}/10
- Recent Symptom Frequency: ${symptomRecords.length} symptoms in 30 days
- Journey Stage: ${progress.journey_stage || 'planning'}

RECENT PATTERNS:
Energy Logs (last 7 days):
${recentEnergyLogs.slice(-7).map(log => 
  `${log.date}: Energy ${((log.morning_energy + log.afternoon_energy + log.evening_energy) / 3).toFixed(1)}/10, Stress ${log.stress_level}/10, Mood: ${log.mood}`
).join('\n')}

Recent Symptoms:
${symptomRecords.slice(0, 5).map(s => 
  `${s.date}: ${s.title} (Severity ${s.symptom_details?.severity}/10)`
).join('\n')}

PROPOSED SCENARIO:
${scenarioConfig.type === 'work_hours' ? `Increase work hours by ${scenarioConfig.change_amount} hours per ${scenarioConfig.timeframe}` : ''}
${scenarioConfig.type === 'reduce_hours' ? `Decrease work hours by ${scenarioConfig.change_amount} hours per ${scenarioConfig.timeframe}` : ''}
${scenarioConfig.type === 'add_commute' ? `Add ${scenarioConfig.change_amount} hours of commuting per ${scenarioConfig.timeframe}` : ''}
${scenarioConfig.type === 'remove_wfh' ? `Remove work-from-home option, return to office ${scenarioConfig.change_amount} days per ${scenarioConfig.timeframe}` : ''}
${scenarioConfig.type === 'add_activity' ? `Add ${scenarioConfig.change_amount} hours of additional activity per ${scenarioConfig.timeframe}` : ''}

ANALYSIS TASK:
Based on the user's current health patterns and the proposed change, predict:
1. How their energy levels might change (realistic estimate)
2. How stress levels might be affected
3. Likelihood of symptom increase or fatigue
4. Risk level of implementing this change
5. Specific recommendations to mitigate negative impacts
6. Gradual implementation strategy if needed

Be realistic and data-driven. Consider the user's current trajectory and symptom patterns.`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: 'object',
          properties: {
            overall_risk: {
              type: 'string',
              enum: ['low', 'moderate', 'high'],
              description: 'Overall risk of implementing this change'
            },
            feasibility: {
              type: 'string',
              enum: ['recommended', 'possible_with_caution', 'not_recommended'],
              description: 'Whether to proceed with this change'
            },
            predicted_impacts: {
              type: 'object',
              properties: {
                energy_change: { 
                  type: 'string',
                  description: 'e.g., "Likely to decrease by 1-2 points"'
                },
                stress_change: { type: 'string' },
                symptom_likelihood: { type: 'string' },
                fatigue_risk: { type: 'string' }
              }
            },
            reasoning: {
              type: 'string',
              description: 'Why these predictions are made based on current data'
            },
            mitigation_strategies: {
              type: 'array',
              items: { type: 'string' },
              description: 'How to reduce negative impacts'
            },
            gradual_implementation: {
              type: 'object',
              properties: {
                recommended: { type: 'boolean' },
                plan: { 
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Step-by-step gradual approach'
                }
              }
            },
            monitoring_checklist: {
              type: 'array',
              items: { type: 'string' },
              description: 'What to monitor if implementing this change'
            }
          },
          required: ['overall_risk', 'feasibility', 'predicted_impacts', 'reasoning']
        }
      });

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
    low: { color: 'text-green-400', bg: 'bg-green-500/20', border: 'border-green-500' },
    moderate: { color: 'text-amber-400', bg: 'bg-amber-500/20', border: 'border-amber-500' },
    high: { color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500' }
  };

  const feasibilityConfig = {
    recommended: { text: 'Recommended', color: 'bg-green-600' },
    possible_with_caution: { text: 'Possible with Caution', color: 'bg-amber-600' },
    not_recommended: { text: 'Not Recommended', color: 'bg-red-600' }
  };

  return (
    <Card className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border-2 border-purple-600 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Sparkles className="h-5 w-5 text-purple-400" />
          <span className="text-slate-200">What-If Scenario Analysis</span>
          <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
            Predictive
          </Badge>
        </CardTitle>
        <p className="text-xs text-slate-400 mt-1">
          Model potential changes before implementing them
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Scenario Configuration */}
        <div className="space-y-3">
          <div>
            <Label className="text-slate-300 text-sm">What change are you considering?</Label>
            <Select value={scenario.type} onValueChange={(v) => setScenario({ ...scenario, type: v })}>
              <SelectTrigger className="bg-slate-800 border-slate-600 text-slate-200 mt-1">
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
              <Label className="text-slate-300 text-sm">Amount (hours)</Label>
              <Input
                type="number"
                value={scenario.change_amount}
                onChange={(e) => setScenario({ ...scenario, change_amount: e.target.value })}
                placeholder="e.g., 2"
                className="bg-slate-800 border-slate-600 text-slate-200 mt-1"
              />
            </div>
            <div>
              <Label className="text-slate-300 text-sm">Per</Label>
              <Select value={scenario.timeframe} onValueChange={(v) => setScenario({ ...scenario, timeframe: v })}>
                <SelectTrigger className="bg-slate-800 border-slate-600 text-slate-200 mt-1">
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
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
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
              className="space-y-3 pt-4 border-t border-slate-700"
            >
              {/* Risk & Feasibility */}
              <div className="grid grid-cols-2 gap-3">
                <div className={`p-3 rounded-lg border-2 ${riskConfig[scenarioMutation.data.overall_risk].border} ${riskConfig[scenarioMutation.data.overall_risk].bg}`}>
                  <p className="text-xs text-slate-400 mb-1">Risk Level</p>
                  <p className={`text-lg font-bold ${riskConfig[scenarioMutation.data.overall_risk].color} capitalize`}>
                    {scenarioMutation.data.overall_risk}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-slate-800 border-2 border-slate-600">
                  <p className="text-xs text-slate-400 mb-1">Recommendation</p>
                  <Badge className={`${feasibilityConfig[scenarioMutation.data.feasibility].color} text-white text-xs`}>
                    {feasibilityConfig[scenarioMutation.data.feasibility].text}
                  </Badge>
                </div>
              </div>

              {/* Predicted Impacts */}
              <div className="bg-slate-800/70 rounded-lg p-3 border border-slate-600">
                <h4 className="font-semibold text-slate-200 text-sm mb-2 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2 text-purple-400" />
                  Predicted Impacts
                </h4>
                <div className="space-y-1 text-sm">
                  <p className="text-slate-300">
                    <span className="text-slate-400">Energy:</span> {scenarioMutation.data.predicted_impacts.energy_change}
                  </p>
                  <p className="text-slate-300">
                    <span className="text-slate-400">Stress:</span> {scenarioMutation.data.predicted_impacts.stress_change}
                  </p>
                  <p className="text-slate-300">
                    <span className="text-slate-400">Symptoms:</span> {scenarioMutation.data.predicted_impacts.symptom_likelihood}
                  </p>
                  <p className="text-slate-300">
                    <span className="text-slate-400">Fatigue:</span> {scenarioMutation.data.predicted_impacts.fatigue_risk}
                  </p>
                </div>
              </div>

              {/* Reasoning */}
              <div className="bg-blue-900/20 rounded-lg p-3 border border-blue-600">
                <p className="text-xs font-semibold text-blue-300 mb-1">Analysis Reasoning:</p>
                <p className="text-xs text-slate-300">{scenarioMutation.data.reasoning}</p>
              </div>

              {/* Mitigation Strategies */}
              {scenarioMutation.data.mitigation_strategies && scenarioMutation.data.mitigation_strategies.length > 0 && (
                <div className="bg-green-900/20 rounded-lg p-3 border border-green-600">
                  <h4 className="font-semibold text-green-300 text-sm mb-2">Mitigation Strategies:</h4>
                  <ul className="space-y-1">
                    {scenarioMutation.data.mitigation_strategies.map((strategy, idx) => (
                      <li key={idx} className="text-xs text-slate-300 flex items-start">
                        <span className="text-green-400 mr-2">✓</span>
                        {strategy}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Gradual Implementation */}
              {scenarioMutation.data.gradual_implementation?.recommended && (
                <div className="bg-amber-900/20 rounded-lg p-3 border border-amber-600">
                  <h4 className="font-semibold text-amber-300 text-sm mb-2 flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Gradual Implementation Recommended:
                  </h4>
                  <ol className="space-y-1 ml-4 list-decimal">
                    {scenarioMutation.data.gradual_implementation.plan.map((step, idx) => (
                      <li key={idx} className="text-xs text-slate-300">{step}</li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Monitoring Checklist */}
              {scenarioMutation.data.monitoring_checklist && scenarioMutation.data.monitoring_checklist.length > 0 && (
                <div className="bg-purple-900/20 rounded-lg p-3 border border-purple-600">
                  <h4 className="font-semibold text-purple-300 text-sm mb-2">What to Monitor:</h4>
                  <ul className="space-y-1">
                    {scenarioMutation.data.monitoring_checklist.map((item, idx) => (
                      <li key={idx} className="text-xs text-slate-300 flex items-start">
                        <span className="text-purple-400 mr-2">→</span>
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