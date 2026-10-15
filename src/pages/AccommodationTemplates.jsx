import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import useSEO from '@/hooks/useSEO';
import PageHeader from '@/components/brand/PageHeader';
import TemplateCard from '@/components/accommodationTemplates/TemplateCard';
import TemplateEditor from '@/components/accommodationTemplates/TemplateEditor';
import { TEMPLATES, TEMPLATE_CATEGORIES } from '@/components/accommodationTemplates/templatesData';

export default function AccommodationTemplates() {
  useSEO({
    title: 'Ready-to-Send ADA Accommodation Request Letter Templates',
    description:
      'Customize pre-written ADA accommodation request letters for flexible schedules, remote work, reduced hours, ergonomic adjustments, and medical appointments.',
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
      <PageHeader
        eyebrow="Accommodation"
        title="Workplace Accommodation Request Letter Templates"
        subtitle={
          <>
            Pick a ready-made letter, fill in your details, customize the wording, then copy it or send it to HR.
            Need something more tailored? Try the{' '}
            <Link to="/AccommodationLetterGenerator" className="font-semibold text-brand-primary underline">letter generator</Link>.
          </>
        }
      />
      <div className="flex flex-wrap gap-2">
        {['All', ...TEMPLATE_CATEGORIES].map((c) => (
          <Button
            key={c}
            size="sm"
            variant={filter === c ? 'default' : 'outline'}
            onClick={() => setFilter(c)}
          >
            {c}
          </Button>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((t) => <TemplateCard key={t.id} template={t} onSelect={setSelected} />)}
      </div>
    </div>
  );
}