import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Copy, CheckCircle, TrendingUp, Zap, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { useUserProgress } from '@/hooks/useUserProgress';

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

  const { data: progress } = useUserProgress();

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
      const text = (await base44.functions.invoke('aiGateway', { operation: 'progress_report', data: { context } })).data.result;
      setGeneratedReport(text.trim());
    } finally {
      setGenerating(false);
    }
  };

  const copyReport = async () => {
    await navigator.clipboard.writeText(generatedReport);
    toast.success('Report copied to clipboard!');
  };

  return (
    <div className="space-y-6 mt-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-brand-text text-lg flex items-center gap-2">
            <FileText className="h-5 w-5 text-brand-primary" />
            Choose What to Include
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {SECTIONS.map(({ key, label, icon: Icon }) => {
            const active = selected.has(key);
            return (
              <button key={key} onClick={() => toggleSection(key)} aria-pressed={active}
                className={`nv-btn w-full justify-start text-left !whitespace-normal ${active ? '' : 'nv-btn--outline'}`}>
                <Icon className="h-4 w-4 shrink-0" />
                <span className="font-medium">{label}</span>
                {active && <span className="nv-chip ml-auto">Included</span>}
              </button>
            );
          })}
          <Button onClick={generateReport} disabled={generating || selected.size === 0} className="w-full mt-2 !whitespace-normal">
            {generating ? 'Generating…' : 'Generate Shareable Report'}
          </Button>
        </CardContent>
      </Card>
      {generatedReport && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="text-brand-text text-lg">Your Progress Report</CardTitle>
              <Button size="sm" variant="outline" onClick={copyReport}>
                <Copy className="h-4 w-4 mr-1" /> Copy
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-brand-muted rounded-lg p-4 text-brand-text text-sm whitespace-pre-wrap break-words border border-brand-border">
              {generatedReport}
            </div>
            <p className="text-xs text-brand-muted-foreground mt-3 italic">
              This report was generated from only the sections you selected. Copy and share it with your mentor or support group.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}