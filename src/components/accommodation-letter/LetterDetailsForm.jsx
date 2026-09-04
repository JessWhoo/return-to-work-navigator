import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const fields = [['name', 'Your name', 'Jane Doe'], ['employer', 'Company or organization', 'Your employer'], ['recipient', 'Recipient name', 'Manager or HR contact'], ['role', 'Your job title', 'Your role']];

export default function LetterDetailsForm({ form, onChange }) {
  return <div className="space-y-4">
    <div className="grid gap-4 sm:grid-cols-2">{fields.map(([key, label, placeholder]) => <div key={key} className="space-y-1.5"><Label htmlFor={key} className="font-bold text-slate-800">{label}</Label><Input id={key} value={form[key]} onChange={onChange(key)} placeholder={placeholder} /></div>)}</div>
    <div className="space-y-1.5"><Label htmlFor="context" className="font-bold text-slate-800">Optional context</Label><Textarea id="context" rows={3} value={form.context} onChange={onChange('context')} placeholder="For example: I expect these adjustments to be temporary and am happy to review them in 90 days." /><p className="text-xs text-slate-600">Keep it focused on what will help you do your job. You do not need to share a diagnosis.</p></div>
  </div>;
}