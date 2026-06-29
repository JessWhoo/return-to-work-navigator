// Curated legal-rights guides and workplace accommodation templates.
// Each item has: id, title, summary, category, type, tags, link (route or external URL), external (bool)

export const LIBRARY_CATEGORIES = [
  { id: 'all', label: 'All Resources' },
  { id: 'legal', label: 'Legal Rights' },
  { id: 'accommodations', label: 'Accommodations' },
  { id: 'templates', label: 'Templates & Scripts' },
  { id: 'disclosure', label: 'Disclosure' },
  { id: 'leave', label: 'Leave & Benefits' },
];

export const LIBRARY_ITEMS = [
  // Legal Rights guides
  {
    id: 'legal-rights-overview',
    title: 'Your Legal Rights as a Cancer Survivor',
    summary:
      'Overview of federal protections (ADA, FMLA, Rehabilitation Act, GINA) and what they mean for your job.',
    category: 'legal',
    type: 'Guide',
    tags: ['ADA', 'FMLA', 'federal law', 'rights'],
    link: '/LegalRights',
    external: false,
  },
  {
    id: 'state-laws',
    title: 'State-by-State Workplace Laws',
    summary:
      'Compare paid leave, anti-discrimination, and accommodation rules across all US states.',
    category: 'legal',
    type: 'Reference',
    tags: ['state law', 'paid leave', 'comparison'],
    link: '/StateByStateLaws',
    external: false,
  },
  {
    id: 'international-laws',
    title: 'International Employment Protections',
    summary:
      'Legal protections for cancer patients across 11 countries — UK, Canada, Australia, EU, and more.',
    category: 'legal',
    type: 'Reference',
    tags: ['international', 'global', 'EU', 'UK'],
    link: '/InternationalLaws',
    external: false,
  },
  {
    id: 'legal-policy-hub',
    title: 'Legal & Policy Hub',
    summary:
      'Centralized dashboard for workplace rights, disclosure, and accommodation policy.',
    category: 'legal',
    type: 'Hub',
    tags: ['policy', 'rights', 'overview'],
    link: '/LegalPolicyHub',
    external: false,
  },

  // Disclosure
  {
    id: 'disclosure-guide',
    title: 'Telling Your Employer: Step-by-Step',
    summary:
      '8-step guide with an interactive checklist for confidently disclosing your diagnosis at work.',
    category: 'disclosure',
    type: 'Guide',
    tags: ['disclosure', 'conversation', 'checklist'],
    link: '/DisclosureGuide',
    external: false,
  },

  // Accommodations
  {
    id: 'accommodations-overview',
    title: 'Workplace Accommodations Library',
    summary:
      'Browse reasonable accommodations for fatigue, treatment schedules, cognitive changes, and more.',
    category: 'accommodations',
    type: 'Guide',
    tags: ['accommodations', 'fatigue', 'schedule'],
    link: '/Accommodations',
    external: false,
  },
  {
    id: 'jan-network',
    title: 'JAN (Job Accommodation Network)',
    summary:
      'Free expert guidance on workplace accommodations from the US Department of Labor.',
    category: 'accommodations',
    type: 'External Resource',
    tags: ['accommodations', 'expert', 'DOL'],
    link: 'https://askjan.org/disabilities/Cancer.cfm',
    external: true,
  },
  {
    id: 'eeoc-cancer',
    title: 'EEOC Guidance: Cancer in the Workplace',
    summary:
      'Official EEOC questions & answers about cancer, the ADA, and your workplace rights.',
    category: 'accommodations',
    type: 'External Resource',
    tags: ['EEOC', 'ADA', 'official'],
    link: 'https://www.eeoc.gov/laws/guidance/questions-answers-about-cancer-workplace-and-americans-disabilities-act-ada',
    external: true,
  },

  // Templates & Scripts
  {
    id: 'accommodation-email',
    title: 'Accommodation Request Email Generator',
    summary:
      'AI-assisted email drafting for accommodation requests, schedule changes, and follow-ups.',
    category: 'templates',
    type: 'Template',
    tags: ['email', 'template', 'AI'],
    link: '/EmployerEmailGenerator',
    external: false,
  },
  {
    id: 'communication-templates',
    title: 'Communication Scripts & Templates',
    summary:
      'Pre-written scripts for disclosing, requesting accommodations, declining tasks, and setting boundaries.',
    category: 'templates',
    type: 'Template Library',
    tags: ['scripts', 'templates', 'communication'],
    link: '/Communication',
    external: false,
  },
  {
    id: 'meeting-prep',
    title: 'Meeting Prep Workbook',
    summary:
      'Build talking points, anticipate objections, and log employer responses before your HR meeting.',
    category: 'templates',
    type: 'Workbook',
    tags: ['meeting', 'HR', 'prep'],
    link: '/MeetingPrep',
    external: false,
  },
  {
    id: 'communication-toolkit',
    title: 'Communication Toolkit',
    summary:
      'All templates, the email generator, and meeting prep — in one place.',
    category: 'templates',
    type: 'Hub',
    tags: ['toolkit', 'overview'],
    link: '/CommunicationToolkit',
    external: false,
  },

  // Leave & Benefits
  {
    id: 'fmla-dol',
    title: 'FMLA Fact Sheet (US Dept. of Labor)',
    summary:
      'Official fact sheet explaining FMLA eligibility, leave entitlement, and employer obligations.',
    category: 'leave',
    type: 'External Resource',
    tags: ['FMLA', 'leave', 'DOL'],
    link: 'https://www.dol.gov/agencies/whd/fact-sheets/28-fmla',
    external: true,
  },
  {
    id: 'cancer-legal-resource',
    title: 'Cancer Legal Resource Center',
    summary:
      'Free information and resources on cancer-related legal issues including employment and insurance.',
    category: 'leave',
    type: 'External Resource',
    tags: ['legal aid', 'insurance', 'benefits'],
    link: 'https://thedrlc.org/cancer/',
    external: true,
  },
  {
    id: 'triage-cancer',
    title: 'Triage Cancer — Work & Finances',
    summary:
      'Free educational materials on work, finances, insurance, and legal issues after diagnosis.',
    category: 'leave',
    type: 'External Resource',
    tags: ['finances', 'work', 'education'],
    link: 'https://triagecancer.org/',
    external: true,
  },
];