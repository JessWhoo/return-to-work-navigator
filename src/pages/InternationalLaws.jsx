import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, ChevronDown, ChevronUp, Star, AlertTriangle, CheckCircle2, Info, Globe } from 'lucide-react';
import useSEO from '@/hooks/useSEO';

const countries = [
  {
    country: 'United Kingdom',
    abbr: 'UK',
    flag: '🇬🇧',
    rating: 'strong',
    summary: 'Cancer is a disability from diagnosis, with mandatory adjustments and statutory sick pay.',
    highlights: [
      { label: 'Equality Act 2010', detail: 'Cancer counts as a disability from diagnosis; reasonable adjustments are mandatory.' },
      { label: 'Statutory Sick Pay', detail: '£109.40 a week for up to 28 weeks; many employers pay more.' },
      { label: 'Fit Notes', detail: 'A GP can recommend phased return, reduced hours, or amended duties.' },
      { label: 'Employment Tribunals', detail: 'Discrimination claims within 3 months of the act complained of.' },
    ],
    keyPoints: 'No need to prove impairment, adjustments are required, and sick pay runs up to 28 weeks.',
    resources: [{ name: 'Equality Advisory Service', url: 'https://www.equalityadvisoryservice.com' }, { name: 'Macmillan Work Support', url: 'https://www.macmillan.org.uk/cancer-information-and-support/impacts-of-cancer/work-and-cancer' }]
  },
  {
    country: 'Canada',
    abbr: 'CA',
    flag: '🇨🇦',
    rating: 'strong',
    summary: 'Human rights codes in every province, plus 26 weeks of EI sickness benefits.',
    highlights: [
      { label: 'Human Rights Codes', detail: 'Cancer is a recognized disability requiring accommodation in every province.' },
      { label: 'EI Sickness Benefits', detail: 'Up to 26 weeks at 55% of insurable earnings.' },
      { label: 'Duty to Accommodate', detail: 'Required unless it causes undue hardship — modified duties, hours, schedules.' },
      { label: 'Provincial Variations', detail: 'Ontario, BC and Quebec add protections; Quebec runs its own disability plan.' },
    ],
    keyPoints: 'An accommodation duty in every province and 26 weeks of EI sickness benefits.',
    resources: [{ name: 'Canadian Human Rights Commission', url: 'https://www.chrc-ccdp.gc.ca' }, { name: 'Service Canada EI', url: 'https://www.canada.ca/en/services/benefits/ei/ei-sickness.html' }]
  },
  {
    country: 'Australia',
    abbr: 'AU',
    flag: '🇦🇺',
    rating: 'strong',
    summary: 'Disability Discrimination Act plus 10 days of paid personal leave a year.',
    highlights: [
      { label: 'Disability Discrimination Act', detail: 'Covers hiring, terms and dismissal; reasonable adjustments required.' },
      { label: 'Fair Work Act', detail: "10 days paid personal/carer's leave a year, plus unpaid leave options." },
      { label: 'Unfair Dismissal', detail: 'Dismissal over cancer or related absence can be challenged at the Fair Work Commission.' },
      { label: 'Workers Comp', detail: 'Work-related cancer may bring income replacement and medical costs.' },
    ],
    keyPoints: 'Cancer is a disability, 10 paid personal days a year, and unfair dismissal protection.',
    resources: [{ name: 'Australian Human Rights Commission', url: 'https://humanrights.gov.au' }, { name: 'Fair Work Ombudsman', url: 'https://www.fairwork.gov.au' }]
  },
  {
    country: 'Germany',
    abbr: 'DE',
    flag: '🇩🇪',
    rating: 'strongest',
    summary: 'Up to 78 weeks of income replacement, plus strong dismissal and reintegration rights.',
    highlights: [
      { label: 'Equal Treatment Act', detail: 'Cancer counts when it limits function; accommodations required (AGG).' },
      { label: 'Statutory Sick Pay', detail: 'Full salary for 6 weeks, then 70% for up to 78 weeks.' },
      { label: 'Severe Disability Status', detail: 'GdB 50+ brings extra leave, dismissal protection and part-time rights.' },
      { label: 'Phased Return (BEM)', detail: 'Employers with 10+ staff must offer reintegration planning after 42 days off.' },
    ],
    keyPoints: '78 weeks of income replacement and reintegration planning after 42 days of leave.',
    resources: [{ name: 'Bundesagentur für Arbeit', url: 'https://www.arbeitsagentur.de' }, { name: 'REHADAT', url: 'https://www.rehadat.de' }]
  },
  {
    country: 'France',
    abbr: 'FR',
    flag: '🇫🇷',
    rating: 'strong',
    summary: 'Long-term illness status, up to 3 years of sick pay, and a mandatory return visit.',
    highlights: [
      { label: 'Labour Code & Disability', detail: 'Functional limitations count as disability; adjustments required.' },
      { label: 'Sick Pay', detail: 'Daily allowances up to 3 years for long-term illness, at about 50–66% of wages.' },
      { label: 'ALD Status', detail: 'Cancer is on the ALD list: 100% medical costs covered and extended leave.' },
      { label: 'Reintegration Visit', detail: 'An occupational medicine review is required after 30+ days off.' },
    ],
    keyPoints: 'Full medical cost cover, 3 years of sick pay, and a mandatory return visit.',
    resources: [{ name: 'Ameli (Assurance Maladie)', url: 'https://www.ameli.fr' }, { name: 'Défenseur des droits', url: 'https://www.defenseurdesdroits.fr' }]
  },
  {
    country: 'Netherlands',
    abbr: 'NL',
    flag: '🇳🇱',
    rating: 'strongest',
    summary: 'Employers pay at least 70% of salary for 2 years, and dismissal is barred meanwhile.',
    highlights: [
      { label: 'Sick Pay (2 Years)', detail: 'At least 70% of salary, often 100% in year one, for up to 104 weeks.' },
      { label: 'Reintegration Obligation', detail: 'A joint plan is required; UWV takes over with disability benefit after 2 years.' },
      { label: 'Equal Treatment Act', detail: 'Discrimination is banned and accommodations required during treatment.' },
      { label: 'Dismissal Protection', detail: 'No dismissal during the first 2 years of illness.' },
    ],
    keyPoints: 'Two years of pay and no dismissal while you are off sick.',
    resources: [{ name: 'UWV (Social Security)', url: 'https://www.uwv.nl' }, { name: 'College voor de Rechten van de Mens', url: 'https://www.mensenrechten.nl' }]
  },
  {
    country: 'Sweden',
    abbr: 'SE',
    flag: '🇸🇪',
    rating: 'strongest',
    summary: 'Around 80% income replacement, plus a legal duty to plan your rehabilitation.',
    highlights: [
      { label: 'Sickness Benefit', detail: 'After 14 days of employer pay, about 80% of income for up to 364 days.' },
      { label: 'Rehabilitation Obligation', detail: 'Employers must investigate, plan and fund return-to-work measures.' },
      { label: 'Discrimination Act', detail: 'Covers cancer; active measures and accommodations required.' },
      { label: 'Extended Benefits', detail: 'Serious illness can extend benefits beyond 364 days.' },
    ],
    keyPoints: '80% income replacement and a legal rehabilitation duty on employers.',
    resources: [{ name: 'Försäkringskassan', url: 'https://www.forsakringskassan.se' }, { name: 'Diskrimineringsombudsmannen', url: 'https://www.do.se' }]
  },
  {
    country: 'India',
    abbr: 'IN',
    flag: '🇮🇳',
    rating: 'moderate',
    summary: 'Cancer is a recognized disability; leave and benefits vary widely by sector.',
    highlights: [
      { label: 'RPWD Act 2016', detail: 'Employers with 20+ staff need an equal opportunity policy and no discrimination.' },
      { label: 'ESI Benefits', detail: '70% of wages for up to 91 days a year, extendable to 2 years for cancer.' },
      { label: 'Gratuity & Leave', detail: 'Sick leave follows state and sector rules, so entitlements vary.' },
      { label: 'Public Sector', detail: 'Government roles often include full-pay medical leave and special leave.' },
    ],
    keyPoints: 'Recognized disability, 70% ESI wage replacement, and patchy coverage elsewhere.',
    resources: [{ name: 'ESIC (ESI Corporation)', url: 'https://www.esic.in' }, { name: 'Dept. of Empowerment of Persons with Disabilities', url: 'https://disabilityaffairs.gov.in' }]
  },
  {
    country: 'Brazil',
    abbr: 'BR',
    flag: '🇧🇷',
    rating: 'strong',
    summary: 'Courts generally bar dismissal during treatment; INSS pays 91% of benefit salary.',
    highlights: [
      { label: 'Dismissal Protection', detail: 'Removing an employee during treatment is usually prohibited and reversible.' },
      { label: 'INSS Sickness Benefit', detail: 'Paid after 15 employer-paid days, replacing 91% of benefit salary.' },
      { label: 'Disability Quota', detail: 'Companies with 100+ staff must fill 2–5% of roles with disabled people.' },
      { label: 'CLT Protections', detail: '15 days of employer-paid sick leave, then social security takes over.' },
    ],
    keyPoints: 'Job stability during treatment and 91% income replacement from INSS.',
    resources: [{ name: 'INSS (Previdência Social)', url: 'https://www.gov.br/inss/pt-br' }, { name: 'MPT (Labor Ministry)', url: 'https://www.gov.br/trabalho-e-emprego' }]
  },
  {
    country: 'Japan',
    abbr: 'JP',
    flag: '🇯🇵',
    rating: 'moderate',
    summary: 'Health insurance pays about two-thirds of pay for up to 18 months.',
    highlights: [
      { label: 'Sickness Allowance', detail: 'About 2/3 of standard pay for up to 18 months off work.' },
      { label: 'Discrimination Act', detail: 'Unreasonable discrimination banned since 2016; reasonable consideration required.' },
      { label: 'Work Style Reform', detail: 'Encourages flexible arrangements; some firms run treatment support programs.' },
      { label: 'Employment Promotion', detail: 'Employers with 100+ staff must meet a disability employment quota.' },
    ],
    keyPoints: '18 months at about 67% pay; cancer cover is improving but less explicit than Europe.',
    resources: [{ name: 'Japan Pension Service', url: 'https://www.nenkin.go.jp' }, { name: 'Ministry of Health, Labour and Welfare', url: 'https://www.mhlw.go.jp/www1/english/index.html' }]
  },
  {
    country: 'South Africa',
    abbr: 'ZA',
    flag: '🇿🇦',
    rating: 'moderate',
    summary: 'Cancer counts as a disability, with 30 days sick leave per cycle and UIF support.',
    highlights: [
      { label: 'Employment Equity Act', detail: 'Recognizes cancer as a disability; accommodation and no unfair discrimination.' },
      { label: 'Basic Conditions Act', detail: '30 days of paid sick leave in a 3-year cycle.' },
      { label: 'UIF Illness Benefit', detail: 'Up to 238 days of income replacement at 38–58% of earnings.' },
      { label: 'Labour Relations Act', detail: 'Dismissal for illness needs a fair process and alternatives considered.' },
    ],
    keyPoints: 'Recognized disability, 30 days of sick leave per cycle, and UIF income support.',
    resources: [{ name: 'CCMA', url: 'https://www.ccma.org.za' }, { name: 'UIF', url: 'https://ufiling.labour.gov.za/' }]
  },
  {
    country: 'New Zealand',
    abbr: 'NZ',
    flag: '🇳🇿',
    rating: 'strong',
    summary: 'Cancer is a protected disability, with 10 days sick leave and fair-process protection.',
    highlights: [
      { label: 'Human Rights Act 1993', detail: 'No discrimination in hiring, conditions or dismissal.' },
      { label: 'Sick Leave', detail: 'At least 10 days paid a year, carrying over up to 20 days.' },
      { label: 'Employment Relations Act', detail: 'A health-related dismissal needs a fair process and genuine accommodation.' },
      { label: 'ACC Coverage', detail: 'Work-related cancer or treatment injury can bring 80% of lost earnings.' },
    ],
    keyPoints: '10 paid sick days a year and a fair process before any health dismissal.',
    resources: [{ name: 'Human Rights Commission NZ', url: 'https://www.hrc.co.nz' }, { name: 'Employment NZ', url: 'https://www.employment.govt.nz' }]
  },
];

const ratingConfig = {
  strongest: { label: 'Strongest Protections', color: 'bg-brand-secondary text-brand-text', border: 'border-brand-secondary', icon: Star },
  strong: { label: 'Strong Protections', color: 'bg-primary text-white', border: 'border-primary', icon: CheckCircle2 },
  moderate: { label: 'Moderate Protections', color: 'bg-brand-accent text-foreground', border: 'border-brand-accent', icon: Info },
  basic: { label: 'Basic Protections', color: 'bg-muted text-muted-foreground', border: 'border-border', icon: AlertTriangle },
};

function CountryCard({ data }) {
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
        <div className="p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-brand border border-border bg-muted text-2xl sm:h-12 sm:w-12">
              <span aria-hidden="true">{data.flag}</span>
            </div>
            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <h3 className="min-w-0 font-heading text-lg font-bold text-foreground">
                  {data.country}
                  <span className="sr-only"> ({data.abbr})</span>
                </h3>
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
        </div>
      </button>

      {expanded && (
        <div className="space-y-4 border-t border-border px-4 pb-5 pt-4 sm:px-5">
          <div className={`rounded-brand border bg-muted p-3 ${cfg.border}`}>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Bottom line</p>
            <p className="text-sm text-foreground">{data.keyPoints}</p>
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
                <a key={r.name} href={r.url} target="_blank" rel="noopener noreferrer"
                  className="text-sm font-semibold text-primary underline underline-offset-2 hover:text-foreground">
                  → {r.name}
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

export default function InternationalLaws({ embedded = false }) {
  useSEO({
    title: 'International Cancer Employment Rights & Sick Pay Guide',
    description:
      'Compare employment protections, statutory sick pay, and reasonable workplace adjustment laws for cancer survivors across the UK, Canada, EU, Australia, and beyond.',
    path: '/InternationalLaws',
    enabled: !embedded,
  });
  const [search, setSearch] = useState('');
  const [ratingFilter, setRatingFilter] = useState('All');

  const filters = ['All', 'Strongest', 'Strong', 'Moderate'];

  const filtered = countries.filter(c => {
    const matchesSearch = search === '' ||
      c.country.toLowerCase().includes(search.toLowerCase()) ||
      c.summary.toLowerCase().includes(search.toLowerCase()) ||
      c.highlights.some(h => h.label.toLowerCase().includes(search.toLowerCase()) || h.detail.toLowerCase().includes(search.toLowerCase()));
    const matchesRating = ratingFilter === 'All' || c.rating === ratingFilter.toLowerCase();
    return matchesSearch && matchesRating;
  });

  const counts = {
    strongest: countries.filter(c => c.rating === 'strongest').length,
    strong: countries.filter(c => c.rating === 'strong').length,
    moderate: countries.filter(c => c.rating === 'moderate').length,
    basic: countries.filter(c => c.rating === 'basic').length,
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 sm:space-y-8">
      <div className="space-y-2 text-center">
        {embedded ? (
          <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
            International Employment Laws for Cancer Survivors
          </h2>
        ) : (
          <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
            International Employment Laws for Cancer Survivors
          </h1>
        )}
        <p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg">
          Employment rights, sick pay and workplace adjustments across {countries.length} countries.
        </p>
      </div>

      {/* Shared principles */}
      <Card className="nv-card--muted">
        <CardContent className="px-4 pb-5 pt-5 sm:px-6">
          <div className="flex items-start gap-3">
            <Globe className="mt-0.5 h-6 w-6 flex-shrink-0 text-primary" aria-hidden="true" />
            <div className="min-w-0 space-y-2">
              <h3 className="font-heading text-lg font-bold text-foreground">What's common worldwide</h3>
              <ul className="space-y-1.5 text-sm text-foreground">
                <li><strong>Anti-discrimination:</strong> most countries ban cancer discrimination through disability or health law.</li>
                <li><strong>Reasonable adjustments:</strong> employers are increasingly required to adapt work after treatment.</li>
                <li><strong>Income replacement:</strong> most developed nations pay 50–100% of wages during illness.</li>
                <li><strong>Dismissal protection:</strong> many countries restrict dismissal during treatment.</li>
              </ul>
              <p className="text-xs text-muted-foreground">Rules differ by country and change often — check with local counsel or government resources.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rating summary */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {['strongest', 'strong', 'moderate', 'basic'].map(key => {
          const cfg = ratingConfig[key];
          const Icon = cfg.icon;
          return (
            <div key={key} className="rounded-brand border border-border bg-surface p-3 text-center">
              <span className={`flex w-full items-center justify-center gap-1 rounded-pill px-2 py-1 text-center text-xs font-medium leading-tight ${cfg.color}`}>
                <Icon className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
                {cfg.label}
              </span>
              <p className="mt-2 text-lg font-bold text-foreground">{counts[key] || 0}</p>
              <p className="text-xs text-muted-foreground">countries</p>
            </div>
          );
        })}
      </div>

      {/* Search & filter */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            placeholder="Search by country, law name, or topic..."
            aria-label="Search international laws"
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

      {filtered.length === 0 ? (
        <Card>
          <div className="py-8 text-center">
            <Search className="mx-auto mb-3 h-10 w-10 text-muted-foreground" aria-hidden="true" />
            <p className="text-muted-foreground">No countries found for "{search}". Try a broader search.</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map(c => <CountryCard key={c.country} data={c} />)}
        </div>
      )}

      <Card className="nv-card--muted">
        <CardContent className="px-4 pb-5 pt-5 sm:px-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-destructive" aria-hidden="true" />
            <div className="min-w-0">
              <p className="mb-1 text-sm font-semibold text-foreground">Important disclaimer</p>
              <p className="text-sm text-foreground">
                General summaries for education only. Laws change and vary by employer and country. <strong>Please consult a qualified local employment attorney or HR professional</strong> about your own situation.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}