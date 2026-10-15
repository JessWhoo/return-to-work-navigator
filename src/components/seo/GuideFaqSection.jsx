import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { HelpCircle } from 'lucide-react';

/**
 * Renders a full-text, always-visible FAQ section on guide pages.
 * Every question and answer is rendered directly in the DOM (not hidden
 * behind collapsed accordions) for accessibility, reader scanning, and
 * search / AI citation indexing, matching the page's JSON-LD FAQPage schema 1:1.
 */
export default function GuideFaqSection({
  id = 'faq',
  eyebrow = 'Frequently Asked Questions',
  title,
  subtitle,
  faqs = [],
  headingLevel = 'h2',
}) {
  if (!faqs.length) return null;
  const SectionHeading = headingLevel === 'h3' ? 'h3' : 'h2';
  const QuestionHeading = headingLevel === 'h3' ? 'h4' : 'h3';

  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="space-y-5 scroll-mt-28">
      <div className="space-y-2">
        <p className="nv-eyebrow nv-eyebrow--primary flex items-center gap-1.5">
          <HelpCircle className="h-4 w-4" />
          <span>{eyebrow}</span>
        </p>
        <SectionHeading
          id={`${id}-heading`}
          className="font-heading text-2xl sm:text-3xl font-bold text-brand-text"
        >
          {title}
        </SectionHeading>
        {subtitle && (
          <p className="text-sm sm:text-base text-brand-muted-foreground max-w-3xl">
            {subtitle}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {faqs.map((item, idx) => (
          <Card key={idx}>
            <CardContent className="p-6 space-y-2">
              <QuestionHeading className="font-heading text-base sm:text-lg font-bold text-brand-text">
                {item.question}
              </QuestionHeading>
              <p className="text-sm sm:text-base text-brand-muted-foreground leading-relaxed">
                {item.answer}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}