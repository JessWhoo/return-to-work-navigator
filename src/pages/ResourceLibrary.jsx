import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Library, X } from 'lucide-react';
import { LIBRARY_ITEMS, LIBRARY_CATEGORIES } from '@/components/library/libraryData';
import LibraryCard from '@/components/library/LibraryCard';

export default function ResourceLibrary() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return LIBRARY_ITEMS.filter((item) => {
      const matchesCategory =
        activeCategory === 'all' || item.category === activeCategory;
      if (!matchesCategory) return false;
      if (!q) return true;
      const haystack = [
        item.title,
        item.summary,
        item.type,
        ...(item.tags || []),
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [search, activeCategory]);

  const categoryCounts = useMemo(() => {
    const counts = { all: LIBRARY_ITEMS.length };
    LIBRARY_ITEMS.forEach((item) => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });
    return counts;
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-3"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 border-2 border-indigo-300">
          <Library className="h-4 w-4 text-indigo-700" />
          <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-700">
            Resource Library
          </span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-indigo-700 via-violet-700 to-rose-600 bg-clip-text text-transparent">
          Legal Rights & Accommodation Resources
        </h1>
        <p className="text-lg font-medium text-slate-800 max-w-2xl mx-auto leading-relaxed">
          Every guide, template, and trusted external resource — searchable and
          organized in one place.
        </p>
      </motion.div>

      {/* Search */}
      <Card className="bg-white border-2 border-slate-300 shadow-md">
        <CardContent className="p-5">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by topic, law name, or keyword (e.g. ADA, fatigue, FMLA)..."
              className="pl-12 pr-12 h-12 text-base border-2 border-slate-300 focus-visible:border-indigo-500"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-slate-100"
                aria-label="Clear search"
              >
                <X className="h-4 w-4 text-slate-600" />
              </button>
            )}
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap gap-2 mt-4">
            {LIBRARY_CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              const count = categoryCounts[cat.id] || 0;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-full text-sm font-bold border-2 transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white border-transparent shadow-md'
                      : 'bg-white text-slate-800 border-slate-300 hover:border-indigo-400'
                  }`}
                >
                  {cat.label}
                  <span
                    className={`ml-2 text-xs ${
                      isActive ? 'text-white/90' : 'text-slate-600'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {filtered.length === 0 ? (
        <Card className="bg-white border-2 border-slate-300">
          <CardContent className="p-12 text-center">
            <Search className="h-10 w-10 text-slate-400 mx-auto mb-3" />
            <h3 className="text-lg font-extrabold text-slate-900">
              No resources found
            </h3>
            <p className="text-sm font-medium text-slate-700 mt-1">
              Try a different search term or category.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <p className="text-sm font-semibold text-slate-700">
            {filtered.length} {filtered.length === 1 ? 'resource' : 'resources'}{' '}
            {activeCategory !== 'all' && `in ${LIBRARY_CATEGORIES.find((c) => c.id === activeCategory)?.label}`}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: idx * 0.03 }}
              >
                <LibraryCard item={item} />
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}