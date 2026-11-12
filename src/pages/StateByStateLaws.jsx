import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Shield, ChevronDown, ChevronUp, Star, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import useSEO from '@/hooks/useSEO';

const stateLaws = [
  {
    state: 'California',
    abbr: 'CA',
    rating: 'strongest',
    summary: 'Broadest protections: 5-employee threshold, extra leave, and paid disability.',
    highlights: [
      { label: 'FEHA', detail: 'Covers employers with 5+ employees (the federal ADA starts at 15+).' },
      { label: 'CFRA', detail: '12 weeks of job-protected leave, separate from FMLA — up to 24 weeks total.' },
      { label: 'PDL', detail: 'Up to 4 months off for pregnancy-related conditions; stacks with CFRA.' },
      { label: 'SDI', detail: 'State Disability Insurance replaces 60–70% of wages during medical leave.' },
      { label: 'Cancer as Disability', detail: 'Explicitly covered; employers must run a good-faith interactive process.' },
    ],
    keyDifferences: 'Lower employer threshold, separate CFRA leave, and state-paid disability.',
    resources: [{ name: 'DFEH', url: 'https://www.dfeh.ca.gov' }]
  },
  {
    state: 'New York',
    abbr: 'NY',
    rating: 'strong',
    summary: '4-employee threshold, statewide disability and paid family leave, strongest in NYC.',
    highlights: [
      { label: 'NYSHRL', detail: 'Covers employers with 4+ employees; cancer is a disability needing accommodation.' },
      { label: 'NYCHRL', detail: 'NYC workers: applies to every employer, with a broader disability standard.' },
      { label: 'NY PFL', detail: '12 weeks at 67% of average weekly wage for caregiving or bonding — not your own illness.' },
      { label: 'DBL', detail: 'Disability Benefits Law pays short-term benefits up to 26 weeks for off-the-job illness.' },
    ],
    keyDifferences: '4-employee threshold, state disability benefits, and the widest cover in NYC.',
    resources: [{ name: 'NYSDHR', url: 'https://dhr.ny.gov' }]
  },
  {
    state: 'Texas',
    abbr: 'TX',
    rating: 'basic',
    summary: 'Federal law only: no state leave or disability program.',
    highlights: [
      { label: 'TCHRA', detail: 'Mirrors the ADA and starts at 15+ employees.' },
      { label: 'No State Leave', detail: 'No state paid leave; federal FMLA gives 12 unpaid weeks.' },
      { label: 'TWC', detail: 'The Workforce Commission handles discrimination complaints as an EEOC alternative.' },
    ],
    keyDifferences: 'No state leave or disability pay; employers under 15 have no state cover.',
    resources: [{ name: 'TWC Civil Rights', url: 'https://www.twc.texas.gov/civilrights' }]
  },
  {
    state: 'Florida',
    abbr: 'FL',
    rating: 'basic',
    summary: 'Federal law only: no state FMLA equivalent, paid leave, or disability insurance.',
    highlights: [
      { label: 'FCRA', detail: 'Covers employers with 15+ employees and mirrors the ADA.' },
      { label: 'No State FMLA', detail: 'No state family or medical leave law, so federal FMLA is the only option.' },
      { label: 'No SDI', detail: 'No state disability insurance, so longer leave is usually unpaid.' },
    ],
    keyDifferences: 'No state FMLA, paid leave, or disability insurance.',
    resources: [{ name: 'FCHR', url: 'https://fchr.state.fl.us' }]
  },
  {
    state: 'Washington',
    abbr: 'WA',
    rating: 'strong',
    summary: '8-employee threshold and a state paid leave program for your own illness.',
    highlights: [
      { label: 'WLAD', detail: 'Covers employers with 8+ employees; cancer counts as a disability.' },
      { label: 'PFML', detail: 'Up to 12 weeks paid (18 for pregnancy), replacing up to 90% of low wages.' },
      { label: 'WFLA', detail: 'Mirrors FMLA but applies from 8 employees instead of 50.' },
    ],
    keyDifferences: 'Paid medical leave, and coverage from 8 employees rather than 50.',
    resources: [{ name: 'WA PFML', url: 'https://paidleave.wa.gov' }]
  },
  {
    state: 'Massachusetts',
    abbr: 'MA',
    rating: 'strong',
    summary: 'One of the most generous paid leave programs, with a 6-employee threshold.',
    highlights: [
      { label: 'PFML', detail: 'Up to 20 weeks paid medical leave plus 12 weeks family leave, at 80% of wages.' },
      { label: 'Chapter 151B', detail: 'Covers employers with 6+ employees; cancer is explicitly protected.' },
      { label: 'MFLA', detail: '24 weeks of leave over 24 months — double the federal FMLA allowance.' },
    ],
    keyDifferences: '20 weeks of paid medical leave, 24 weeks of job protection, 6-employee threshold.',
    resources: [{ name: 'MA PFML', url: 'https://www.mass.gov/pfml' }]
  },
  {
    state: 'New Jersey',
    abbr: 'NJ',
    rating: 'strong',
    summary: 'Paid temporary disability for up to 26 weeks, and discrimination law covering every employer.',
    highlights: [
      { label: 'TDI', detail: 'Up to 26 weeks of wage replacement (up to 85%) for your own illness.' },
      { label: 'NJFLA', detail: 'Covers employers with 30+ employees; 12 weeks, separate from FMLA.' },
      { label: 'LAD', detail: 'Applies to employers with 1+ employees — near-universal coverage.' },
    ],
    keyDifferences: 'Paid disability leave, and every employer covered for discrimination.',
    resources: [{ name: 'NJ DOL', url: 'https://www.nj.gov/labor' }]
  },
  {
    state: 'Illinois',
    abbr: 'IL',
    rating: 'moderate',
    summary: 'Moderate: 15-employee threshold and 40 hours of paid leave, but no disability pay.',
    highlights: [
      { label: 'IHRA', detail: 'Covers employers with 15+ employees and bans cancer discrimination.' },
      { label: 'Paid Leave 2024', detail: '40 hours of paid leave a year, usable for treatment and recovery.' },
      { label: 'No SDI', detail: 'No state disability insurance for longer absences.' },
    ],
    keyDifferences: 'Paid leave is only 40 hours a year; no state disability insurance.',
    resources: [{ name: 'IDHR', url: 'https://dhr.illinois.gov/' }]
  },
  {
    state: 'Colorado',
    abbr: 'CO',
    rating: 'strong',
    summary: 'New paid family and medical leave, plus discrimination law covering every employer.',
    highlights: [
      { label: 'FAMLI', detail: 'Up to 12 weeks paid leave since 2024, replacing up to 90% of low wages.' },
      { label: 'CADA', detail: 'Covers employers with 1+ employees; cancer counts as a disability.' },
      { label: 'Accrued Leave', detail: 'Employers must provide paid sick leave usable for treatment and recovery.' },
    ],
    keyDifferences: 'Paid leave since 2024, and discrimination rules for every employer.',
    resources: [{ name: 'CO FAMLI', url: 'https://famli.colorado.gov' }]
  },
  {
    state: 'Oregon',
    abbr: 'OR',
    rating: 'strong',
    summary: 'Paid Leave Oregon, plus anti-discrimination law covering every employer.',
    highlights: [
      { label: 'Paid Leave Oregon', detail: 'Up to 12 weeks paid (14 for pregnancy), replacing 60–100% of wages.' },
      { label: 'ORS 659A', detail: 'Covers employers with 1+ employees; cancer is a protected disability.' },
      { label: 'OFLA', detail: 'Covers employers with 10+ employees and stacks on top of FMLA.' },
    ],
    keyDifferences: 'Paid leave since 2023, and every employer covered for discrimination.',
    resources: [{ name: 'OR Paid Leave', url: 'https://paidleave.oregon.gov' }]
  },
  {
    state: 'Pennsylvania',
    abbr: 'PA',
    rating: 'basic',
    summary: 'Federal law statewide, though Philadelphia and Pittsburgh require paid sick leave.',
    highlights: [
      { label: 'PHRA', detail: 'Covers employers with 4+ employees and bans disability discrimination.' },
      { label: 'No State Paid Leave', detail: 'No state paid family or medical leave; federal FMLA only.' },
      { label: 'Local Ordinances', detail: 'Philadelphia and Pittsburgh require paid sick leave at larger employers.' },
    ],
    keyDifferences: 'A 4-employee threshold, but no state paid leave outside two cities.',
    resources: [{ name: 'PHRC', url: 'https://www.phrc.pa.gov' }]
  },
  {
    state: 'Michigan',
    abbr: 'MI',
    rating: 'moderate',
    summary: 'Moderate: 72 hours of paid sick time from 2025, but no family leave insurance.',
    highlights: [
      { label: 'ELCRA', detail: 'Bans disability discrimination, though cancer must limit a major life activity.' },
      { label: 'ESTA 2025', detail: 'Up to 72 hours of paid sick time a year at employers with 10+ staff.' },
      { label: 'No PFML', detail: 'No state paid family or medical leave for longer absences.' },
    ],
    keyDifferences: 'Paid sick time from 2025; no state family or medical leave insurance.',
    resources: [{ name: 'MDCR', url: 'https://www.michigan.gov/mdcr' }]
  },
];

const ratingConfig = {
  strongest: { label: 'Strongest Protections', color: 'bg-brand-secondary text-brand-text', border: 'border-brand-secondary', icon: Star },
  strong: { label: 'Strong Protections', color: 'bg-primary text-white', border: 'border-primary', icon: CheckCircle2 },
  moderate: { label: 'Moderate Protections', color: 'bg-brand-accent text-foreground', border: 'border-brand-accent', icon: Info },
  basic: { label: 'Basic (Federal Only)', color: 'bg-muted text-muted-foreground', border: 'border-border', icon: AlertTriangle },
};

function StateCard({ data }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = ratingConfig[data.rating];
  const RatingIcon = cfg.icon;

  return (
    <Card>
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        className="w-full text-left"
      >
        <CardContent className="px-4 pb-4 pt-4 sm:px-6 sm:pt-5">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-brand border border-border bg-muted sm:h-12 sm:w-12">
              <span className="text-sm font-bold text-foreground">{data.abbr}</span>
            </div>
            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <h3 className="min-w-0 font-heading text-lg font-bold text-foreground">{data.state}</h3>
                {expanded
                  ? <ChevronUp className="mt-1 h-4 w-4 flex-shrink-0 text-muted-foreground" aria-hidden="true" />
                  : <ChevronDown className="mt-1 h-4 w-4 flex-shrink-0 text-muted-foreground" aria-hidden="true" />}
              </div>
              <p className="text-sm leading-snug text-muted-foreground">{data.summary}</p>
              <span className={`inline-flex items-center gap-1 rounded-pill px-2 py-1 text-xs font-medium ${cfg.color}`}>
                <RatingIcon className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
                {cfg.label}
              </span>
            </div>
          </div>
        </CardContent>
      </button>

      {expanded && (
        <CardContent className="space-y-4 border-t border-border px-4 pb-5 pt-4 sm:px-6">
          <div className={`rounded-brand border bg-muted p-3 ${cfg.border}`}>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Versus federal law</p>
            <p className="text-sm text-foreground">{data.keyDifferences}</p>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Laws &amp; protections</p>
            {data.highlights.map((h, i) => (
              <div key={i} className="rounded-brand border border-border bg-muted p-3">
                <span className="inline-block rounded bg-primary px-2 py-0.5 text-xs font-bold text-white">{h.label}</span>
                <p className="mt-1.5 text-sm leading-relaxed text-foreground">{h.detail}</p>
              </div>
            ))}
          </div>

          {data.resources?.length > 0 && (
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {data.resources.map(r => (
                <a
                  key={r.name}
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-primary underline underline-offset-2 hover:text-foreground"
                >
                  → {r.name}
                </a>
              ))}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}

export default function StateByStateLaws({ embedded = false }) {
  useSEO({
    title: 'State-by-State Cancer Employment & Paid Leave Laws',
    description:
      'Compare workplace disability protections, paid family and medical leave programs, and small-employer anti-discrimination laws across all 50 U.S. states.',
    path: '/StateByStateLaws',
    enabled: !embedded,
  });
  const [search, setSearch] = useState('');
  const [ratingFilter, setRatingFilter] = useState('All');

  const filters = ['All', 'Strongest', 'Strong', 'Moderate', 'Basic'];

  const filtered = stateLaws.filter(s => {
    const matchesSearch = search === '' ||
      s.state.toLowerCase().includes(search.toLowerCase()) ||
      s.abbr.toLowerCase().includes(search.toLowerCase()) ||
      s.summary.toLowerCase().includes(search.toLowerCase()) ||
      s.highlights.some(h => h.label.toLowerCase().includes(search.toLowerCase()) || h.detail.toLowerCase().includes(search.toLowerCase()));
    const matchesRating = ratingFilter === 'All' || s.rating === ratingFilter.toLowerCase();
    return matchesSearch && matchesRating;
  });

  const counts = {
    strongest: stateLaws.filter(s => s.rating === 'strongest').length,
    strong: stateLaws.filter(s => s.rating === 'strong').length,
    moderate: stateLaws.filter(s => s.rating === 'moderate').length,
    basic: stateLaws.filter(s => s.rating === 'basic').length,
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 sm:space-y-8">
      <div className="space-y-2 text-center">
        {embedded ? (
          <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
            State-by-State Employment &amp; Leave Laws for Cancer Survivors
          </h2>
        ) : (
          <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
            State-by-State Employment &amp; Leave Laws for Cancer Survivors
          </h1>
        )}
        <p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg">
          How your state adds to federal ADA and FMLA protections — and where it does not.
        </p>
      </div>

      {/* Federal baseline */}
      <Card className="nv-card--muted">
        <CardContent className="px-4 pb-5 pt-5 sm:px-6">
          <div className="flex items-start gap-3">
            <Shield className="mt-0.5 h-6 w-6 flex-shrink-0 text-primary" aria-hidden="true" />
            <div className="min-w-0 space-y-2">
              <h3 className="font-semibold text-foreground">Federal baseline (applies in every state)</h3>
              <ul className="space-y-1.5 text-sm text-foreground">
                <li><strong>ADA:</strong> disability discrimination ban at employers with 15+ staff, with accommodations.</li>
                <li><strong>FMLA:</strong> 12 weeks unpaid, job-protected leave at employers with 50+ staff.</li>
                <li><strong>HIPAA:</strong> keeps your medical information private from employers.</li>
                <li><strong>COBRA:</strong> continue health cover for up to 18 months after leaving a job.</li>
              </ul>
              <p className="text-xs text-muted-foreground">State law can only add to these rights, never reduce them. The more generous rule applies.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rating legend */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Object.entries(ratingConfig).map(([key, cfg]) => {
          const Icon = cfg.icon;
          return (
            <div key={key} className="rounded-brand border border-border bg-surface p-3 text-center">
              <span className={`flex w-full items-center justify-center gap-1 rounded-pill px-2 py-1 text-center text-xs font-medium leading-tight ${cfg.color}`}>
                <Icon className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
                {cfg.label}
              </span>
              <p className="mt-2 text-lg font-bold text-foreground">{counts[key]}</p>
              <p className="text-xs text-muted-foreground">states</p>
            </div>
          );
        })}
      </div>

      {/* Search & filter */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            placeholder="Search by state, law name, or topic..."
            aria-label="Search state laws"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {filters.map(f => (
            <button
              key={f}
              type="button"
              onClick={() => setRatingFilter(f)}
              aria-pressed={ratingFilter === f}
              className={`rounded-pill px-3 py-1.5 text-sm font-medium transition-all ${
                ratingFilter === f
                  ? 'bg-primary text-white'
                  : 'border border-border bg-surface text-muted-foreground hover:border-primary hover:text-foreground'
              }`}
            >
              {f} {f !== 'All' && <span className="ml-1 opacity-70">({counts[f.toLowerCase()] ?? 0})</span>}
            </button>
          ))}
        </div>
      </div>

      {/* States */}
      {filtered.length === 0 ? (
        <Card>
          <CardContent className="pb-8 pt-8 text-center">
            <Search className="mx-auto mb-3 h-10 w-10 text-muted-foreground" aria-hidden="true" />
            <p className="text-muted-foreground">No states found for "{search}". Try a broader search.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map(s => <StateCard key={s.state} data={s} />)}
        </div>
      )}

      {/* Disclaimer */}
      <Card className="nv-card--muted">
        <CardContent className="px-4 pb-5 pt-5 sm:px-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-destructive" aria-hidden="true" />
            <div className="min-w-0">
              <p className="mb-1 text-sm font-semibold text-foreground">Important disclaimer</p>
              <p className="text-sm text-foreground">
                These are general summaries for education only. Laws change and depend on employer size, location and your circumstances. <strong>Please consult a qualified employment attorney</strong> before acting.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}