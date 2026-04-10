import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Copy, CheckCircle, TrendingUp, Zap, Shield } from 'lucide-react';
import { toast } from 'sonner';

const SECTIONS = [
  { key: 'journey_stage', label: 'Journey Stage', icon: TrendingUp },
  { key: 'checklist', label: 'Checklist Progress', icon: CheckCircle },
  { key: 'energy', label: 'Energy & Mood Logs', icon: Zap },
  { key: 'accommodations', label: 'Accommodations', icon: Shield },
];

export default function ProgressReportTab() {
  const [selected, setSelected] = useState(new Set(['journey_stage', 'checklist']));
  const [generatedReport, setGeneratedReport] = useState('');
  const [generating, setGenerating] = useState(false);

  const { data: progress } = useQuery({
    queryKey: ['userProgress'],
    queryFn: async () => {
      const list = await base44.entities.UserProgress.list();
      return list[0] || null;
    }
  });

  const toggleSection = (key) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const buildContext = () => {
    const parts = [];
    if (selected.has('journey_stage') && progress?.journey_stage) {
      parts.push(`Journey Stage: ${progress.journey_stage.replace(/_/g, ' ')}`);
    }
    if (selected.has('checklist') && progress?.completed_checklist_items) {
      parts.push(`Completed Checklist Items: ${progress.completed_checklist_items.length}`);
    }
    if (selected.has('energy') && progress?.energy_logs?.length) {
      const last = progress.energy_logs[progress.energy_logs.length - 1];
      parts.push(`Latest Mood: ${last.mood || 'N/A'}, Stress Level: ${last.stress_level || 'N/A'}/10`);
    }
    if (selected.has('accommodations') && progress?.accommodations_requested?.length) {
      const names = progress.accommodations_requested.map(a => a.type).join(', ');
      parts.push(`Accommodations Requested: ${names}`);
    }
    return parts.join('\n');
  };

  const generateReport = async () => {
    const context = buildContext();
    if (!context) { toast.error('Select at least one section'); return; }
    setGenerating(true);
    try {
      const text = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a compassionate return-to-work coach. Generate a concise, professional progress summary that a cancer survivor can share with their mentor, coach, or support group. Use warm, encouraging language. Include only the data provided below. Format as readable paragraphs (no bullet lists).

Progress Data:
${context}

Write a 2-3 paragraph shareable progress report. Highlight achievements and frame any challenges positively.`,
      });
      setGeneratedReport(text.trim());
    } finally {
      setGenerating(false);
    }
  };

  const copyReport = async () => {
    await navigator.clipboard.writeText(generatedReport);
    toast.success('Report copied to clipboard!');
  };

  const stageLabel = progress?.journey_stage?.replace(/_/g, ' ') || 'Not set';

  return (
    <div className="space-y-6 mt-4">
      <Card className="bg-slate-800 border-slate-600">
        <CardHeader>
          <CardTitle className="text-slate-100 text-lg flex items-center gap-2">
            <FileText className="h-5 w-5 text-teal-400" />
            Choose What to Include
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {SECTIONS.map(({ key, label, icon: Icon }) => {
            const active = selected.has(key);
            return (
              <button key={key} onClick={() => toggleSection(key)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all text-left ${
                  active ? 'border-teal-500 bg-teal-900/30' : 'border-slate-600 bg-slate-700/40 hover:border-slate-500'
                }`}>
                <div className={`p-2 rounded-lg ${active ? 'bg-teal-600' : 'bg-slate-600'}`}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
                <span className={`font-medium ${active ? 'text-teal-200' : 'text-slate-300'}`}>{label}</span>
                {active && <Badge className="ml-auto bg-teal-600 text-white text-xs">Included</Badge>}
              </button>
            );
          })}
          <Button onClick={generateReport} disabled={generating || selected.size === 0}
            className="w-full bg-teal-600 hover:bg-teal-700 mt-2">
            {generating ? 'Generating…' : 'Generate Shareable Report'}
          </Button>
        </CardContent>
      </Card>

      {generatedReport && (
        <Card className="bg-slate-800 border-teal-500 border-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-teal-300 text-lg">Your Progress Report</CardTitle>
              <Button size="sm" variant="outline" onClick={copyReport}
                className="border-teal-500 text-teal-300 hover:bg-teal-900/30">
                <Copy className="h-4 w-4 mr-1" /> Copy
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-900 rounded-lg p-4 text-slate-200 text-sm leading-relaxed whitespace-pre-wrap border border-slate-700">
              {generatedReport}
            </div>
            <p className="text-xs text-slate-500 mt-3 italic">
              This report was generated from only the sections you selected. Copy and share it with your mentor or support group.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}