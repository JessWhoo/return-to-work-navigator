import React from 'react';

/**
 * Brand page header — eyebrow, Cinzel title and a supporting line, with room
 * for page actions. Used as the single header pattern across inner pages so
 * every screen opens with the same branded lockup.
 */
export default function PageHeader({ eyebrow, title, subtitle, actions, center = false, className = '' }) {
  return (
    <header className={`border-b border-brand-border pb-5 ${className}`}>
      <div className={`flex flex-col gap-4 ${center ? 'items-center text-center' : 'sm:flex-row sm:items-end sm:justify-between'}`}>
        <div className={center ? 'max-w-2xl' : 'min-w-0'}>
          {eyebrow && <p className="nv-eyebrow nv-eyebrow--primary">{eyebrow}</p>}
          <h1 className="mt-1 font-heading text-3xl font-bold text-brand-text sm:text-4xl">{title}</h1>
          {subtitle && <p className="mt-2 text-brand-muted-foreground">{subtitle}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
      </div>
    </header>
  );
}