import React, { useState } from 'react';
import { Mail, Copy, Check, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function ManagerEmailTemplates({ templates, categories }) {
  const templateList = templates || [];
  const categoryList = categories || [];
  const [activeCategory, setActiveCategory] = useState('all');
  const [copiedId, setCopiedId] = useState(null);

  const filtered =
    activeCategory === 'all'
      ? templateList
      : templateList.filter((t) => t.category === activeCategory);

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
        <Mail className="h-6 w-6 text-brand-primary" />
        <h2 id="manager-email-templates-heading" className="font-heading text-xl sm:text-2xl font-bold text-brand-text">
          Email Templates for Checking In
        </h2>
      </div>
      <p className="text-sm text-brand-muted-foreground leading-relaxed">
        Ready-to-adapt emails for staying connected with an employee returning after cancer.
        Copy any template, fill in the bracketed details, and adjust the tone to match your
        relationship. Every template leaves the employee in control of what they share.
      </p>

      {/* Category filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-muted-foreground">
          <Filter className="h-3.5 w-3.5" /> Filter:
        </span>
        <button
          type="button"
          onClick={() => setActiveCategory('all')}
          className={`text-xs font-bold px-3.5 py-1.5 rounded-pill transition-colors ${
            activeCategory === 'all'
              ? 'bg-brand-primary text-white'
              : 'bg-brand-surface text-brand-text border border-brand-border hover:bg-brand-muted'
          }`}
        >
          All
        </button>
        {categoryList.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(cat.id)}
            className={`text-xs font-bold px-3.5 py-1.5 rounded-pill transition-colors ${
              activeCategory === cat.id
                ? 'bg-brand-primary text-white'
                : 'bg-brand-surface text-brand-text border border-brand-border hover:bg-brand-muted'
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
            className="nv-card p-5 flex flex-col"
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <h3 className="font-heading text-base font-bold text-brand-text leading-snug">{template.title}</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleCopy(template)}
                className="flex-shrink-0"
                aria-label={`Copy ${template.title}`}
              >
                {copiedId === template.id ? (
                  <><Check className="h-3.5 w-3.5" /> Copied</>
                ) : (
                  <><Copy className="h-3.5 w-3.5" /> Copy</>
                )}
              </Button>
            </div>
            <p className="text-xs text-brand-muted-foreground italic mb-3">{template.when_to_use}</p>
            <div className="nv-eyebrow mb-1">Subject</div>
            <p className="text-sm font-semibold text-brand-text mb-3">{template.subject}</p>
            <div className="nv-eyebrow mb-1">Message</div>
            <pre className="whitespace-pre-wrap font-body text-xs sm:text-sm text-brand-text bg-brand-background border border-brand-border rounded-brand p-3.5 leading-relaxed flex-1 overflow-hidden">
{template.body}
            </pre>
          </article>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-sm text-brand-muted-foreground text-center py-6">No templates in this category.</p>
      )}
    </section>
  );
}