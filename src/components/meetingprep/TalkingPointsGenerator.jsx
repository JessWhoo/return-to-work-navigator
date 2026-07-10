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
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are helping a cancer survivor prepare talking points for a meeting with their manager about returning to work.

Scenario focus: ${tpl ? tpl.name : 'General return-to-work discussion'}
Their work constraints: ${allConstraints || 'None specified'}
Their current energy level: ${ENERGY_LABELS[energy - 1]} (${energy}/5)

Write 5-7 concise, professional, first-person talking points they can say directly to their manager. Points should:
- Be confident and collaborative, not apologetic
- Reflect their stated constraints and energy level realistically (lower energy = more emphasis on pacing, breaks, phased plans)
- Include at least one concrete, specific proposal (schedule, phasing, or accommodation)
- Avoid medical jargon and oversharing medical details`,
      response_json_schema: {
        type: 'object',
        properties: { talking_points: { type: 'array', items: { type: 'string' } } },
      },
    });
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
    <Card className="bg-white border-2 border-violet-200 shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg text-slate-900">
          <Sparkles className="h-5 w-5 text-violet-600" />
          Talking Points Generator
        </CardTitle>
        <p className="text-sm text-slate-600 font-medium">
          Get custom talking points for your manager meeting based on your constraints and energy level.
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Templates */}
        <div>
          <p className="text-xs font-bold uppercase text-slate-600 mb-2">Start from a template</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {SCENARIO_TEMPLATES.map((tpl) => (
              <button
                key={tpl.id}
                onClick={() => applyTemplate(tpl)}
                className={`text-left p-3 rounded-xl border-2 transition-all ${
                  selectedTemplate === tpl.id
                    ? 'border-violet-500 bg-violet-50 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-violet-300'
                }`}
              >
                <p className="text-sm font-bold text-slate-900">{tpl.name}</p>
                <p className="text-xs text-slate-600 mt-1">{tpl.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Constraints */}
        <div>
          <p className="text-xs font-bold uppercase text-slate-600 mb-2">Your work constraints</p>
          <div className="flex flex-wrap gap-2">
            {CONSTRAINT_OPTIONS.map((c) => (
              <button
                key={c}
                onClick={() => toggleConstraint(c)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all ${
                  constraints.includes(c)
                    ? 'bg-violet-600 text-white border-transparent'
                    : 'bg-white text-slate-700 border-slate-300 hover:border-violet-400'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <Textarea
            value={customConstraints}
            onChange={(e) => setCustomConstraints(e.target.value)}
            placeholder="Anything else? (e.g. 'I commute 90 minutes each way')"
            className="mt-2 bg-white border-slate-300 text-sm"
            rows={2}
          />
        </div>

        {/* Energy level */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold uppercase text-slate-600">Current energy level</p>
            <span className="text-sm font-bold text-violet-700">{ENERGY_LABELS[energy - 1]}</span>
          </div>
          <Slider value={[energy]} onValueChange={([v]) => setEnergy(v)} min={1} max={5} step={1} />
        </div>

        <Button
          onClick={generate}
          disabled={generating}
          className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-bold"
        >
          {generating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
          {generating ? 'Generating…' : 'Generate Custom Talking Points'}
        </Button>

        {/* Results */}
        {points.length > 0 && (
          <div className="bg-violet-50 border-2 border-violet-200 rounded-xl p-4 space-y-3">
            <ol className="space-y-2">
              {points.map((pt, i) => (
                <li key={i} className="flex gap-2 text-sm text-slate-800">
                  <span className="text-violet-700 font-bold flex-shrink-0">{i + 1}.</span> {pt}
                </li>
              ))}
            </ol>
            <div className="flex gap-2 flex-wrap pt-1">
              <Button size="sm" variant="outline" onClick={copyAll} className="border-slate-300">
                {copied ? <Check className="h-4 w-4 mr-1 text-green-600" /> : <Copy className="h-4 w-4 mr-1" />}
                {copied ? 'Copied' : 'Copy All'}
              </Button>
              <Button size="sm" onClick={saveAsPrep} disabled={saving || saved}
                className="bg-violet-600 hover:bg-violet-700 text-white">
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