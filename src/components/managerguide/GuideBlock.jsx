import React from 'react';
import { Check, X, Quote } from 'lucide-react';

const LIST_STYLES = {
  plain: { Icon: null, wrap: '', item: 'text-brand-text', iconClass: '' },
  do: { Icon: Check, wrap: 'nv-card nv-card--sage p-4', label: 'Do say / Do', item: 'text-brand-text', iconClass: 'text-brand-secondary' },
  dont: { Icon: X, wrap: 'nv-card nv-card--muted p-4', label: 'Don’t say / Don’t', item: 'text-brand-text', iconClass: 'text-destructive' },
};

export default function GuideBlock({ block }) {
  if (block.type === 'h') {
    return <h3 className="font-heading text-base sm:text-lg font-bold text-brand-text mt-6 mb-2">{block.text}</h3>;
  }
  if (block.type === 'p') {
    return <p className="text-sm sm:text-base text-brand-text leading-relaxed mb-3">{block.text}</p>;
  }
  if (block.type === 'quote') {
    return (
      <blockquote className="flex gap-3 bg-brand-muted border-l-4 border-brand-primary rounded-r-brand p-4 my-4 text-brand-text font-semibold leading-relaxed text-sm sm:text-base">
        <Quote className="h-5 w-5 flex-shrink-0 mt-0.5 text-brand-primary" />
        <span>{block.text}</span>
      </blockquote>
    );
  }
  if (block.type === 'list') {
    const style = LIST_STYLES[block.variant] || LIST_STYLES.plain;
    const Icon = style.Icon;
    return (
      <div className={`${style.wrap} mb-4`}>
        {style.label && <p className="nv-eyebrow nv-eyebrow--primary mb-2">{style.label}</p>}
        <ul className={`space-y-2 text-sm sm:text-base ${Icon ? '' : 'list-disc pl-5'}`}>
          {block.items.map((item) => (
            <li key={item} className={`${Icon ? 'flex gap-2' : ''} leading-relaxed ${style.item}`}>
              {Icon && <Icon className={`h-5 w-5 flex-shrink-0 mt-0.5 ${style.iconClass}`} />}
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  return null;
}