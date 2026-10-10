import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Search, X } from 'lucide-react';
import { LIBRARY_ITEMS, LIBRARY_CATEGORIES } from '@/components/library/libraryData';
import useSEO from '@/hooks/useSEO';
import LibraryCard from '@/components/library/LibraryCard';
import PageHeader from '@/components/brand/PageHeader';

export default function ResourceLibrary() {
  useSEO({
    title: 'Resource Library',
    description:
      'Browse trusted articles, guides, tools and organizations supporting cancer survivors through the return-to-work journey.',
    path: '/ResourceLibrary',
  });
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
      <PageHeader
        eyebrow="Resource Library"
        title="Legal Rights & Accommodation Resources"
        subtitle="Every guide, template, and trusted external resource — searchable and organized in one place."
      />

      {/* Search */}
      <Card>
        <CardContent className="p-5">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by topic, law name, or keyword (e.g. ADA, fatigue, FMLA)..."
              className="nv-input h-12 pl-12 pr-12 text-base"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-pill p-1.5 hover:bg-brand-muted"
                aria-label="Clear search"
              >
                <X className="h-4 w-4 text-brand-muted-foreground" />
              </button>
            )}
          </div>

          {/* Category pills */}
          <div className="mt-4 flex flex-wrap gap-2">
            {LIBRARY_CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              const count = categoryCounts[cat.id] || 0;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`nv-btn nv-btn--sm ${isActive ? 'nv-btn--secondary' : 'nv-btn--outline'}`}
                >
                  {cat.label}
                  <span className="text-xs opacity-70">{count}</span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {filtered.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Search className="mx-auto mb-3 h-10 w-10 text-brand-muted-foreground" />
            <h3 className="font-heading text-lg font-bold text-brand-text">
              No resources found
            </h3>
            <p className="mt-1 text-sm text-brand-muted-foreground">
              Try a different search term or category.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <p className="text-sm font-semibold text-brand-muted-foreground">
            {filtered.length} {filtered.length === 1 ? 'resource' : 'resources'}{' '}
            {activeCategory !== 'all' && `in ${LIBRARY_CATEGORIES.find((c) => c.id === activeCategory)?.label}`}
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
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