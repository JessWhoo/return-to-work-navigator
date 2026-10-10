import React, { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { directoryTopics, directoryEntries } from '@/components/legal/legalDirectoryData';
import DirectoryEntryCard from '@/components/legal/DirectoryEntryCard';
import PageHeader from '@/components/brand/PageHeader';

export default function LegalDirectory() {
  const [search, setSearch] = useState('');
  const [activeTopic, setActiveTopic] = useState('all');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return directoryEntries.filter((e) => {
      if (activeTopic !== 'all' && e.topic !== activeTopic) return false;
      if (!q) return true;
      const haystack = [e.title, e.summary, e.details, ...e.tags].join(' ').toLowerCase();
      return q.split(/\s+/).every((word) => haystack.includes(word));
    });
  }, [search, activeTopic]);

  const grouped = useMemo(
    () => directoryTopics
      .map((topic) => ({ topic, entries: filtered.filter((e) => e.topic === topic.id) }))
      .filter((g) => g.entries.length > 0),
    [filtered]
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <PageHeader
        eyebrow="Legal & policy"
        title="Legal Rights & Accommodations Directory"
        subtitle="Search plain-language answers about FMLA, the ADA, state laws, accommodations, insurance, and privacy."
      />

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search — e.g. 'intermittent leave', 'fatigue', 'denied claim'..."
          className="nv-input py-6 pl-12 text-base"
        />
      </div>

      {/* Topic filter */}
      <div className="flex flex-wrap justify-center gap-2">
        <button
          onClick={() => setActiveTopic('all')}
          className={`nv-btn nv-btn--sm ${activeTopic === 'all' ? 'nv-btn--secondary' : 'nv-btn--outline'}`}
        >
          All Topics
        </button>
        {directoryTopics.map((topic) => (
          <button
            key={topic.id}
            onClick={() => setActiveTopic(topic.id)}
            className={`nv-btn nv-btn--sm ${activeTopic === topic.id ? 'nv-btn--secondary' : 'nv-btn--outline'}`}
          >
            {topic.name}
          </button>
        ))}
      </div>

      {/* Results grouped by topic */}
      {grouped.length === 0 ? (
        <div className="space-y-2 py-16 text-center">
          <p className="text-lg font-bold text-brand-text">No results for "{search}"</p>
          <p className="text-sm text-brand-muted-foreground">Try a broader term like "leave", "insurance", or "accommodation".</p>
        </div>
      ) : (
        <div className="space-y-10">
          {grouped.map(({ topic, entries }) => (
            <section key={topic.id}>
              <div className="mb-4 flex items-center gap-3">
                <div className="h-8 w-1.5 rounded-pill bg-brand-primary" />
                <h2 className="font-heading text-2xl font-bold text-brand-text">{topic.name}</h2>
                <span className="nv-chip nv-chip--muted">
                  {entries.length} {entries.length === 1 ? 'answer' : 'answers'}
                </span>
              </div>
              <div className="space-y-3">
                {entries.map((entry) => (
                  <DirectoryEntryCard key={entry.id} entry={entry} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {/* Disclaimer */}
      <p className="border-t border-brand-border pt-4 text-center text-xs italic text-brand-muted-foreground">
        This information is educational only and not legal advice. Laws change and vary by location — please consult an attorney or your state agency for your specific situation.
      </p>
    </div>
  );
}