import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Loader2, Sparkles, X } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

const MEETING_TYPES = {
  accommodation_request: 'Accommodation Request',
  return_to_work_plan: 'Return to Work Plan',
  performance_review: 'Performance Review',
  hr_discussion: 'HR Discussion',
  supervisor_checkin: 'Supervisor Check-in',
  disclosure: 'Medical Disclosure',
  other: 'Other'
};

const COMMON_ACCOMMODATIONS = [
  'Flexible start/end times',
  'Remote work or hybrid schedule',
  'Reduced hours / phased return',
  'More frequent breaks',
  'Private space for medical needs',
  'Ergonomic equipment',
  'Modified duties during recovery',
  'Extended deadlines when needed'
];

export default function MeetingPrepForm({ existing, onSave, onCancel }) {
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const [form, setForm] = useState({
    title: existing?.title || '',
    meeting_date: existing?.meeting_date || '',
    meeting_type: existing?.meeting_type || 'accommodation_request',
    attendees: existing?.attendees || '',
    goals: existing?.goals || '',
    talking_points: existing?.talking_points || [''],
    accommodation_requests: existing?.accommodation_requests || [],
    anticipated_objections: existing?.anticipated_objections || [],
    documents_to_bring: existing?.documents_to_bring || [],
    status: existing?.status || 'drafting'
  });

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  // --- Talking points ---
  const updatePoint = (idx, val) => {
    const arr = [...form.talking_points];
    arr[idx] = val;
    update('talking_points', arr);
  };
  const addPoint = () => update('talking_points', [...form.talking_points, '']);
  const removePoint = (idx) => update('talking_points', form.talking_points.filter((_, i) => i !== idx));

  // --- Accommodations ---
  const addAccommodation = (text = '') => update('accommodation_requests', [
    ...form.accommodation_requests,
    { accommodation: text, reason: '' }
  ]);
  const updateAccommodation = (idx, field, val) => {
    const arr = [...form.accommodation_requests];
    arr[idx] = { ...arr[idx], [field]: val };
    update('accommodation_requests', arr);
  };
  const removeAccommodation = (idx) => update('accommodation_requests', form.accommodation_requests.filter((_, i) => i !== idx));

  // --- Documents ---
  const addDocument = () => update('documents_to_bring', [...form.documents_to_bring, '']);
  const updateDocument = (idx, val) => {
    const arr = [...form.documents_to_bring];
    arr[idx] = val;
    update('documents_to_bring', arr);
  };
  const removeDocument = (idx) => update('documents_to_bring', form.documents_to_bring.filter((_, i) => i !== idx));

  // --- AI Suggestions ---
  const generateAISuggestions = async () => {
    setAiLoading(true);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are helping a cancer survivor prepare for a workplace meeting. Generate practical, specific suggestions.

Meeting type: ${MEETING_TYPES[form.meeting_type]}
Attendees: ${form.attendees || 'not specified'}
Goals: ${form.goals || 'not specified'}
Existing talking points: ${form.talking_points.filter(Boolean).join('; ') || 'none yet'}
Requested accommodations: ${form.accommodation_requests.map(a => a.accommodation).join('; ') || 'none yet'}

Generate:
1. 3-4 specific talking points they should raise
2. 2-3 potential employer objections they should be ready for
3. 2-3 documents they should bring

Be concise and practical.`,
      response_json_schema: {
        type: 'object',
        properties: {
          talking_points: { type: 'array', items: { type: 'string' } },
          anticipated_objections: { type: 'array', items: { type: 'string' } },
          documents_to_bring: { type: 'array', items: { type: 'string' } }
        }
      }
    });
    setForm(prev => ({
      ...prev,
      talking_points: [...prev.talking_points.filter(Boolean), ...(result.talking_points || [])],
      anticipated_objections: [...prev.anticipated_objections, ...(result.anticipated_objections || [])],
      documents_to_bring: [...prev.documents_to_bring.filter(Boolean), ...(result.documents_to_bring || [])]
    }));
    setAiLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      ...form,
      talking_points: form.talking_points.filter(Boolean),
      documents_to_bring: form.documents_to_bring.filter(Boolean)
    };
    if (existing?.id) {
      await base44.entities.MeetingPrep.update(existing.id, payload);
    } else {
      await base44.entities.MeetingPrep.create(payload);
    }
    queryClient.invalidateQueries(['meeting-preps']);
    setSaving(false);
    onSave?.();
  };

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <Card className="bg-slate-800/80 border-purple-600/40">
        <CardHeader><CardTitle className="text-slate-200 text-base">Meeting Details</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Meeting Title *</label>
              <Input value={form.title} onChange={e => update('title', e.target.value)}
                placeholder="e.g., Accommodation Request with HR"
                className="bg-slate-900 border-slate-600 text-slate-200" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Meeting Date</label>
              <Input type="date" value={form.meeting_date} onChange={e => update('meeting_date', e.target.value)}
                className="bg-slate-900 border-slate-600 text-slate-200" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Meeting Type</label>
              <Select value={form.meeting_type} onValueChange={v => update('meeting_type', v)}>
                <SelectTrigger className="bg-slate-900 border-slate-600 text-slate-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(MEETING_TYPES).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Attendees</label>
              <Input value={form.attendees} onChange={e => update('attendees', e.target.value)}
                placeholder="e.g., HR Manager, Direct Supervisor"
                className="bg-slate-900 border-slate-600 text-slate-200" />
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Meeting Goals</label>
            <Textarea value={form.goals} onChange={e => update('goals', e.target.value)}
              placeholder="What do you want to achieve from this meeting?"
              className="bg-slate-900 border-slate-600 text-slate-200 min-h-[70px]" />
          </div>
        </CardContent>
      </Card>

      {/* AI Suggestions */}
      <div className="flex justify-end">
        <Button onClick={generateAISuggestions} disabled={aiLoading}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
          {aiLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
          {aiLoading ? 'Generating...' : 'AI: Suggest Talking Points & Docs'}
        </Button>
      </div>

      {/* Talking Points */}
      <Card className="bg-slate-800/80 border-purple-600/40">
        <CardHeader>
          <CardTitle className="text-slate-200 text-base flex items-center justify-between">
            Talking Points
            <Button size="sm" variant="ghost" onClick={addPoint} className="text-purple-400 hover:text-purple-300">
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {form.talking_points.map((pt, idx) => (
            <div key={idx} className="flex gap-2">
              <span className="text-slate-500 text-sm pt-2 w-5 flex-shrink-0">{idx + 1}.</span>
              <Input value={pt} onChange={e => updatePoint(idx, e.target.value)}
                placeholder="Enter a talking point..."
                className="bg-slate-900 border-slate-600 text-slate-200 flex-1" />
              <Button size="icon" variant="ghost" onClick={() => removePoint(idx)}
                className="text-slate-500 hover:text-red-400 flex-shrink-0">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {form.talking_points.length === 0 && (
            <p className="text-slate-500 text-sm italic">No talking points yet. Use AI suggestions or add manually.</p>
          )}
        </CardContent>
      </Card>

      {/* Accommodation Requests */}
      <Card className="bg-slate-800/80 border-purple-600/40">
        <CardHeader>
          <CardTitle className="text-slate-200 text-base flex items-center justify-between">
            Accommodation Requests
            <Button size="sm" variant="ghost" onClick={() => addAccommodation()} className="text-purple-400 hover:text-purple-300">
              <Plus className="h-4 w-4 mr-1" /> Add Custom
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Quick add common accommodations */}
          <div>
            <p className="text-xs text-slate-400 mb-2">Quick add common accommodations:</p>
            <div className="flex flex-wrap gap-2">
              {COMMON_ACCOMMODATIONS.map(a => (
                <button key={a} onClick={() => addAccommodation(a)}
                  className="text-xs px-2 py-1 rounded-full border border-slate-600 text-slate-300 hover:border-purple-500 hover:text-purple-300 transition-colors">
                  + {a}
                </button>
              ))}
            </div>
          </div>

          {form.accommodation_requests.map((req, idx) => (
            <div key={idx} className="bg-slate-900/60 rounded-lg p-3 space-y-2">
              <div className="flex gap-2 items-start">
                <div className="flex-1 space-y-2">
                  <Input value={req.accommodation} onChange={e => updateAccommodation(idx, 'accommodation', e.target.value)}
                    placeholder="Accommodation being requested..."
                    className="bg-slate-800 border-slate-600 text-slate-200" />
                  <Textarea value={req.reason} onChange={e => updateAccommodation(idx, 'reason', e.target.value)}
                    placeholder="Why you need this accommodation (medical basis)..."
                    className="bg-slate-800 border-slate-600 text-slate-200 min-h-[55px] text-sm" />
                </div>
                <Button size="icon" variant="ghost" onClick={() => removeAccommodation(idx)}
                  className="text-slate-500 hover:text-red-400 flex-shrink-0 mt-1">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          {form.accommodation_requests.length === 0 && (
            <p className="text-slate-500 text-sm italic">No accommodation requests added yet.</p>
          )}
        </CardContent>
      </Card>

      {/* Anticipated Objections */}
      {form.anticipated_objections.length > 0 && (
        <Card className="bg-slate-800/80 border-amber-600/30">
          <CardHeader><CardTitle className="text-slate-200 text-base">Anticipated Employer Objections</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {form.anticipated_objections.map((obj, idx) => (
              <div key={idx} className="flex gap-2 items-start">
                <Badge className="bg-amber-900/40 text-amber-300 border-amber-600/40 mt-0.5 flex-shrink-0">?</Badge>
                <p className="text-sm text-slate-300 flex-1">{obj}</p>
                <Button size="icon" variant="ghost"
                  onClick={() => update('anticipated_objections', form.anticipated_objections.filter((_, i) => i !== idx))}
                  className="text-slate-500 hover:text-red-400 flex-shrink-0">
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Documents to Bring */}
      <Card className="bg-slate-800/80 border-purple-600/40">
        <CardHeader>
          <CardTitle className="text-slate-200 text-base flex items-center justify-between">
            Documents to Bring
            <Button size="sm" variant="ghost" onClick={addDocument} className="text-purple-400 hover:text-purple-300">
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {form.documents_to_bring.map((doc, idx) => (
            <div key={idx} className="flex gap-2">
              <Input value={doc} onChange={e => updateDocument(idx, e.target.value)}
                placeholder="e.g., Doctor's note, ADA accommodation letter..."
                className="bg-slate-900 border-slate-600 text-slate-200 flex-1" />
              <Button size="icon" variant="ghost" onClick={() => removeDocument(idx)}
                className="text-slate-500 hover:text-red-400 flex-shrink-0">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {form.documents_to_bring.length === 0 && (
            <p className="text-slate-500 text-sm italic">No documents listed. Use AI suggestions to generate ideas.</p>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3 justify-end">
        {onCancel && (
          <Button variant="ghost" onClick={onCancel} className="text-slate-400 hover:text-slate-200">
            Cancel
          </Button>
        )}
        <Button onClick={handleSave} disabled={saving || !form.title}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
          {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
          {existing?.id ? 'Save Changes' : 'Create Meeting Prep'}
        </Button>
      </div>
    </div>
  );
}