import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Shield, ChevronDown, ChevronUp, Star, AlertTriangle, CheckCircle2, Info, Globe } from 'lucide-react';

const countries = [
  {
    country: 'United Kingdom',
    abbr: 'UK',
    flag: '🇬🇧',
    rating: 'strong',
    summary: 'Strong protections under the Equality Act 2010, with statutory sick pay and employer duty to make reasonable adjustments.',
    highlights: [
      { label: 'Equality Act 2010', detail: 'Cancer is automatically classified as a disability from the point of diagnosis — no need to prove functional impairment. Employers must make reasonable adjustments.' },
      { label: 'Statutory Sick Pay', detail: 'SSP pays £109.40/week for up to 28 weeks. Many employers offer enhanced contractual sick pay beyond this minimum.' },
      { label: 'Fit Notes', detail: 'A GP can issue a "fit note" recommending phased return, altered hours, amended duties, or workplace adaptations.' },
      { label: 'Employment Tribunals', detail: 'Workers can bring disability discrimination claims to an Employment Tribunal within 3 months of the act complained of.' },
    ],
    keyPoints: 'Cancer is automatically a disability under UK law. Reasonable adjustments are mandatory. Statutory Sick Pay available up to 28 weeks.',
    resources: [{ name: 'Equality Advisory Service', url: 'https://www.equalityadvisoryservice.com' }, { name: 'Macmillan Work Support', url: 'https://www.macmillan.org.uk/cancer-information-and-support/work-and-cancer' }]
  },
  {
    country: 'Canada',
    abbr: 'CA',
    flag: '🇨🇦',
    rating: 'strong',
    summary: 'Federal and provincial human rights codes prohibit cancer discrimination, with Employment Insurance providing sickness benefits.',
    highlights: [
      { label: 'Human Rights Codes', detail: 'Each province has its own human rights code prohibiting disability discrimination. Cancer is universally recognized as a disability requiring accommodation to the point of "undue hardship."' },
      { label: 'EI Sickness Benefits', detail: 'Employment Insurance provides up to 26 weeks of sickness benefits, replacing 55% of average insurable earnings (up to a weekly maximum).' },
      { label: 'Duty to Accommodate', detail: 'Employers have a legal duty to accommodate disability — including cancer — unless it causes undue hardship. This includes modified duties, reduced hours, and flexible scheduling.' },
      { label: 'Provincial Variations', detail: 'Ontario, BC, and Quebec have additional provincial protections. Quebec also provides its own short-term disability plan (CNESST).' },
    ],
    keyPoints: 'Duty to accommodate cancer as a disability in all provinces. EI sickness benefits up to 26 weeks. Provincial codes add additional protections.',
    resources: [{ name: 'Canadian Human Rights Commission', url: 'https://www.chrc-ccdp.gc.ca' }, { name: 'Service Canada EI', url: 'https://www.canada.ca/en/services/benefits/ei/ei-sickness.html' }]
  },
  {
    country: 'Australia',
    abbr: 'AU',
    flag: '🇦🇺',
    rating: 'strong',
    summary: 'The Disability Discrimination Act and Fair Work Act provide strong protections, with personal/carer\'s leave for medical treatment.',
    highlights: [
      { label: 'Disability Discrimination Act 1992', detail: 'Cancer is a disability under federal law. Employers cannot discriminate in hiring, terms of employment, or dismissal. Reasonable adjustments are required.' },
      { label: 'Fair Work Act', detail: 'Full-time employees accrue 10 days of paid personal/carer\'s leave per year, usable for illness including cancer treatment. Unpaid leave is also available.' },
      { label: 'Unfair Dismissal', detail: 'Dismissing an employee due to cancer or illness-related absence (within protected periods) constitutes unfair dismissal. The Fair Work Commission oversees claims.' },
      { label: 'Workers Comp', detail: 'If cancer is work-related (e.g., occupational exposure), workers\' compensation may provide income replacement and medical expenses.' },
    ],
    keyPoints: 'Cancer is a disability under federal law. 10 days paid personal leave per year. Unfair dismissal protections apply for illness-related absences.',
    resources: [{ name: 'Australian Human Rights Commission', url: 'https://humanrights.gov.au' }, { name: 'Fair Work Ombudsman', url: 'https://www.fairwork.gov.au' }]
  },
  {
    country: 'Germany',
    abbr: 'DE',
    flag: '🇩🇪',
    rating: 'strongest',
    summary: 'Comprehensive protections including statutory sick pay for up to 78 weeks, strong dismissal protections, and rehabilitation rights.',
    highlights: [
      { label: 'General Equal Treatment Act (AGG)', detail: 'Prohibits disability discrimination in the workplace. Cancer qualifies as a disability when it causes functional limitations. Employers must provide reasonable accommodations.' },
      { label: 'Statutory Sick Pay', detail: 'Employers pay full salary for 6 weeks. After that, statutory health insurance pays 70% of gross salary (sick pay / Krankengeld) for up to 78 weeks total.' },
      { label: 'Severe Disability Status', detail: 'If cancer results in a disability degree (GdB) of 50+, employees gain "severely disabled" status with extra annual leave, enhanced dismissal protection, and right to part-time work.' },
      { label: 'Phased Return (BEM)', detail: 'Employers with 10+ employees must offer a "Company Integration Management" (BEM) process after 42 days of sick leave — a structured plan to reintegrate the employee.' },
    ],
    keyPoints: 'Up to 78 weeks of income replacement. Employers must offer reintegration planning after 42 days. Severe disability status grants extra rights at GdB 50+.',
    resources: [{ name: 'Bundesagentur für Arbeit', url: 'https://www.arbeitsagentur.de' }, { name: 'REHADAT', url: 'https://www.rehadat.de' }]
  },
  {
    country: 'France',
    abbr: 'FR',
    flag: '🇫🇷',
    rating: 'strong',
    summary: 'Cancer patients are protected by disability law, with generous sick pay (up to 3 years), and employer obligations for reintegration.',
    highlights: [
      { label: 'Labour Code & Disability', detail: 'Cancer that causes functional limitations qualifies as a disability under French law. Employers must make reasonable adjustments and cannot discriminate.' },
      { label: 'Sick Pay (Indemnités Journalières)', detail: 'Social Security pays daily sick allowances for up to 3 years for long-term illness (ALD — Affection de Longue Durée), including cancer. Pays approximately 50–66% of daily wages.' },
      { label: 'ALD Status', detail: 'Cancer is on the ALD list. This grants 100% medical cost reimbursement, extended sick leave, and access to specialized support services.' },
      { label: 'Reintegration Visit', detail: 'After 30+ days of sick leave, a "visite de reprise" with occupational medicine is mandatory before returning to work. May result in adjusted duties.' },
    ],
    keyPoints: 'Cancer is an ALD giving full medical cost coverage. Up to 3 years sick pay. Mandatory medical reintegration visit after extended leave.',
    resources: [{ name: 'Ameli (Assurance Maladie)', url: 'https://www.ameli.fr' }, { name: 'Défenseur des droits', url: 'https://www.defenseurdesdroits.fr' }]
  },
  {
    country: 'Netherlands',
    abbr: 'NL',
    flag: '🇳🇱',
    rating: 'strongest',
    summary: 'Employers must pay at least 70% of salary for up to 2 years, with a strict reintegration obligation and strong anti-discrimination law.',
    highlights: [
      { label: 'Sick Pay (2 Years)', detail: 'Employers are legally required to continue paying at least 70% of salary (often 100% in first year via contract) for up to 104 weeks of illness.' },
      { label: 'Reintegration Obligation', detail: 'Employer and employee must create a reintegration plan. After 2 years, UWV (Social Security) takes over with WIA disability benefits if the employee cannot return to work.' },
      { label: 'WGBH / Equal Treatment Act', detail: 'Disability discrimination is prohibited. Cancer patients must receive reasonable accommodations. Dismissal during sick leave is not permitted (2-year protection).' },
      { label: 'Dismissal Protection', detail: 'An employer legally cannot dismiss a sick employee during the first 2 years of illness — one of the strongest dismissal protections in Europe.' },
    ],
    keyPoints: 'Cannot be dismissed during 2-year sick period. Employer pays 70%+ of salary for 2 years. Mandatory reintegration plan required.',
    resources: [{ name: 'UWV (Social Security)', url: 'https://www.uwv.nl' }, { name: 'College voor de Rechten van de Mens', url: 'https://www.mensenrechten.nl' }]
  },
  {
    country: 'Sweden',
    abbr: 'SE',
    flag: '🇸🇪',
    rating: 'strongest',
    summary: 'Generous sickness benefit system with up to 364 days of sickness allowance and strong rehabilitation obligations.',
    highlights: [
      { label: 'Sickness Benefit (Sjukpenning)', detail: 'After 14 days of employer-paid sick pay, Försäkringskassan (Social Insurance Agency) pays sickness benefit at ~80% of income for up to 364 days, with extensions for serious illness.' },
      { label: 'Rehabilitation Obligation', detail: 'Employers have a legal obligation to investigate, plan, and implement rehabilitation measures so the employee can return to work.' },
      { label: 'Discrimination Act', detail: 'The Discrimination Act (2008) covers disability including cancer. Employers must take active measures and provide reasonable accommodations.' },
      { label: 'Extended Benefits', detail: 'For serious illness like cancer, benefits can be extended beyond 364 days. Long-term sickness activity allowance is also available.' },
    ],
    keyPoints: '~80% income replacement during illness. Employer rehabilitation obligation. Extended benefits for serious illness like cancer.',
    resources: [{ name: 'Försäkringskassan', url: 'https://www.forsakringskassan.se' }, { name: 'Diskrimineringsombudsmannen', url: 'https://www.do.se' }]
  },
  {
    country: 'India',
    abbr: 'IN',
    flag: '🇮🇳',
    rating: 'moderate',
    summary: 'The Rights of Persons with Disabilities Act 2016 covers cancer, with sector-specific protections and ESI medical benefits.',
    highlights: [
      { label: 'RPWD Act 2016', detail: 'Cancer is recognized as a disability under the Rights of Persons with Disabilities Act. Employers with 20+ employees must have an equal opportunity policy and avoid discrimination.' },
      { label: 'ESI (Employees State Insurance)', detail: 'For eligible workers, ESI provides sickness benefits at 70% of wages for up to 91 days per year. Extended sickness benefit available for 2 years for specified serious diseases including cancer.' },
      { label: 'Gratuity & Leave', detail: 'Workers are entitled to sick leave under applicable state laws (varies). The Factories Act and Shops & Establishments Acts govern leave entitlements by sector.' },
      { label: 'Public Sector', detail: 'Government employees often have more generous provisions including medical leave on full/half pay and special leave for cancer treatment.' },
    ],
    keyPoints: 'Cancer is a recognized disability under RPWD Act 2016. ESI provides 70% wage replacement. Protections vary significantly by sector and employer size.',
    resources: [{ name: 'ESIC (ESI Corporation)', url: 'https://www.esic.in' }, { name: 'Dept. of Empowerment of Persons with Disabilities', url: 'https://disabilityaffairs.gov.in' }]
  },
  {
    country: 'Brazil',
    abbr: 'BR',
    flag: '🇧🇷',
    rating: 'strong',
    summary: 'Cancer patients have special dismissal protections and social security sickness benefits; cancer is explicitly protected under Brazilian law.',
    highlights: [
      { label: 'Special Dismissal Protection', detail: 'Brazilian courts and law recognize cancer patients as having enhanced job stability. Dismissing an employee during cancer treatment without just cause is generally prohibited and reversible.' },
      { label: 'INSS Sickness Benefit (Auxílio-Doença)', detail: 'Social Security (INSS) pays sickness benefits after 15 employer-paid days, replacing 91% of the benefit salary for the duration of incapacity.' },
      { label: 'Disability Quota', detail: 'Companies with 100+ employees must fill 2–5% of positions with people with disabilities (Lei de Cotas). Cancer patients qualifying as disabled may benefit.' },
      { label: 'CLT Protections', detail: 'The Consolidation of Labor Laws (CLT) provides 15 days of employer-paid sick leave, after which INSS takes over. Termination during illness or treatment is broadly protectable.' },
    ],
    keyPoints: 'Cancer patients generally cannot be dismissed during treatment. INSS pays 91% of benefit salary during incapacity. 15 days employer-paid then social security.',
    resources: [{ name: 'INSS (Previdência Social)', url: 'https://www.inss.gov.br' }, { name: 'MPT (Labor Ministry)', url: 'https://www.gov.br/trabalho-e-emprego' }]
  },
  {
    country: 'Japan',
    abbr: 'JP',
    flag: '🇯🇵',
    rating: 'moderate',
    summary: 'Health Insurance provides sickness allowance for up to 18 months; disability discrimination protections exist but are less explicit than Western peers.',
    highlights: [
      { label: 'Health Insurance Sickness Allowance', detail: 'Employees covered by health insurance receive a sickness allowance (傷病手当金) of approximately 2/3 of standard remuneration for up to 18 months when unable to work due to illness.' },
      { label: 'Act for Eliminating Discrimination against Persons with Disabilities', detail: 'Enacted 2016, prohibits unreasonable discrimination. Cancer qualifying as a functional disability is covered, with employers required to provide "reasonable consideration."' },
      { label: 'Work Style Reform', detail: 'The 2018 Work Style Reform Act encourages flexible working arrangements. Some companies have introduced support programs for employees undergoing treatment.' },
      { label: 'Employment Promotion Act', detail: 'Employers with 100+ employees must employ a quota of persons with disabilities. Cancer survivors qualifying as disabled may be eligible.' },
    ],
    keyPoints: '18-month sickness allowance at ~67% pay. Disability discrimination is prohibited. Protections for cancer are less explicit than Europe but improving.',
    resources: [{ name: 'Japan Pension Service', url: 'https://www.nenkin.go.jp' }, { name: 'Ministry of Health, Labour and Welfare', url: 'https://www.mhlw.go.jp/english' }]
  },
  {
    country: 'South Africa',
    abbr: 'ZA',
    flag: '🇿🇦',
    rating: 'moderate',
    summary: 'The Employment Equity Act protects cancer patients as disabled persons; sick leave and UIF benefits apply.',
    highlights: [
      { label: 'Employment Equity Act', detail: 'Cancer is recognized as a disability. Employers must take steps to eliminate unfair discrimination and provide reasonable accommodation for employees with disabilities.' },
      { label: 'Basic Conditions of Employment Act', detail: 'Workers are entitled to 30 days of paid sick leave in a 3-year cycle. Employers must accommodate sick employees where reasonable.' },
      { label: 'UIF (Unemployment Insurance Fund)', detail: 'The UIF Illness Benefit provides up to 238 days of income replacement at a reduced rate (between 38–58% of earnings) when unable to work due to illness.' },
      { label: 'Labour Relations Act', detail: 'Dismissing an employee due to incapacity from illness requires a fair process — the employer must assess ability, consider alternatives, and consult the employee.' },
    ],
    keyPoints: 'Cancer is a recognized disability. 30 days paid sick leave per 3-year cycle. UIF illness benefit provides partial income replacement up to 238 days.',
    resources: [{ name: 'CCMA', url: 'https://www.ccma.org.za' }, { name: 'UIF', url: 'https://www.labour.gov.za/uif' }]
  },
  {
    country: 'New Zealand',
    abbr: 'NZ',
    flag: '🇳🇿',
    rating: 'strong',
    summary: 'The Human Rights Act and Employment Relations Act protect cancer patients; 10 days sick leave plus ACC coverage for treatment injuries.',
    highlights: [
      { label: 'Human Rights Act 1993', detail: 'Cancer is a disability under NZ law. Employers cannot discriminate in hiring, conditions, or dismissal on grounds of disability including cancer.' },
      { label: 'Sick Leave Entitlement', detail: 'Employees are entitled to at least 10 days paid sick leave per year (increased from 5 days in 2021). Unused days can carry over up to 20 days total.' },
      { label: 'Employment Relations Act', detail: 'Employers must follow a fair process before dismissal for health reasons, including genuine attempts to accommodate the employee and consider alternatives.' },
      { label: 'ACC Coverage', detail: 'Accident Compensation Corporation may cover work-related cancer or treatment injuries, providing medical costs and 80% of lost earnings.' },
    ],
    keyPoints: '10 days paid sick leave per year. Cancer is a protected disability. Employers must follow fair process before any health-related dismissal.',
    resources: [{ name: 'Human Rights Commission NZ', url: 'https://www.hrc.co.nz' }, { name: 'Employment NZ', url: 'https://www.employment.govt.nz' }]
  },
];

const ratingConfig = {
  strongest: { label: 'Strongest Protections', color: 'bg-emerald-700 text-emerald-100', border: 'border-emerald-600', icon: Star },
  strong: { label: 'Strong Protections', color: 'bg-teal-700 text-teal-100', border: 'border-teal-600', icon: CheckCircle2 },
  moderate: { label: 'Moderate Protections', color: 'bg-amber-700 text-amber-100', border: 'border-amber-600', icon: Info },
  basic: { label: 'Basic Protections', color: 'bg-slate-600 text-slate-200', border: 'border-slate-500', icon: AlertTriangle },
};

function CountryCard({ data }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = ratingConfig[data.rating];
  const RatingIcon = cfg.icon;

  return (
    <Card className="bg-slate-800 border-slate-600 hover:border-slate-400 transition-all">
      <button onClick={() => setExpanded(!expanded)} className="w-full text-left">
        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-slate-700 flex items-center justify-center flex-shrink-0 text-2xl">
                {data.flag}
              </div>
              <div>
                <h3 className="font-bold text-slate-100 text-lg">{data.country}</h3>
                <p className="text-sm text-slate-400 leading-snug">{data.summary}</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2 flex-shrink-0">
              <span className={`text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1 ${cfg.color}`}>
                <RatingIcon className="h-3 w-3" />
                {cfg.label}
              </span>
              {expanded ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
            </div>
          </div>
        </div>
      </button>

      {expanded && (
        <div className="px-5 pb-5 space-y-4 border-t border-slate-700 pt-4">
          <div className={`p-3 rounded-lg border ${cfg.border} bg-slate-900/50`}>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Key Points</p>
            <p className="text-sm text-slate-200">{data.keyPoints}</p>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Laws & Protections</p>
            {data.highlights.map((h, i) => (
              <div key={i} className="bg-slate-700/60 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <span className="text-xs font-bold bg-slate-600 text-slate-200 px-2 py-0.5 rounded flex-shrink-0 mt-0.5">{h.label}</span>
                  <p className="text-sm text-slate-300 leading-relaxed">{h.detail}</p>
                </div>
              </div>
            ))}
          </div>

          {data.resources?.length > 0 && (
            <div className="flex gap-3 flex-wrap">
              {data.resources.map(r => (
                <a key={r.name} href={r.url} target="_blank" rel="noopener noreferrer"
                  className="text-xs text-cyan-400 hover:text-cyan-300 underline underline-offset-2">
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

export default function InternationalLaws() {
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
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
          International Employment Laws
        </h1>
        <p className="text-lg text-slate-300 max-w-2xl mx-auto">
          Cancer survivor employment rights and protections across {countries.length} countries worldwide
        </p>
      </div>

      {/* Global Note */}
      <Card className="bg-indigo-900/40 border-indigo-700">
        <div className="p-5">
          <div className="flex items-start gap-3">
            <Globe className="h-6 w-6 text-indigo-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-2">
              <h3 className="font-semibold text-indigo-300">Universal Principles</h3>
              <div className="grid sm:grid-cols-2 gap-2 text-sm text-indigo-200">
                <div><strong>Anti-discrimination:</strong> Most countries prohibit cancer discrimination in employment through disability or health laws.</div>
                <div><strong>Reasonable adjustments:</strong> Employers globally are increasingly required to accommodate cancer patients returning to work.</div>
                <div><strong>Income replacement:</strong> Most developed nations offer some form of sickness benefit ranging from 50–100% of wages.</div>
                <div><strong>Dismissal protection:</strong> Many countries restrict or prohibit dismissal during active illness or treatment.</div>
              </div>
              <p className="text-xs text-indigo-400 mt-2">Laws vary significantly between countries and can change. Always verify current rules with local legal counsel or government resources.</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Rating summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {['strongest', 'strong', 'moderate', 'basic'].map(key => {
          const cfg = ratingConfig[key];
          const Icon = cfg.icon;
          return (
            <div key={key} className="bg-slate-800 border border-slate-600 rounded-lg p-3 text-center">
              <span className={`text-xs px-2 py-1 rounded-full font-medium inline-flex items-center gap-1 ${cfg.color}`}>
                <Icon className="h-3 w-3" />
                {cfg.label}
              </span>
              <p className="text-lg font-bold text-slate-200 mt-2">{counts[key] || 0}</p>
              <p className="text-xs text-slate-400">countries</p>
            </div>
          );
        })}
      </div>

      {/* Search & Filter */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input
            placeholder="Search by country, law name, or topic..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-slate-800 border-slate-600 text-slate-200 placeholder:text-slate-500"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setRatingFilter(f)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                ratingFilter === f
                  ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
                  : 'bg-slate-800 text-slate-300 border border-slate-600 hover:border-cyan-500'
              }`}
            >
              {f} {f !== 'All' && <span className="ml-1 opacity-70">({counts[f.toLowerCase()] ?? 0})</span>}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card className="bg-slate-800 border-slate-600">
          <div className="py-8 text-center">
            <Search className="h-10 w-10 text-slate-500 mx-auto mb-3" />
            <p className="text-slate-400">No countries found for "{search}". Try a broader search.</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map(c => <CountryCard key={c.country} data={c} />)}
        </div>
      )}

      <Card className="bg-amber-900/20 border-amber-800">
        <div className="p-5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-300 mb-1">Important Disclaimer</p>
              <p className="text-sm text-amber-200">
                This information is for educational purposes only and provides general summaries. Employment laws change frequently and vary by employer size, industry, and individual circumstances. <strong>Please consult a qualified local employment attorney or HR professional</strong> for advice specific to your country and situation.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}