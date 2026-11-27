import React from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * Accessible progressive-disclosure panel for secondary homepage sections.
 * Stays closed until requested so survivors can scan the page without fatigue.
 */
export default function HomeDisclosurePanel({ id, title, description, badge, open, onToggle, children }) {
  const triggerId = `home-disclosure-trigger-${id}`;
  const panelId = `home-disclosure-panel-${id}`;

  return (
    <div className="border-t border-brand-border last:border-b">
      <h3 className="m-0">
        <button
          id={triggerId}
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={panelId}
          className="group flex min-h-[72px] w-full items-center justify-between gap-4 px-1 py-5 text-left transition-colors hover:bg-brand-muted sm:px-4"
        >
          <span className="min-w-0 flex-1 space-y-1">
            <span className="flex flex-wrap items-center gap-2.5">
              <span className="font-heading text-lg font-bold text-brand-text sm:text-xl">{title}</span>
              {badge && <span className="nv-chip nv-chip--muted">{badge}</span>}
            </span>
            <span className="block text-sm text-brand-muted-foreground">{description}</span>
          </span>
          <span className="flex shrink-0 items-center gap-2 text-sm font-semibold text-brand-primary">
            <span className="hidden sm:inline">{open ? 'Hide' : 'Open'}</span>
            <ChevronDown
              className={`h-5 w-5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
              aria-hidden="true"
            />
          </span>
        </button>
      </h3>

      {open && (
        <div
          id={panelId}
          role="region"
          aria-labelledby={triggerId}
          className="space-y-6 px-1 pb-8 pt-3 sm:px-4"
        >
          {children}
          <div className="pt-2">
            <button
              type="button"
              onClick={onToggle}
              className="nv-btn nv-btn--text nv-btn--sm"
            >
              Hide {title.toLowerCase()}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}