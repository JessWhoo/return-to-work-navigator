import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { searchSite } from './searchIndex';

export default function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const results = searchSite(query);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const goTo = (path) => {
    setQuery('');
    setOpen(false);
    navigate(path);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && results.length > 0) goTo(results[0].path);
            if (e.key === 'Escape') setOpen(false);
          }}
          placeholder="Search the toolkit… e.g. fatigue, rights"
          aria-label="Search the site"
          className="w-full pl-9 pr-8 py-2 text-sm rounded-full border-2 border-slate-300 bg-white text-slate-900 placeholder:text-slate-500 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setOpen(false); }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-slate-500 hover:bg-slate-100"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {open && query.trim() && (
        <div className="absolute left-0 right-0 mt-2 bg-white border-2 border-slate-300 rounded-xl shadow-xl overflow-hidden z-50 max-h-80 overflow-y-auto">
          {results.length === 0 ? (
            <p className="px-4 py-3 text-sm text-slate-600">No results for “{query.trim()}”</p>
          ) : (
            results.map((r) => (
              <button
                key={r.path}
                onClick={() => goTo(r.path)}
                className="w-full text-left px-4 py-3 hover:bg-violet-50 transition-colors border-b border-slate-100 last:border-b-0"
              >
                <p className="text-sm font-bold text-slate-900">{r.title}</p>
                <p className="text-xs text-slate-600 font-medium">{r.description}</p>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}