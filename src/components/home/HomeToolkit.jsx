import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { sectionGroups } from '@/components/home/homeToolkitData';

/**
 * Toolkit — a typographic index rather than a wall of cards, so the whole
 * directory stays reachable without dominating the page.
 */
export default function HomeToolkit() {
  return (
    <div className="space-y-4">
      <div className="border-t border-brand-border">
        {sectionGroups.map(group => (
          <div key={group.groupTitle} className="grid gap-4 border-b border-brand-border py-6 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-4">
              <h4 className="font-heading text-lg font-bold text-brand-text">{group.groupTitle}</h4>
              <p className="mt-1 text-sm text-brand-muted-foreground">{group.groupDescription}</p>
            </div>
            <ul className="grid gap-x-8 sm:grid-cols-2 lg:col-span-8">
              {group.items.map(item => (
                <li key={item.page}>
                  <Link
                    to={`/${item.page}`}
                    className="group flex min-h-[56px] items-start justify-between gap-3 rounded-brand py-2 transition-colors hover:bg-brand-muted sm:px-2"
                  >
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-brand-text group-hover:text-brand-primary">{item.title}</span>
                      <span className="block text-sm leading-relaxed text-brand-muted-foreground">{item.description}</span>
                    </span>
                    <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-brand-primary" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}