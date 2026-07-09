import React, { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Search, Scale } from 'lucide-react';
import { directoryTopics, directoryEntries } from '@/components/legal/legalDirectoryData';
import DirectoryEntryCard from '@/components/legal/DirectoryEntryCard';

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
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg">
          <Scale className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
          Legal Rights & Accommodations Directory
        </h1>
        <p className="text-lg text-slate-700 max-w-2xl mx-auto font-medium">
          Search plain-language answers about FMLA, the ADA, state laws, accommodations, insurance, and privacy.
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search — e.g. 'intermittent leave', 'fatigue', 'denied claim'..."
          className="pl-12 py-6 text-base bg-white border-2 border-slate-300 rounded-xl"
        />
      </div>

      {/* Topic filter */}
      <div className="flex flex-wrap gap-2 justify-center">
        <button
          onClick={() => setActiveTopic('all')}
          className={`px-4 py-2 rounded-full text-sm font-bold border-2 transition-all ${
            activeTopic === 'all'
              ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white border-transparent shadow-md'
              : 'bg-white text-slate-800 border-slate-300 hover:border-violet-400'
          }`}
        >
          All Topics
        </button>
        {directoryTopics.map((topic) => (
          <button
            key={topic.id}
            onClick={() => setActiveTopic(topic.id)}
            className={`px-4 py-2 rounded-full text-sm font-bold border-2 transition-all ${
              activeTopic === topic.id
                ? `bg-gradient-to-r ${topic.color} text-white border-transparent shadow-md`
                : 'bg-white text-slate-800 border-slate-300 hover:border-violet-400'
            }`}
          >
            {topic.name}
          </button>
        ))}
      </div>

      {/* Results grouped by topic */}
      {grouped.length === 0 ? (
        <div className="text-center py-16 space-y-2">
          <p className="text-lg font-bold text-slate-900">No results for "{search}"</p>
          <p className="text-sm text-slate-700">Try a broader term like "leave", "insurance", or "accommodation".</p>
        </div>
      ) : (
        <div className="space-y-10">
          {grouped.map(({ topic, entries }) => (
            <section key={topic.id}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`h-8 w-1.5 rounded-full bg-gradient-to-b ${topic.color}`} />
                <h2 className="text-2xl font-extrabold text-slate-900">{topic.name}</h2>
                <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-full">
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
      <p className="text-xs text-slate-600 text-center italic pt-4 border-t-2 border-slate-200">
        This information is educational only and not legal advice. Laws change and vary by location — please consult an attorney or your state agency for your specific situation.
      </p>
    </div>
  );
}