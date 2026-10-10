import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { searchSite } from './searchIndex';
import { track } from '@/lib/analytics';

export default function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const results = useMemo(() => searchSite(query), [query]);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  // Track what users search for (debounced) so we can see which sections
  // people are trying to reach and surface them higher on the Home page.
  useEffect(() => {
    const q = query.trim();
    if (!q) return;
    const t = setTimeout(() => {
      track('site_search', { query: q, result_count: searchSite(q).length });
    }, 600);
    return () => clearTimeout(t);
  }, [query]);

  const goTo = (path, title) => {
    track('site_search_result_selected', { query: query.trim(), title, path });
    setQuery('');
    setOpen(false);
    navigate(path);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-muted-foreground" />
        <input
          type="search"
          autoComplete="off"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && results.length > 0) goTo(results[0].path, results[0].title);
            if (e.key === 'Escape') setOpen(false);
          }}
          placeholder="Search the toolkit… e.g. fatigue, rights"
          aria-label="Search the site"
          className="nv-input w-full py-2 pl-9 pr-8 text-sm"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setOpen(false); }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-brand-muted-foreground transition-colors hover:bg-brand-muted"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {open && query.trim() && (
        <div className="absolute left-0 right-0 z-50 mt-2 max-h-80 overflow-hidden overflow-y-auto rounded-brand-lg border border-brand-border bg-brand-surface shadow-brand-md">
          {results.length === 0 ? (
            <p className="px-4 py-3 text-sm text-brand-muted-foreground">No results for “{query.trim()}”</p>
          ) : (
            results.map((r) => (
              <button
                key={r.path}
                onClick={() => goTo(r.path, r.title)}
                className="w-full border-b border-brand-border px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-brand-muted"
              >
                <p className="text-sm font-bold text-brand-text">{r.title}</p>
                <p className="text-xs font-medium text-brand-muted-foreground">{r.description}</p>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}