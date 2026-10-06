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
      className="sticky z-30 bg-white/95 backdrop-blur border-2 border-slate-300 rounded-2xl shadow-sm px-3 py-2.5"
      style={{ top: `${headerH + 6}px` }}
    >
      <div className="flex items-center gap-2 mb-2">
        <List className="h-4 w-4 text-violet-700" />
        <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
          Jump to category
        </span>
        <span className="ml-auto text-xs font-bold text-slate-600">{categories.length}</span>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {categories.map((name) => (
          <a
            key={name}
            href={`#${categorySlug(name)}`}
            className="shrink-0 whitespace-nowrap rounded-full border-2 border-slate-300 bg-white px-3 py-1 text-xs font-bold text-slate-800 hover:border-violet-500 hover:text-violet-700 transition-colors"
          >
            {name}
          </a>
        ))}
      </div>
    </nav>
  );
}