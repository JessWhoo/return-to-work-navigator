import React, { useEffect, useRef, useState } from 'react';
import { List } from 'lucide-react';

export const categorySlug = (name) =>
  'cat-' + String(name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

/**
 * Sticky "jump to category" bar. Sits directly under the app header (measured at
 * runtime so it never overlaps, whatever the header height is) and exposes the
 * offset the section headings need via the --cat-scroll-offset CSS variable.
 */
export default function CategoryJumpNav({ categories }) {
  const navRef = useRef(null);
  const [headerH, setHeaderH] = useState(0);
  const [navH, setNavH] = useState(0);

  useEffect(() => {
    const header = document.querySelector('header');
    const measure = () => {
      setHeaderH(header?.offsetHeight || 0);
      setNavH(navRef.current?.offsetHeight || 0);
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (header) observer.observe(header);
    if (navRef.current) observer.observe(navRef.current);
    window.addEventListener('orientationchange', measure);
    return () => {
      observer.disconnect();
      window.removeEventListener('orientationchange', measure);
    };
  }, [categories.length]);

  useEffect(() => {
    document.documentElement.style.setProperty('--cat-scroll-offset', `${headerH + navH + 14}px`);
    return () => document.documentElement.style.removeProperty('--cat-scroll-offset');
  }, [headerH, navH]);

  if (!categories || categories.length < 2) return null;

  return (
    <nav
      ref={navRef}
      aria-label="Jump to a resource category"
      className="sticky z-30 bg-brand-surface border border-brand-border rounded-brand-lg shadow-brand-sm px-3 py-2.5"
      style={{ top: `${headerH + 6}px` }}
    >
      <div className="flex items-center gap-2 mb-2">
        <List className="h-4 w-4 text-brand-primary" />
        <span className="nv-eyebrow">
          Jump to category
        </span>
        <span className="ml-auto text-xs font-bold text-brand-muted-foreground">{categories.length}</span>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {categories.map((name) => (
          <a
            key={name}
            href={`#${categorySlug(name)}`}
            className="nv-btn nv-btn--outline nv-btn--sm shrink-0"
          >
            {name}
          </a>
        ))}
      </div>
    </nav>
  );
}