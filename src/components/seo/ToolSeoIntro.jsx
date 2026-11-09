import React from 'react';
import { CheckCircle2 } from 'lucide-react';

/**
 * Keyword-led intro rendered above a tool's interface, so the route's static
 * HTML explains in plain language what the tool does before the interactive
 * widget — for readers, search engines, and AI answer engines.
 *
 * @param {{ id: string, eyebrow?: string, heading: string, paragraphs?: string[], points?: string[] }} props
 */
export default function ToolSeoIntro({ id, eyebrow, heading, paragraphs = [], points = [] }) {
  const headingId = `${id}-heading`;

  return (
    <section aria-labelledby={headingId} className="space-y-4">
      {eyebrow && <p className="nv-eyebrow nv-eyebrow--primary">{eyebrow}</p>}
      <h2 id={headingId} className="font-heading text-2xl font-bold text-brand-text sm:text-3xl">
        {heading}
      </h2>
      {paragraphs.map((text) => (
        <p key={text} className="text-base leading-relaxed text-brand-text">
          {text}
        </p>
      ))}
      {points.length > 0 && (
        <ul className="grid grid-cols-1 gap-2 pt-1 sm:grid-cols-3">
          {points.map((point) => (
            <li key={point} className="flex gap-2 text-sm text-brand-text">
              <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-primary" aria-hidden="true" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}