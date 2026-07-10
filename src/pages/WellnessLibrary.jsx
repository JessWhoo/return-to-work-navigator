import React, { useEffect, useMemo, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Search, HeartPulse, X } from 'lucide-react';
import WellnessResourceCard from '@/components/wellness/WellnessResourceCard';

const TOPICS = [
  { id: 'all', label: 'All Topics' },
  { id: 'fatigue_management', label: 'Fatigue Management' },
  { id: 'legal_rights', label: 'Legal Rights' },
  { id: 'emotional_wellbeing', label: 'Emotional Well-Being' },
  { id: 'workplace_accommodations', label: 'Workplace Accommodations' },
  { id: 'nutrition_movement', label: 'Nutrition & Movement' },
  { id: 'sleep_rest', label: 'Sleep & Rest' },
];

export default function WellnessLibrary() {
  const [resources, setResources] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [topic, setTopic] = useState('all');

  useEffect(() => {
    const load = async () => {
      const [res, rats] = await Promise.all([
        base44.entities.WellnessResource.list('-created_date', 200),
        base44.entities.WellnessResourceRating.list(null, 500),
      ]);
      setResources(res);
      setRatings(rats);
      try {
        setUser(await base44.auth.me());
      } catch {
        setUser(null);
      }
      setLoading(false);
    };
    load();
  }, []);

  const ratingStats = useMemo(() => {
    const stats = {};
    ratings.forEach((r) => {
      if (!stats[r.resource_id]) stats[r.resource_id] = { sum: 0, count: 0, mine: null };
      stats[r.resource_id].sum += r.rating;
      stats[r.resource_id].count += 1;
      if (user && r.created_by_id === user.id) stats[r.resource_id].mine = r;
    });
    return stats;
  }, [ratings, user]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return resources.filter((r) => {
      if (topic !== 'all' && r.topic !== topic) return false;
      if (!q) return true;
      return [r.title, r.summary, r.source, r.topic].join(' ').toLowerCase().includes(q);
    });
  }, [resources, search, topic]);

  const handleRate = async (resource, value) => {
    if (!user) {
      base44.auth.redirectToLogin(window.location.pathname);
      return;
    }
    const existing = ratingStats[resource.id]?.mine;
    if (existing) {
      await base44.entities.WellnessResourceRating.update(existing.id, { rating: value });
      setRatings((prev) => prev.map((r) => (r.id === existing.id ? { ...r, rating: value } : r)));
    } else {
      const created = await base44.entities.WellnessResourceRating.create({
        resource_id: resource.id,
        rating: value,
      });
      setRatings((prev) => [...prev, { ...created, created_by_id: user.id }]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 border-2 border-emerald-300">
          <HeartPulse className="h-4 w-4 text-emerald-700" />
          <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700">
            Wellness Library
          </span>
        </div>
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-emerald-700 via-teal-600 to-violet-700 bg-clip-text text-transparent">
          Wellness Resource Library
        </h1>
        <p className="text-lg font-medium text-slate-800 max-w-2xl mx-auto">
          Search trusted wellness resources by topic, and rate how helpful each one was for fellow survivors.
        </p>
      </div>

      {/* Search + topic filters */}
      <Card className="bg-white border-2 border-slate-300 shadow-md">
        <CardContent className="p-5">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search resources (e.g. fatigue, FMLA, sleep)..."
              className="pl-12 pr-12 h-12 text-base border-2 border-slate-300 focus-visible:border-emerald-500"
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
          <div className="flex flex-wrap gap-2 mt-4">
            {TOPICS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTopic(t.id)}
                className={`px-3.5 py-1.5 rounded-full text-sm font-bold border-2 transition-all ${
                  topic === t.id
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-transparent shadow-md'
                    : 'bg-white text-slate-800 border-slate-300 hover:border-emerald-400'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-slate-200 border-t-emerald-600 rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <Card className="bg-white border-2 border-slate-300">
          <CardContent className="p-12 text-center">
            <Search className="h-10 w-10 text-slate-400 mx-auto mb-3" />
            <h3 className="text-lg font-extrabold text-slate-900">No resources found</h3>
            <p className="text-sm font-medium text-slate-700 mt-1">
              Try a different search term or topic.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((resource) => {
            const stats = ratingStats[resource.id];
            return (
              <WellnessResourceCard
                key={resource.id}
                resource={resource}
                avgRating={stats ? stats.sum / stats.count : 0}
                ratingCount={stats?.count || 0}
                myRating={stats?.mine?.rating || 0}
                onRate={(value) => handleRate(resource, value)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}