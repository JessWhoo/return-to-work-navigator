import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import useSEO from '@/hooks/useSEO';
import TemplateCard from '@/components/accommodationTemplates/TemplateCard';
import TemplateEditor from '@/components/accommodationTemplates/TemplateEditor';
import { TEMPLATES, TEMPLATE_CATEGORIES } from '@/components/accommodationTemplates/templatesData';

export default function AccommodationTemplates() {
  useSEO({
    title: 'Accommodation Request Templates',
    description: 'Pre-written accommodation request templates you can fill out, customize, and send to your HR department.',
    path: '/AccommodationTemplates',
  });
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('All');

  const shown = filter === 'All' ? TEMPLATES : TEMPLATES.filter((t) => t.category === filter);

  if (selected) {
    return (
      <div className="max-w-4xl mx-auto">
        <TemplateEditor template={selected} onBack={() => setSelected(null)} />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Accommodation Request Templates</h1>
        <p className="mt-2 text-slate-700 font-medium max-w-2xl">
          Pick a ready-made letter, fill in your details, customize the wording, then copy it or send it to HR.
          Need something more tailored? Try the{' '}
          <Link to="/AccommodationLetterGenerator" className="text-violet-700 font-bold underline">letter generator</Link>.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {['All', ...TEMPLATE_CATEGORIES].map((c) => (
          <Button
            key={c}
            size="sm"
            variant={filter === c ? 'default' : 'outline'}
            onClick={() => setFilter(c)}
            className="font-bold"
          >
            {c}
          </Button>
        ))}
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {shown.map((t) => <TemplateCard key={t.id} template={t} onSelect={setSelected} />)}
      </div>
    </div>
  );
}