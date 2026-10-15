import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import BottomSheetSelect from '@/components/ui/bottom-sheet-select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Loader2, Sparkles, X } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

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
    try {
      const response = await base44.functions.invoke('aiGateway', {
        operation: 'meeting_prep_suggestions',
        data: {
          meetingTypeLabel: MEETING_TYPES[form.meeting_type],
          attendees: form.attendees,
          goals: form.goals,
          talkingPoints: form.talking_points.filter(Boolean).join('; '),
          accommodations: form.accommodation_requests.map(a => a.accommodation).join('; '),
        },
      });
      const result = response?.data?.result;
      if (!result) {
        throw new Error('No suggestions were returned. Please try again.');
      }
      setForm(prev => ({
        ...prev,
        talking_points: [...prev.talking_points.filter(Boolean), ...(result.talking_points || [])],
        anticipated_objections: [...prev.anticipated_objections, ...(result.anticipated_objections || [])],
        documents_to_bring: [...prev.documents_to_bring.filter(Boolean), ...(result.documents_to_bring || [])]
      }));
    } catch (err) {
      toast.error(err?.message || 'Could not generate AI suggestions right now. Please try again.');
    } finally {
      setAiLoading(false);
    }
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
      <Card className="">
        <CardHeader><CardTitle className="text-brand-text text-base">Meeting Details</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-brand-muted-foreground mb-1 block">Meeting Title *</label>
              <Input aria-label="Meeting title" value={form.title} onChange={e => update('title', e.target.value)}
                placeholder="e.g., Accommodation Request with HR"
                className="nv-input" />
            </div>
            <div>
              <label className="text-xs text-brand-muted-foreground mb-1 block">Meeting Date</label>
              <Input aria-label="Meeting date" type="date" value={form.meeting_date} onChange={e => update('meeting_date', e.target.value)}
                className="nv-input" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-brand-muted-foreground mb-1 block">Meeting Type</label>
              <BottomSheetSelect value={form.meeting_type} onValueChange={v => update('meeting_type', v)}
                title="Meeting Type" className="min-h-11"
                options={Object.entries(MEETING_TYPES).map(([value, label]) => ({ value, label }))} />
            </div>
            <div>
              <label className="text-xs text-brand-muted-foreground mb-1 block">Attendees</label>
              <Input aria-label="Attendees" value={form.attendees} onChange={e => update('attendees', e.target.value)}
                placeholder="e.g., HR Manager, Direct Supervisor"
                className="nv-input" />
            </div>
          </div>
          <div>
            <label className="text-xs text-brand-muted-foreground mb-1 block">Meeting Goals</label>
            <Textarea aria-label="Meeting goals" value={form.goals} onChange={e => update('goals', e.target.value)}
              placeholder="What do you want to achieve from this meeting?"
              className="nv-input min-h-[70px]" />
          </div>
        </CardContent>
      </Card>

      {/* AI Suggestions */}
      <div className="flex justify-end">
        <Button onClick={generateAISuggestions} disabled={aiLoading}
          className="!whitespace-normal">
          {aiLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
          {aiLoading ? 'Generating...' : 'AI: Suggest Talking Points & Docs'}
        </Button>
      </div>

      {/* Talking Points */}
      <Card className="">
        <CardHeader>
          <CardTitle className="text-brand-text text-base flex flex-wrap items-center justify-between gap-2">
            Talking Points
            <Button size="sm" variant="ghost" onClick={addPoint} className="shrink-0">
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {form.talking_points.map((pt, idx) => (
            <div key={idx} className="flex gap-2">
              <span className="text-brand-muted-foreground text-sm pt-2 w-5 flex-shrink-0">{idx + 1}.</span>
              <Input aria-label="Talking point" value={pt} onChange={e => updatePoint(idx, e.target.value)}
                placeholder="Enter a talking point..."
                className="nv-input min-w-0 flex-1" />
              <Button size="icon" variant="ghost" onClick={() => removePoint(idx)}
                className="text-destructive flex-shrink-0">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {form.talking_points.length === 0 && (
            <p className="text-brand-muted-foreground text-sm italic">No talking points yet. Use AI suggestions or add manually.</p>
          )}
        </CardContent>
      </Card>

      {/* Accommodation Requests */}
      <Card className="">
        <CardHeader>
          <CardTitle className="text-brand-text text-base flex flex-wrap items-center justify-between gap-2">
            Accommodation Requests
            <Button size="sm" variant="ghost" onClick={() => addAccommodation()} className="shrink-0">
              <Plus className="h-4 w-4 mr-1" /> Add Custom
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Quick add common accommodations */}
          <div>
            <p className="text-xs text-brand-muted-foreground mb-2">Quick add common accommodations:</p>
            <div className="flex flex-wrap gap-2">
              {COMMON_ACCOMMODATIONS.map(a => (
                <button key={a} onClick={() => addAccommodation(a)}
                  className="nv-btn nv-btn--outline nv-btn--sm !whitespace-normal">
                  + {a}
                </button>
              ))}
            </div>
          </div>

          {form.accommodation_requests.map((req, idx) => (
            <div key={idx} className="nv-card nv-card--muted space-y-3 p-4">
              <div className="flex gap-2 items-start">
                <div className="min-w-0 flex-1 space-y-2">
                  <Input aria-label="Accommodation being requested" value={req.accommodation} onChange={e => updateAccommodation(idx, 'accommodation', e.target.value)}
                    placeholder="Accommodation being requested..."
                    className="nv-input" />
                  <Textarea aria-label="Reason for accommodation" value={req.reason} onChange={e => updateAccommodation(idx, 'reason', e.target.value)}
                    placeholder="Why you need this accommodation (medical basis)..."
                    className="nv-input min-h-[55px] text-sm" />
                </div>
                <Button size="icon" variant="ghost" onClick={() => removeAccommodation(idx)}
                  className="text-destructive flex-shrink-0 mt-1">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          {form.accommodation_requests.length === 0 && (
            <p className="text-brand-muted-foreground text-sm italic">No accommodation requests added yet.</p>
          )}
        </CardContent>
      </Card>

      {/* Anticipated Objections */}
      {form.anticipated_objections.length > 0 && (
        <Card className="nv-card--muted">
          <CardHeader><CardTitle className="text-brand-text text-base">Anticipated Employer Objections</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {form.anticipated_objections.map((obj, idx) => (
              <div key={idx} className="flex gap-2 items-start">
                <Badge className="bg-brand-compass-cream text-brand-text border-brand-border mt-0.5 flex-shrink-0">?</Badge>
                <p className="text-sm text-brand-text flex-1">{obj}</p>
                <Button size="icon" variant="ghost"
                  onClick={() => update('anticipated_objections', form.anticipated_objections.filter((_, i) => i !== idx))}
                  className="text-destructive flex-shrink-0">
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Documents to Bring */}
      <Card className="">
        <CardHeader>
          <CardTitle className="text-brand-text text-base flex flex-wrap items-center justify-between gap-2">
            Documents to Bring
            <Button size="sm" variant="ghost" onClick={addDocument} className="shrink-0">
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {form.documents_to_bring.map((doc, idx) => (
            <div key={idx} className="flex gap-2">
              <Input aria-label="Document to bring" value={doc} onChange={e => updateDocument(idx, e.target.value)}
                placeholder="e.g., Doctor's note, ADA accommodation letter..."
                className="nv-input min-w-0 flex-1" />
              <Button size="icon" variant="ghost" onClick={() => removeDocument(idx)}
                className="text-destructive flex-shrink-0">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {form.documents_to_bring.length === 0 && (
            <p className="text-brand-muted-foreground text-sm italic">No documents listed. Use AI suggestions to generate ideas.</p>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col-reverse gap-3 border-t border-brand-border pt-4 sm:flex-row sm:justify-end">
        {onCancel && (
          <Button variant="ghost" onClick={onCancel} className="">
            Cancel
          </Button>
        )}
        <Button onClick={handleSave} disabled={saving || !form.title}
          className="!whitespace-normal">
          {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
          {existing?.id ? 'Save Changes' : 'Create Meeting Prep'}
        </Button>
      </div>
    </div>
  );
}