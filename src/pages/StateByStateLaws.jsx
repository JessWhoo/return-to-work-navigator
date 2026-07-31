import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Shield, ChevronDown, ChevronUp, Star, AlertTriangle, CheckCircle2, Info } from 'lucide-react';

const stateLaws = [
  {
    state: 'California',
    abbr: 'CA',
    rating: 'strongest',
    summary: 'One of the strongest state protections in the nation, going well beyond federal law.',
    highlights: [
      { label: 'FEHA', detail: 'Fair Employment & Housing Act covers employers with 5+ employees (vs federal 15+), providing much broader coverage.' },
      { label: 'CFRA', detail: 'California Family Rights Act provides 12 weeks of job-protected leave, running separately from FMLA — meaning eligible employees may get up to 24 total weeks.' },
      { label: 'PDL', detail: 'Pregnancy Disability Leave allows up to 4 months off for pregnancy-related conditions, stacking with CFRA.' },
      { label: 'SDI', detail: 'State Disability Insurance provides partial wage replacement (60-70%) during medical leave, funded by employee payroll deductions.' },
      { label: 'Cancer as Disability', detail: 'Cancer is explicitly recognized as a disability under FEHA. Employers must engage in a "good faith interactive process" for accommodations.' },
    ],
    keyDifferences: 'Employer threshold is 5 employees. Separate CFRA leave can double FMLA leave. State SDI pays partial wages during leave.',
    resources: [{ name: 'DFEH', url: 'https://www.dfeh.ca.gov' }]
  },
  {
    state: 'New York',
    abbr: 'NY',
    rating: 'strong',
    summary: 'Broad protections through the NYSHRL and NY Paid Family Leave, with strong anti-discrimination enforcement.',
    highlights: [
      { label: 'NYSHRL', detail: 'NY State Human Rights Law covers employers with 4+ employees and treats cancer as a disability requiring reasonable accommodation.' },
      { label: 'NYCHRL', detail: 'NYC Human Rights Law (for NYC workers) is even broader — applies to all employers and uses a more liberal standard for disability.' },
      { label: 'NY PFL', detail: 'Paid Family Leave allows up to 12 weeks at 67% of average weekly wage, job-protected, for caregiving or bonding — not for personal illness.' },
      { label: 'DBL', detail: 'Disability Benefits Law provides short-term disability benefits (up to 26 weeks) for off-the-job injuries and illness including cancer treatment.' },
    ],
    keyDifferences: 'Employer threshold is 4 employees. DBL provides partial wage replacement. NYC workers get even stronger protections under NYCHRL.',
    resources: [{ name: 'NYSDHR', url: 'https://dhr.ny.gov' }]
  },
  {
    state: 'Texas',
    abbr: 'TX',
    rating: 'basic',
    summary: 'Primarily relies on federal law (ADA, FMLA). Texas state protections largely mirror federal standards.',
    highlights: [
      { label: 'TCHRA', detail: 'Texas Commission on Human Rights Act mirrors the ADA and covers employers with 15+ employees — same threshold as federal law.' },
      { label: 'No State Leave', detail: 'Texas has no state-mandated paid leave law. Workers rely entirely on federal FMLA (unpaid, 12 weeks) for job-protected leave.' },
      { label: 'TWC', detail: 'Texas Workforce Commission enforces anti-discrimination complaints as an alternative to the EEOC.' },
    ],
    keyDifferences: 'No state paid leave or disability insurance. Protections mirror federal ADA/FMLA. Smaller employers (under 15) have no state protection.',
    resources: [{ name: 'TWC Civil Rights', url: 'https://www.twc.texas.gov/civilrights' }]
  },
  {
    state: 'Florida',
    abbr: 'FL',
    rating: 'basic',
    summary: 'Relies almost entirely on federal protections. Florida has no state FMLA equivalent or paid leave mandate.',
    highlights: [
      { label: 'FCRA', detail: 'Florida Civil Rights Act covers employers with 15+ employees and prohibits disability discrimination, mirroring the ADA.' },
      { label: 'No State FMLA', detail: 'Florida has no state-level family or medical leave law. Workers depend solely on federal FMLA for unpaid, job-protected leave.' },
      { label: 'No SDI', detail: 'Florida has no state disability insurance program. Income replacement during leave is not state-mandated.' },
    ],
    keyDifferences: 'No state paid leave, no SDI, no state FMLA. Heavily reliant on federal ADA and FMLA protections.',
    resources: [{ name: 'FCHR', url: 'http://fchr.state.fl.us' }]
  },
  {
    state: 'Washington',
    abbr: 'WA',
    rating: 'strong',
    summary: 'Strong protections with a state-funded paid leave program that covers personal medical leave.',
    highlights: [
      { label: 'WLAD', detail: 'Washington Law Against Discrimination covers employers with 8+ employees and broadly defines disability to include cancer.' },
      { label: 'PFML', detail: 'Paid Family & Medical Leave provides up to 12 weeks of paid leave (up to 18 for pregnancy), replacing up to 90% of wages for low-income workers.' },
      { label: 'WFLA', detail: 'Washington Family Leave Act mirrors FMLA but applies to employers with 8+ employees (vs 50+), dramatically expanding coverage.' },
    ],
    keyDifferences: 'State PFML pays wages during medical leave. WLAD and WFLA cover employers with 8+ employees, much lower than federal thresholds.',
    resources: [{ name: 'WA PFML', url: 'https://paidleave.wa.gov' }]
  },
  {
    state: 'Massachusetts',
    abbr: 'MA',
    rating: 'strong',
    summary: 'Comprehensive protections with one of the most generous paid leave programs in the U.S.',
    highlights: [
      { label: 'PFML', detail: 'MA Paid Family & Medical Leave provides up to 20 weeks of paid medical leave and 12 weeks family leave, replacing 80% of wages up to state average.' },
      { label: 'Chapter 151B', detail: 'Anti-discrimination law covers employers with 6+ employees. Cancer patients are explicitly protected and employers must provide reasonable accommodations.' },
      { label: 'MFLA', detail: 'MA Family & Medical Leave Act provides 24 weeks of leave over a 24-month period, more generous than federal FMLA.' },
    ],
    keyDifferences: 'PFML pays wages during leave (up to 20 weeks). MFLA provides 24 weeks of leave. Employer threshold is 6 employees.',
    resources: [{ name: 'MA PFML', url: 'https://www.mass.gov/pfml' }]
  },
  {
    state: 'New Jersey',
    abbr: 'NJ',
    rating: 'strong',
    summary: 'Robust state disability and family leave benefits with wage replacement during medical leave.',
    highlights: [
      { label: 'TDI', detail: 'Temporary Disability Insurance provides up to 26 weeks of wage replacement (up to 85% of wages) for personal illness including cancer treatment.' },
      { label: 'NJFLA', detail: 'NJ Family Leave Act covers employers with 30+ employees and provides 12 weeks of job-protected leave (runs separately from FMLA).' },
      { label: 'LAD', detail: 'Law Against Discrimination covers employers with 1+ employees — nearly universal coverage — and broadly protects cancer patients.' },
    ],
    keyDifferences: 'TDI pays wages (up to 85%) during personal medical leave. LAD covers all employers. NJFLA runs separately from FMLA for potentially more total leave.',
    resources: [{ name: 'NJ DOL', url: 'https://www.nj.gov/labor' }]
  },
  {
    state: 'Illinois',
    abbr: 'IL',
    rating: 'moderate',
    summary: 'Moderate protections, stronger than many states but without a state paid leave program until 2024.',
    highlights: [
      { label: 'IHRA', detail: 'IL Human Rights Act covers employers with 15+ employees and explicitly prohibits cancer discrimination.' },
      { label: 'Paid Leave 2024', detail: 'Illinois Paid Leave for All Workers Act (effective 2024) requires 40 hours of paid leave annually, usable for any reason including medical.' },
      { label: 'No SDI', detail: 'Illinois has no state disability insurance program for wage replacement during longer medical absences.' },
    ],
    keyDifferences: 'New 2024 paid leave law (40 hrs/yr). No state disability insurance for longer leaves. Protections cover employers with 15+ employees.',
    resources: [{ name: 'IDHR', url: 'https://www.illinois.gov/idhr' }]
  },
  {
    state: 'Colorado',
    abbr: 'CO',
    rating: 'strong',
    summary: 'Recently enacted strong paid leave and anti-discrimination laws that significantly expand worker protections.',
    highlights: [
      { label: 'FAMLI', detail: 'Family & Medical Leave Insurance program (launched 2024) provides up to 12 weeks of paid leave, replacing up to 90% of wages for low earners.' },
      { label: 'CADA', detail: 'CO Anti-Discrimination Act covers employers with 1+ employees — near-universal coverage — and treats cancer as a disability.' },
      { label: 'ACCRUED LEAVE', detail: 'CO requires employers to provide accrued sick leave that can be used for cancer treatment and recovery.' },
    ],
    keyDifferences: 'FAMLI paid leave launched 2024. CADA covers all employers (1+). One of the newest comprehensive paid leave states.',
    resources: [{ name: 'CO FAMLI', url: 'https://famli.colorado.gov' }]
  },
  {
    state: 'Oregon',
    abbr: 'OR',
    rating: 'strong',
    summary: 'Strong protections including a new Paid Leave Oregon program with significant wage replacement.',
    highlights: [
      { label: 'Paid Leave Oregon', detail: 'Provides up to 12 weeks of paid leave (up to 14 for pregnancy) replacing 60-100% of wages depending on income level.' },
      { label: 'ORS 659A', detail: 'Oregon Revised Statutes cover employers with 1+ employees for disability discrimination. Cancer is explicitly a protected disability.' },
      { label: 'OFLA', detail: 'Oregon Family Leave Act covers employers with 10+ employees and runs separately from FMLA, providing additional leave entitlements.' },
    ],
    keyDifferences: 'Paid Leave Oregon launched 2023. Covers employers with 10+ employees for OFLA. All employers (1+) covered for anti-discrimination.',
    resources: [{ name: 'OR Paid Leave', url: 'https://paidleave.oregon.gov' }]
  },
  {
    state: 'Pennsylvania',
    abbr: 'PA',
    rating: 'basic',
    summary: 'Primarily relies on federal law. No state paid leave program, though Philadelphia and Pittsburgh have local ordinances.',
    highlights: [
      { label: 'PHRA', detail: 'PA Human Relations Act covers employers with 4+ employees and prohibits disability discrimination including cancer.' },
      { label: 'No State Paid Leave', detail: 'Pennsylvania has no state paid family or medical leave law. Workers rely on federal FMLA (unpaid).' },
      { label: 'Local Ordinances', detail: 'Philadelphia requires employers with 10+ employees to provide paid sick leave. Pittsburgh has a similar ordinance.' },
    ],
    keyDifferences: 'PHRA covers employers with 4+ employees. No state paid leave. Philadelphia and Pittsburgh have local paid sick leave.',
    resources: [{ name: 'PHRC', url: 'https://www.phrc.pa.gov' }]
  },
  {
    state: 'Michigan',
    abbr: 'MI',
    rating: 'moderate',
    summary: 'Moderate protections with an improved paid sick time law effective 2025.',
    highlights: [
      { label: 'ELCRA', detail: 'Elliott-Larsen Civil Rights Act prohibits disability discrimination but cancer protections require showing it limits a major life activity.' },
      { label: 'ESTA 2025', detail: 'Improved Earned Sick Time Act (effective 2025) requires employers with 10+ employees to provide up to 72 hours of paid sick time per year.' },
      { label: 'No PFML', detail: 'Michigan has no state paid family or medical leave insurance program for longer absences.' },
    ],
    keyDifferences: 'ESTA 2025 improves paid sick time. No state PFML. Cancer protections require showing a disability connection.',
    resources: [{ name: 'MDCR', url: 'https://www.michigan.gov/mdcr' }]
  },
];

const ratingConfig = {
  strongest: { label: 'Strongest Protections', color: 'bg-emerald-700 text-white', border: 'border-emerald-400', icon: Star },
  strong: { label: 'Strong Protections', color: 'bg-teal-700 text-white', border: 'border-teal-400', icon: CheckCircle2 },
  moderate: { label: 'Moderate Protections', color: 'bg-amber-700 text-white', border: 'border-amber-400', icon: Info },
  basic: { label: 'Basic (Federal Only)', color: 'bg-slate-700 text-white', border: 'border-slate-400', icon: AlertTriangle },
};

function StateCard({ data }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = ratingConfig[data.rating];
  const RatingIcon = cfg.icon;

  return (
    <Card className={`bg-white border-slate-300 hover:border-slate-500 transition-all`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left"
      >
        <CardContent className="pt-5 pb-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0 border border-slate-300">
                <span className="text-sm font-bold text-slate-900">{data.abbr}</span>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">{data.state}</h3>
                <p className="text-sm text-slate-700 leading-snug">{data.summary}</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2 flex-shrink-0">
              <span className={`text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1 ${cfg.color}`}>
                <RatingIcon className="h-3 w-3" />
                {cfg.label}
              </span>
              {expanded ? <ChevronUp className="h-4 w-4 text-slate-700" /> : <ChevronDown className="h-4 w-4 text-slate-700" />}
            </div>
          </div>
        </CardContent>
      </button>

      {expanded && (
        <CardContent className="pt-0 pb-5 space-y-4 border-t border-slate-300">
          {/* Key Differences */}
          <div className={`p-3 rounded-lg border ${cfg.border} bg-slate-50`}>
            <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1">Key Difference from Federal Law</p>
            <p className="text-sm text-slate-900">{data.keyDifferences}</p>
          </div>

          {/* Laws */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Applicable Laws & Protections</p>
            {data.highlights.map((h, i) => (
              <div key={i} className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <span className="text-xs font-bold bg-slate-800 text-white px-2 py-0.5 rounded flex-shrink-0 mt-0.5">{h.label}</span>
                  <p className="text-sm text-slate-800 leading-relaxed">{h.detail}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Resources */}
          {data.resources?.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {data.resources.map(r => (
                <a
                  key={r.name}
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-cyan-700 hover:text-cyan-800 underline underline-offset-2 font-semibold"
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

export default function StateByStateLaws() {
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
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
          State-by-State Laws
        </h1>
        <p className="text-lg text-slate-700 max-w-2xl mx-auto">
          How your state's laws affect your return to work after cancer treatment — and where they differ from federal law
        </p>
      </div>

      {/* Federal Baseline Card */}
      <Card className="bg-indigo-50 border-indigo-300">
        <CardContent className="pt-5 pb-5">
          <div className="flex items-start gap-3">
            <Shield className="h-6 w-6 text-indigo-700 flex-shrink-0 mt-0.5" />
            <div className="space-y-2">
              <h3 className="font-semibold text-indigo-900">Federal Baseline (Applies to All States)</h3>
              <div className="grid sm:grid-cols-2 gap-2 text-sm text-slate-900">
                <div><strong>ADA:</strong> Disability discrimination ban, employers 15+, requires reasonable accommodations</div>
                <div><strong>FMLA:</strong> 12 weeks unpaid job-protected leave, employers 50+, employee 12-month tenure</div>
                <div><strong>HIPAA:</strong> Protects your medical information from being shared with employers</div>
                <div><strong>COBRA:</strong> Continue health insurance for up to 18 months after job loss or leave</div>
              </div>
              <p className="text-xs text-slate-700 mt-2">State laws can only <strong>expand</strong> these rights — never reduce them. The best protection is whichever is more generous: state or federal.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rating Legend */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Object.entries(ratingConfig).map(([key, cfg]) => {
          const Icon = cfg.icon;
          return (
            <div key={key} className="bg-white border border-slate-300 rounded-lg p-3 text-center">
              <span className={`text-xs px-2 py-1 rounded-full font-medium inline-flex items-center gap-1 ${cfg.color}`}>
                <Icon className="h-3 w-3" />
                {cfg.label}
              </span>
              <p className="text-lg font-bold text-slate-900 mt-2">{counts[key]}</p>
              <p className="text-xs text-slate-700">states</p>
            </div>
          );
        })}
      </div>

      {/* Search & Filter */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-600" />
          <Input
            placeholder="Search by state, law name, or topic..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-white border-slate-300 text-slate-900 placeholder:text-slate-500"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setRatingFilter(f)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                ratingFilter === f
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'bg-white text-slate-800 border border-slate-300 hover:border-indigo-500'
              }`}
            >
              {f} {f !== 'All' && <span className="ml-1 opacity-70">({counts[f.toLowerCase()] ?? 0})</span>}
            </button>
          ))}
        </div>
      </div>

      {/* State Cards */}
      {filtered.length === 0 ? (
        <Card className="bg-white border-slate-300">
          <CardContent className="pt-8 pb-8 text-center">
            <Search className="h-10 w-10 text-slate-500 mx-auto mb-3" />
            <p className="text-slate-700">No states found for "{search}". Try a broader search.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map(s => <StateCard key={s.state} data={s} />)}
        </div>
      )}

      {/* Disclaimer */}
      <Card className="bg-amber-50 border-amber-400">
        <CardContent className="pt-5 pb-5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-700 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-900 mb-1">Important Disclaimer</p>
              <p className="text-sm text-slate-900">
                This information is for educational purposes only and reflects general state law summaries. Laws change frequently and vary by employer size, local ordinances, and individual circumstances. <strong>Please consult a qualified employment attorney</strong> for advice specific to your situation before taking any action.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}