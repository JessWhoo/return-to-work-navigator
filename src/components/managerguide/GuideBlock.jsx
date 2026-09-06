import React from 'react';
import { Check, X, Quote } from 'lucide-react';

const LIST_STYLES = {
  plain: { Icon: null, wrap: '', item: 'text-slate-800' },
  do: { Icon: Check, wrap: 'bg-emerald-50 border-2 border-emerald-300 rounded-xl p-4', label: 'Do say / Do', item: 'text-emerald-900' },
  dont: { Icon: X, wrap: 'bg-rose-50 border-2 border-rose-300 rounded-xl p-4', label: 'Don’t say / Don’t', item: 'text-rose-900' },
};

export default function GuideBlock({ block }) {
  if (block.type === 'h') {
    return <h3 className="text-lg font-bold text-slate-900 mt-6 mb-2">{block.text}</h3>;
  }
  if (block.type === 'p') {
    return <p className="text-slate-800 leading-relaxed mb-3">{block.text}</p>;
  }
  if (block.type === 'quote') {
    return (
      <blockquote className="flex gap-3 bg-violet-50 border-l-4 border-violet-600 rounded-r-xl p-4 my-4 text-violet-950 font-semibold leading-relaxed">
        <Quote className="h-5 w-5 flex-shrink-0 mt-0.5 text-violet-700" />
        <span>{block.text}</span>
      </blockquote>
    );
  }
  if (block.type === 'list') {
    const style = LIST_STYLES[block.variant] || LIST_STYLES.plain;
    const Icon = style.Icon;
    return (
      <div className={`${style.wrap} mb-4`}>
        {style.label && <p className={`text-sm font-extrabold uppercase tracking-wide mb-2 ${style.item}`}>{style.label}</p>}
        <ul className={`space-y-2 ${Icon ? '' : 'list-disc pl-5'}`}>
          {block.items.map((item) => (
            <li key={item} className={`flex gap-2 leading-relaxed ${style.item}`}>
              {Icon && <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />}
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  return null;
}