import React, { useState, useEffect } from 'react';
import { ArrowLeft, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import LetterPreview from '@/components/accommodationLetter/LetterPreview';
import { FIELDS, fillTemplate } from './templatesData';

export default function TemplateEditor({ template, onBack }) {
  const [values, setValues] = useState({});
  const [text, setText] = useState(fillTemplate(template.body, {}));

  useEffect(() => {
    setText(fillTemplate(template.body, values));
  }, [template]); // eslint-disable-line react-hooks/exhaustive-deps

  const update = (key, v) => {
    const next = { ...values, [key]: v };
    setValues(next);
    setText(fillTemplate(template.body, next));
  };

  const openInEmail = () => {
    const [first, ...rest] = text.split('\n');
    const subject = first.replace(/^Subject:\s*/, '');
    const body = rest.join('\n').trim();
    window.location.href = 'mailto:?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  };

  return (
    <div className="space-y-6">
      <style>{`@media print { .no-print { display: none !important; } .print-letter { border: none !important; box-shadow: none !important; } }`}</style>
      <Button variant="ghost" onClick={onBack} className="no-print font-bold text-slate-800 -ml-3">
        <ArrowLeft className="h-4 w-4 mr-1.5" /> All templates
      </Button>
      <h2 className="no-print text-2xl font-extrabold text-slate-900">{template.title}</h2>

      <Card className="no-print border-2 border-slate-200">
        <CardContent className="p-5 grid sm:grid-cols-2 gap-4">
          {FIELDS.map((f) => (
            <div key={f.key} className="space-y-1.5">
              <Label htmlFor={'tpl-' + f.key} className="font-bold text-slate-900">{f.label}</Label>
              <Input id={'tpl-' + f.key} value={values[f.key] || ''} onChange={(e) => update(f.key, e.target.value)} />
            </div>
          ))}
        </CardContent>
      </Card>

      <p className="no-print text-sm text-slate-700 font-medium">
        Anything left in [brackets] still needs your details. Use Edit text to customize the wording.
      </p>
      <LetterPreview text={text} onChange={setText} onRegenerate={() => setText(fillTemplate(template.body, values))} />
      <Button onClick={openInEmail} className="no-print bg-violet-700 hover:bg-violet-800 text-white font-bold">
        <Mail className="h-4 w-4 mr-1.5" /> Open in my email app
      </Button>
      <p className="no-print text-xs text-slate-700">Templates are general guidance, not legal advice.</p>
    </div>
  );
}