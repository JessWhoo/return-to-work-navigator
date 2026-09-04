import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CONDITION_PHRASES } from './accommodationOptions';

function Field({ id, label, hint, children }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-sm font-bold text-slate-800">{label}</Label>
      {children}
      {hint && <p className="text-xs text-slate-600">{hint}</p>}
    </div>
  );
}

function Choice({ id, value, label }) {
  return (
    <label htmlFor={id} className="flex items-center gap-3 rounded-xl border-2 border-slate-200 bg-white p-3 cursor-pointer has-[[data-state=checked]]:border-violet-500 has-[[data-state=checked]]:bg-violet-50 transition-colors">
      <RadioGroupItem value={value} id={id} />
      <span className="text-sm font-medium text-slate-800">{label}</span>
    </label>
  );
}

export default function LetterDetailsForm({ details, onChange }) {
  const set = (key) => (e) => onChange(key, e.target.value);

  return (
    <div className="space-y-7">
      <div className="grid sm:grid-cols-2 gap-4">
        <Field id="name" label="Your full name">
          <Input id="name" value={details.name} onChange={set('name')} placeholder="Jane Doe" />
        </Field>
        <Field id="jobTitle" label="Your job title">
          <Input id="jobTitle" value={details.jobTitle} onChange={set('jobTitle')} placeholder="Senior Analyst" />
        </Field>
        <Field id="company" label="Employer / company">
          <Input id="company" value={details.company} onChange={set('company')} placeholder="Acme Corporation" />
        </Field>
        <Field id="recipientName" label="Recipient name">
          <Input id="recipientName" value={details.recipientName} onChange={set('recipientName')} placeholder="Alex Smith" />
        </Field>
        <Field id="recipientTitle" label="Recipient title" hint="e.g. Human Resources Manager, Direct Supervisor">
          <Input id="recipientTitle" value={details.recipientTitle} onChange={set('recipientTitle')} placeholder="Human Resources Manager" />
        </Field>
        <Field id="startDate" label="Accommodations needed from">
          <Input id="startDate" type="date" value={details.startDate} onChange={set('startDate')} />
        </Field>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-bold text-slate-800">How would you like to describe your situation?</p>
        <p className="text-xs text-slate-600">You are not required to name your diagnosis. Choose the level of disclosure you're comfortable with.</p>
        <RadioGroup value={details.condition} onValueChange={(v) => onChange('condition', v)} className="grid gap-2">
          {Object.entries(CONDITION_PHRASES).map(([key, c]) => (
            <Choice key={key} id={`cond-${key}`} value={key} label={c.label} />
          ))}
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-bold text-slate-800">How long do you expect to need these accommodations?</p>
        <RadioGroup value={details.durationType} onValueChange={(v) => onChange('durationType', v)} className="grid sm:grid-cols-2 gap-2">
          <Choice id="dur-temporary" value="temporary" label="For a set period" />
          <Choice id="dur-ongoing" value="ongoing" label="Ongoing, with regular reviews" />
        </RadioGroup>
        {details.durationType === 'temporary' && (
          <Input value={details.durationDetail} onChange={set('durationDetail')} placeholder="e.g. 3 months, 90 days, through the end of treatment" />
        )}
      </div>

      <div className="space-y-2">
        <p className="text-sm font-bold text-slate-800">Medical documentation</p>
        <RadioGroup value={details.documentation} onValueChange={(v) => onChange('documentation', v)} className="grid gap-2">
          <Choice id="doc-attached" value="attached" label="I'm attaching a note from my healthcare provider" />
          <Choice id="doc-request" value="on_request" label="I can provide documentation if requested" />
          <Choice id="doc-none" value="none" label="Don't mention documentation" />
        </RadioGroup>
      </div>

      <Field id="extraContext" label="Anything else to include? (optional)" hint="Added as its own paragraph after your list of accommodations.">
        <Textarea id="extraContext" rows={3} value={details.extraContext} onChange={set('extraContext')} placeholder="e.g. I'm happy to keep my team informed of any schedule changes in advance." />
      </Field>
    </div>
  );
}