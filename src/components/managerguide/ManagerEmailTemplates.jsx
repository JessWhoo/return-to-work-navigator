import React, { useState } from 'react';
import { Mail, Copy, Check, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  MANAGER_EMAIL_TEMPLATES,
  EMAIL_TEMPLATE_CATEGORIES,
} from '@/components/managerguide/managerEmailTemplates';
import { toast } from 'sonner';

export default function ManagerEmailTemplates() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [copiedId, setCopiedId] = useState(null);

  const filtered =
    activeCategory === 'all'
      ? MANAGER_EMAIL_TEMPLATES
      : MANAGER_EMAIL_TEMPLATES.filter((t) => t.category === activeCategory);

  const handleCopy = async (template) => {
    const fullText = `Subject: ${template.subject}\n\n${template.body}`;
    try {
      await navigator.clipboard.writeText(fullText);
      setCopiedId(template.id);
      toast.success('Template copied — paste into your email and fill in the brackets.');
      setTimeout(() => setCopiedId(null), 2500);
    } catch {
      toast.error('Could not copy. Select the text manually instead.');
    }
  };

  return (
    <section id="manager-email-templates" aria-labelledby="manager-email-templates-heading" className="space-y-5">
      <div className="flex items-center gap-2">
        <Mail className="h-6 w-6 text-violet-600" />
        <h2 id="manager-email-templates-heading" className="text-xl font-extrabold text-slate-900">
          Email Templates for Checking In
        </h2>
      </div>
      <p className="text-sm text-slate-700 leading-relaxed">
        Ready-to-adapt emails for staying connected with an employee returning after cancer.
        Copy any template, fill in the bracketed details, and adjust the tone to match your
        relationship. Every template leaves the employee in control of what they share.
      </p>

      {/* Category filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-600">
          <Filter className="h-3.5 w-3.5" /> Filter:
        </span>
        <button
          type="button"
          onClick={() => setActiveCategory('all')}
          className={`text-xs font-bold px-3 py-1.5 rounded-full transition-colors ${
            activeCategory === 'all'
              ? 'bg-violet-600 text-white'
              : 'bg-white text-slate-700 border-2 border-slate-300 hover:border-violet-400'
          }`}
        >
          All
        </button>
        {EMAIL_TEMPLATE_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(cat.id)}
            className={`text-xs font-bold px-3 py-1.5 rounded-full transition-colors ${
              activeCategory === cat.id
                ? 'bg-violet-600 text-white'
                : 'bg-white text-slate-700 border-2 border-slate-300 hover:border-violet-400'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Template cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map((template) => (
          <article
            key={template.id}
            className="flex flex-col bg-white border-2 border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <h3 className="text-base font-bold text-slate-900 leading-snug">{template.title}</h3>
              <Button
                type="button"
                size="sm"
                onClick={() => handleCopy(template)}
                className="flex-shrink-0 bg-violet-600 hover:bg-violet-700 text-white"
                aria-label={`Copy ${template.title}`}
              >
                {copiedId === template.id ? (
                  <><Check className="h-3.5 w-3.5" /> Copied</>
                ) : (
                  <><Copy className="h-3.5 w-3.5" /> Copy</>
                )}
              </Button>
            </div>
            <p className="text-xs text-slate-600 italic mb-3">{template.when_to_use}</p>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Subject</div>
            <p className="text-sm font-semibold text-slate-800 mb-3">{template.subject}</p>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Message</div>
            <pre className="whitespace-pre-wrap font-sans text-sm text-slate-700 leading-relaxed flex-1 overflow-hidden">
{template.body}
            </pre>
          </article>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-sm text-slate-600 text-center py-6">No templates in this category.</p>
      )}
    </section>
  );
}