import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Sparkles, Loader2, Copy, Save, Check } from 'lucide-react';
import { SCENARIO_TEMPLATES, CONSTRAINT_OPTIONS } from './talkingPointTemplates';

const ENERGY_LABELS = ['Very low', 'Low', 'Moderate', 'Good', 'High'];

export default function TalkingPointsGenerator({ onSaved }) {
  const queryClient = useQueryClient();
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [constraints, setConstraints] = useState([]);
  const [customConstraints, setCustomConstraints] = useState('');
  const [energy, setEnergy] = useState(3);
  const [points, setPoints] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const applyTemplate = (tpl) => {
    setSelectedTemplate(tpl.id);
    setConstraints((prev) => [...new Set([...prev, ...tpl.constraints.filter((c) => CONSTRAINT_OPTIONS.includes(c))])]);
    setPoints(tpl.points);
    setSaved(false);
  };

  const toggleConstraint = (c) => {
    setConstraints((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));
  };

  const generate = async () => {
    setGenerating(true);
    setSaved(false);
    const allConstraints = [...constraints, customConstraints.trim()].filter(Boolean).join('; ');
    const tpl = SCENARIO_TEMPLATES.find((t) => t.id === selectedTemplate);
    const result = (await base44.functions.invoke('aiGateway', {
      operation: 'talking_points',
      data: { scenarioName: tpl ? tpl.name : 'General return-to-work discussion', constraints: allConstraints, energyLabel: ENERGY_LABELS[energy - 1], energy },
    })).data.result;
    setPoints(result.talking_points || []);
    setGenerating(false);
  };

  const copyAll = async () => {
    await navigator.clipboard.writeText(points.map((p, i) => `${i + 1}. ${p}`).join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const saveAsPrep = async () => {
    setSaving(true);
    const tpl = SCENARIO_TEMPLATES.find((t) => t.id === selectedTemplate);
    await base44.entities.MeetingPrep.create({
      title: tpl ? `${tpl.name} — Manager Meeting` : 'Manager Meeting Talking Points',
      meeting_type: selectedTemplate === 'gradual_return' ? 'return_to_work_plan' : 'accommodation_request',
      goals: `Discuss: ${[...constraints, customConstraints.trim()].filter(Boolean).join(', ') || 'return-to-work needs'}. Energy level: ${ENERGY_LABELS[energy - 1]}.`,
      talking_points: points,
      status: 'drafting',
    });
    queryClient.invalidateQueries(['meeting-preps']);
    setSaving(false);
    setSaved(true);
    onSaved?.();
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg text-brand-text">
          <Sparkles className="h-5 w-5 text-brand-primary shrink-0" />
          Talking Points Generator
        </CardTitle>
        <p className="text-sm text-brand-muted-foreground font-medium">
          Get custom talking points for your manager meeting based on your constraints and energy level.
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        <div>
          <p className="nv-eyebrow mb-2">Start from a template</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {SCENARIO_TEMPLATES.map((tpl) => (
              <button key={tpl.id} onClick={() => applyTemplate(tpl)} aria-pressed={selectedTemplate === tpl.id}
                className={`nv-card text-left p-3 cursor-pointer ${selectedTemplate === tpl.id ? 'nv-card--muted border-brand-primary' : ''}`}>
                <p className="text-sm font-bold text-brand-text">{tpl.name}</p>
                <p className="text-xs text-brand-muted-foreground mt-1">{tpl.description}</p>
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="nv-eyebrow mb-2">Your work constraints</p>
          <div className="flex flex-wrap gap-2">
            {CONSTRAINT_OPTIONS.map((c) => (
              <button key={c} onClick={() => toggleConstraint(c)} aria-pressed={constraints.includes(c)}
                className={`nv-btn nv-btn--sm !whitespace-normal ${constraints.includes(c) ? '' : 'nv-btn--outline'}`}>
                {c}
              </button>
            ))}
          </div>
          <Textarea value={customConstraints} onChange={(e) => setCustomConstraints(e.target.value)}
            placeholder="Anything else? (e.g. 'I commute 90 minutes each way')" className="mt-2 text-sm" rows={2} />
        </div>
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <p className="nv-eyebrow">Current energy level</p>
            <span className="text-sm font-bold text-brand-primary">{ENERGY_LABELS[energy - 1]}</span>
          </div>
          <Slider value={[energy]} onValueChange={([v]) => setEnergy(v)} min={1} max={5} step={1} />
        </div>
        <Button onClick={generate} disabled={generating} className="w-full !whitespace-normal">
          {generating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
          {generating ? 'Generating…' : 'Generate Custom Talking Points'}
        </Button>
        {points.length > 0 && (
          <div className="nv-card nv-card--muted p-4 space-y-3">
            <ol className="space-y-2">
              {points.map((pt, i) => (
                <li key={i} className="flex gap-2 text-sm text-brand-text">
                  <span className="text-brand-primary font-bold flex-shrink-0">{i + 1}.</span> {pt}
                </li>
              ))}
            </ol>
            <div className="flex gap-2 flex-wrap pt-1">
              <Button size="sm" variant="outline" onClick={copyAll}>
                {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                {copied ? 'Copied' : 'Copy All'}
              </Button>
              <Button size="sm" onClick={saveAsPrep} disabled={saving || saved} className="!whitespace-normal">
                {saving ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : saved ? <Check className="h-4 w-4 mr-1" /> : <Save className="h-4 w-4 mr-1" />}
                {saved ? 'Saved to Meeting Preps' : 'Save as Meeting Prep'}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}