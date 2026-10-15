import { useEffect } from 'react';

const BASE_TITLE = 'Navigator — Back to Life, Back to Work';
export const CANONICAL_ORIGIN = 'https://return-to-work-navigator.org';

const NOINDEX_ROUTES = new Set([
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/oauthconsent',
  '/profile',
  '/myfeedback',
  '/recordkeeping',
  '/gamification',
  '/toolegagementdashboard',
]);

export const ROUTE_SEO = {
  '/': {
    title: 'Cancer Survivor Return-to-Work Toolkit & ADA Guide',
    description:
      'Free return-to-work toolkit for cancer survivors: request ADA workplace accommodations, manage treatment fatigue, know your FMLA rights, and plan a phased return.',
    h1: 'Return-to-Work Toolkit for Cancer Survivors',
    path: '/',
  },
  '/home': {
    title: 'Cancer Survivor Return-to-Work Toolkit & ADA Guide',
    description:
      'Free return-to-work toolkit for cancer survivors: request ADA workplace accommodations, manage treatment fatigue, know your FMLA rights, and plan a phased return.',
    h1: 'Return-to-Work Toolkit for Cancer Survivors',
    path: '/',
  },
  '/about': {
    title: 'About Jess Whorton & Our Cancer Survivorship Mission',
    description:
      'Meet founder Jess Whorton and learn how Back to Life, Back to Work Navigator empowers cancer survivors with practical workplace tools, legal guides, and peer support.',
    h1: 'About Back to Life, Back to Work Navigator',
    path: '/About',
  },
  '/contact': {
    title: 'Contact the Return to Work Navigator Team',
    description:
      'Reach out to the Back to Life, Back to Work Navigator team with questions, workplace resource suggestions, survivor feedback, or partnership inquiries.',
    h1: 'Contact the Return to Work Navigator Team',
    path: '/Contact',
  },
  '/blog': {
    title: 'Cancer Survivor Return-to-Work Stories & Founder Blog',
    description:
      'Read honest reflections, practical encouragement, and workplace recovery stories from cancer survivor and founder Jess Whorton.',
    h1: 'Founder Reflections: Inspiration & Hope After Cancer',
    path: '/Blog',
  },
  '/resourcelibrary': {
    title: 'Legal Rights & Workplace Accommodation Resource Library',
    description:
      'Searchable directory of ADA accommodation guides, FMLA checklists, legal aid organizations, and workplace templates for cancer survivors.',
    h1: 'Legal Rights & Workplace Accommodation Resource Library',
    path: '/ResourceLibrary',
  },
  '/resources': {
    title: 'Curated Cancer Survivorship & Return-to-Work Resources',
    description:
      'Explore 90+ vetted articles, workshops, meditations, podcasts, and support groups tailored to every stage of returning to work after cancer.',
    h1: 'Curated Return-to-Work & Survivorship Resources',
    path: '/Resources',
  },
  '/wellnesslibrary': {
    title: 'Cancer Fatigue, Sleep & Workplace Wellness Library',
    description:
      'Evidence-based wellness guides for cancer survivors returning to work: manage chemo brain, cancer-related fatigue, sleep disruption, nutrition, and stress.',
    h1: 'Cancer Survivorship & Workplace Wellness Library',
    path: '/WellnessLibrary',
  },
  '/wellnessresources': {
    title: 'Stress Relief, Breathing & Coping Techniques at Work',
    description:
      'Quick 3-minute desk exercises, grounding techniques, sleep hygiene habits, and cognitive strategies to manage workplace stress after cancer treatment.',
    h1: 'Workplace Stress Relief & Wellness Techniques',
    path: '/WellnessResources',
  },
  '/expertadvice': {
    title: 'Expert Advice & Q&A: Oncology Social Workers & Employment Lawyers',
    description:
      'Actionable return-to-work advice from oncology social workers, employment attorneys, and clinical psychologists, plus real survivor questions answered by workplace experts.',
    h1: 'Expert Return-to-Work Advice & Answers for Cancer Survivors',
    path: '/ExpertAdvice',
  },
  '/disclosureguide': {
    title: 'How to Tell Your Employer About a Cancer Diagnosis',
    description:
      'Step-by-step workplace disclosure guide for cancer survivors: decide whether, when, and how to share your diagnosis with HR or your manager while protecting your privacy.',
    h1: 'How to Tell Your Employer About Your Cancer Diagnosis',
    path: '/DisclosureGuide',
  },
  '/managerguide': {
    title: 'Manager & HR Guide to Supporting Employees With Cancer',
    description:
      'Practical handbook for managers and HR leaders supporting an employee returning after cancer treatment: empathy, ADA accommodations, FMLA compliance, and scripts.',
    h1: 'Supporting an Employee Through Cancer and Back to Work',
    path: '/ManagerGuide',
  },
  '/forclinics': {
    title: 'For Clinics, Oncology Social Workers & Nurse Navigators',
    description:
      'Learn how oncology clinics, nurse navigators, and social workers can refer cancer survivors to Return to Work Navigator — 100% free for patients, privacy-first, with printable handouts and a 15-minute team demo.',
    h1: 'For Oncology Clinics, Nurse Navigators & Social Workers',
    path: '/ForClinics',
  },
  '/legalpolicyhub': {
    title: 'ADA, FMLA & Workplace Legal Rights Hub for Cancer Survivors',
    description:
      'Understand your federal, state, and international employment protections as a cancer survivor, including ADA reasonable accommodations, FMLA leave, and medical privacy.',
    h1: 'Workplace Legal Rights & Policy Hub for Cancer Survivors',
    path: '/LegalPolicyHub',
  },
  '/legalrights': {
    title: 'ADA, FMLA, COBRA & HIPAA Protections for Cancer Survivors',
    description:
      'Plain-language guide to federal employment laws protecting cancer survivors at work: the Americans with Disabilities Act (ADA), FMLA leave, COBRA, and GINA.',
    h1: 'Federal Workplace Legal Rights for Cancer Survivors',
    path: '/LegalRights',
  },
  '/legalrightsadvisor': {
    title: 'Interactive ADA & FMLA Legal Rights Advisor',
    description:
      'Ask our interactive Legal Rights Advisor plain-language questions about ADA workplace accommodations, intermittent FMLA leave, COBRA coverage, and EEOC protections.',
    h1: 'Interactive Workplace Legal Rights Advisor',
    path: '/LegalRightsAdvisor',
  },
  '/legalrightschecklist': {
    title: 'ADA Accommodations & FMLA Paperwork Checklist',
    description:
      'Track every step to protect your job and benefits during cancer recovery: medical documentation, FMLA certification, ergonomic requests, and HR follow-ups.',
    h1: 'Legal Rights & Medical Accommodations Checklist',
    path: '/LegalRightsChecklist',
  },
  '/statebystatelaws': {
    title: 'State-by-State Cancer Employment & Paid Leave Laws',
    description:
      'Compare workplace disability protections, paid family and medical leave programs, and small-employer anti-discrimination laws across all 50 U.S. states.',
    h1: 'State-by-State Employment & Leave Laws for Cancer Survivors',
    path: '/StateByStateLaws',
  },
  '/internationallaws': {
    title: 'International Cancer Employment Rights & Sick Pay Guide',
    description:
      'Compare employment protections, statutory sick pay, and reasonable workplace adjustment laws for cancer survivors across the UK, Canada, EU, Australia, and beyond.',
    h1: 'International Employment Laws for Cancer Survivors',
    path: '/InternationalLaws',
  },
  '/legaldirectory': {
    title: 'Searchable ADA, FMLA & Insurance Legal Directory',
    description:
      'Find fast, plain-language answers on intermittent FMLA leave, ADA accommodation denials, short-term disability insurance, COBRA continuation, and workplace privacy.',
    h1: 'Legal Rights & Workplace Accommodations Directory',
    path: '/LegalDirectory',
  },
  '/accommodations': {
    title: 'Workplace Accommodations Builder for Cancer Survivors',
    description:
      'Browse common ADA workplace accommodations for fatigue, chemo brain, neuropathy, and medical appointments, and build a customized request letter for HR.',
    h1: 'Workplace Accommodations for Cancer Survivors',
    path: '/Accommodations',
  },
  '/accommodationlettergenerator': {
    title: 'Free ADA Workplace Accommodation Letter Generator',
    description:
      'Generate a formal, ADA-aligned workplace accommodation request letter in three guided steps — customize schedule, remote work, and fatigue accommodations.',
    h1: 'ADA Workplace Accommodation Letter Generator',
    path: '/AccommodationLetterGenerator',
  },
  '/accommodationtemplates': {
    title: 'Ready-to-Send ADA Accommodation Request Letter Templates',
    description:
      'Customize pre-written ADA accommodation request letters for flexible schedules, remote work, reduced hours, ergonomic adjustments, and medical appointments.',
    h1: 'Workplace Accommodation Request Letter Templates',
    path: '/AccommodationTemplates',
  },
  '/accommodationworksheet': {
    title: 'Printable HR Accommodation Meeting Prep Worksheet',
    description:
      'Prepare for your HR or supervisor accommodation meeting with a structured, printable PDF worksheet covering your job duties, medical limitations, and proposed solutions.',
    h1: 'Accommodation Meeting Preparation Worksheet',
    path: '/AccommodationWorksheet',
  },
  '/communicationtoolkit': {
    title: 'Workplace Communication Scripts & Email Toolkit',
    description:
      'Scripts, email templates, AI email drafting, and meeting preparation tools to help cancer survivors talk with managers, HR, and coworkers with confidence.',
    h1: 'Workplace Communication Toolkit for Cancer Survivors',
    path: '/CommunicationToolkit',
  },
  '/communication': {
    title: 'Employer Email Templates & Workplace Conversation Scripts',
    description:
      'Copy-ready email templates and word-for-word scripts for requesting accommodations, setting boundaries with coworkers, and explaining schedule changes.',
    h1: 'Workplace Email Templates & Conversation Scripts',
    path: '/Communication',
  },
  '/employeremailgenerator': {
    title: 'AI Employer & HR Email Generator for Cancer Survivors',
    description:
      'Draft professional, tailored emails to your supervisor or HR department for return-to-work plans, accommodation requests, and medical schedule updates.',
    h1: 'AI Employer & HR Email Generator',
    path: '/EmployerEmailGenerator',
  },
  '/meetingprep': {
    title: 'HR & Supervisor Return-to-Work Meeting Prep Planner',
    description:
      'Plan your return-to-work and accommodation meetings with talking points, anticipated employer questions, response logs, and printable agendas.',
    h1: 'Workplace Meeting Preparation & Talking Points',
    path: '/MeetingPrep',
  },
  '/careerhub': {
    title: 'Phased Return-to-Work Planner & Survivor Career Hub',
    description:
      'Build a phased return-to-work schedule, explore disability-inclusive and remote job boards, and analyze resumes and job postings after a medical career break.',
    h1: 'Career & Phased Return-to-Work Planning Hub',
    path: '/CareerHub',
  },
  '/returnplanning': {
    title: 'Phased Return-to-Work Schedule Builder & Templates',
    description:
      'Design a gradual, week-by-week return-to-work schedule with customizable part-time hours, remote work days, rest breaks, and workplace accommodations.',
    h1: 'Phased Return-to-Work Schedule Planner',
    path: '/ReturnPlanning',
  },
  '/jobboards': {
    title: 'Flexible, Remote & Survivor-Friendly Job Boards',
    description:
      'Curated directory of flexible, remote, returnship, and disability-inclusive job boards for cancer survivors re-entering the workforce or changing careers.',
    h1: 'Flexible & Survivor-Friendly Job Boards',
    path: '/JobBoards',
  },
  '/wellbeinghub': {
    title: 'Cancer Fatigue Management & Emotional Well-Being Hub',
    description:
      'Track daily energy levels, manage treatment fatigue and chemo brain at work, and access emotional support strategies for return-to-work anxiety.',
    h1: 'Workplace Energy, Fatigue & Emotional Well-Being Hub',
    path: '/WellbeingHub',
  },
  '/energymanagement': {
    title: 'Daily Workday Energy & Fatigue Pacing Tracker',
    description:
      'Log morning, afternoon, and evening energy levels and uncover daily patterns to pace your workday without burnout.',
    h1: 'Daily Workday Energy & Fatigue Pacing Tracker',
    path: '/EnergyManagement',
  },
  '/emotionalsupport': {
    title: 'Managing Return-to-Work Anxiety & Emotional Recovery',
    description:
      'Practical coping strategies for cancer survivors navigating return-to-work anxiety, imposter syndrome, scanxiety, and coworker conversations.',
    h1: 'Emotional Support & Return-to-Work Anxiety Guide',
    path: '/EmotionalSupport',
  },
  '/communityhub': {
    title: 'Cancer Survivor Return-to-Work Peer Community Hub',
    description:
      'Connect with fellow cancer survivors navigating the return to work, share progress milestones, exchange vetted resources, and ask expert questions.',
    h1: 'Cancer Survivor Return-to-Work Community Hub',
    path: '/CommunityHub',
  },
  '/communityguidelines': {
    title: 'Community Forum Guidelines: Supportive, Work-Focused Peer Support',
    description:
      'How the Return to Work Navigator community forum works: kindness, privacy, on-topic peer support about returning to work after cancer, and how posts are moderated.',
    h1: 'Community Guidelines',
    path: '/CommunityGuidelines',
  },
  '/helpsupport': {
    title: 'Help Center, Return-to-Work FAQs & PDF Report Exports',
    description:
      'Find answers to common questions about using Return to Work Navigator, workplace legal rights, and exporting PDF summaries for your doctor or HR team.',
    h1: 'Help, Frequently Asked Questions & Report Exports',
    path: '/HelpSupport',
  },
  '/faq': {
    title: 'Frequently Asked Questions: Returning to Work After Cancer',
    description:
      'Clear answers to common questions about returning to work after cancer treatment: diagnosis disclosure, ADA accommodations, FMLA leave, fatigue, and privacy.',
    h1: 'Frequently Asked Questions About Returning to Work After Cancer',
    path: '/FAQ',
  },
  '/exportreports': {
    title: 'Export Printable PDF Summaries for Doctors & HR',
    description:
      'Download clean, professional PDF reports of your workday energy logs, meeting preparation notes, communication drafts, and return-to-work progress.',
    h1: 'Export & Download Printable Return-to-Work Reports',
    path: '/ExportReports',
  },
  '/roadmap': {
    title: 'Step-by-Step Return-to-Work Roadmap After Cancer',
    description:
      'Follow a guided four-stage roadmap from medical clearance and accommodation planning through your first week back and long-term career sustainability.',
    h1: 'Your Step-by-Step Return-to-Work Roadmap',
    path: '/Roadmap',
  },
  '/myjourney': {
    title: 'My Return-to-Work Journey Dashboard & Checklist',
    description:
      'Track your return-to-work milestones, complete your step-by-step preparation checklist, and download your personalized return summary in one place.',
    h1: 'My Return-to-Work Journey & Progress Hub',
    path: '/MyJourney',
  },
  '/checklist': {
    title: 'Interactive Return-to-Work Preparation Checklist',
    description:
      'Interactive step-by-step checklist for cancer survivors preparing to return to work: medical clearance, HR conversations, schedule planning, and self-care.',
    h1: 'Interactive Return-to-Work Preparation Checklist',
    path: '/Checklist',
  },
  '/progressdashboard': {
    title: 'Return-to-Work Energy, Mood & Milestone Analytics',
    description:
      'Visualize your daily energy trends, mood distribution, stress patterns, and checklist completion as you transition back to work.',
    h1: 'Return-to-Work Progress & Energy Analytics Dashboard',
    path: '/ProgressDashboard',
  },
  '/profile': {
    title: 'Account Profile, Accessibility & Notification Settings',
    description:
      'Manage your Return to Work Navigator profile, high-contrast accessibility mode, email reminder preferences, and account privacy settings.',
    h1: 'My Profile & Accessibility Preferences',
    path: '/Profile',
  },
  '/recordkeeping': {
    title: 'Private Medical, Workplace & HR Meeting Record Log',
    description:
      'Keep organized, dated records of doctor recommendations, work restrictions, HR accommodation meetings, and workplace journal notes in one private log.',
    h1: 'Medical, Workplace & Journal Record Keeping',
    path: '/RecordKeeping',
  },
  '/gamification': {
    title: 'Return-to-Work Milestones, Streaks & Achievements',
    description:
      'Celebrate every step of your return-to-work recovery with milestone badges, daily check-in streaks, and progress achievements.',
    h1: 'Your Return-to-Work Milestones & Achievements',
    path: '/Gamification',
  },
  '/coach': {
    title: '24/7 AI Return-to-Work Coach for Cancer Survivors',
    description:
      'Chat confidentially with your AI Return-to-Work Coach for tailored guidance on workplace accommodations, fatigue pacing, HR scripts, and emotional readiness.',
    h1: 'AI Return-to-Work Coach for Cancer Survivors',
    path: '/Coach',
  },
  '/coachbooking': {
    title: 'Book a 1-on-1 Return-to-Work Coaching Session',
    description:
      'Schedule a confidential one-on-one video or phone session with a return-to-work coach for personalized guidance on accommodations, disclosure, and career planning.',
    h1: 'Book a 1-on-1 Return-to-Work Coach',
    path: '/CoachBooking',
  },
  '/myfeedback': {
    title: 'My Saved Resource Feedback & Support Requests',
    description:
      'Review the ratings, notes, and topic requests you have shared across Return to Work Navigator wellness and legal resources.',
    h1: 'My Saved Resource Feedback',
    path: '/MyFeedback',
  },
  '/emergency-contacts': {
    title: '24/7 Crisis Hotlines & Cancer Support Helplines',
    description:
      'Free, confidential 24/7 crisis hotlines, oncology social work helplines, and legal aid contacts for cancer survivors needing immediate emotional or workplace support.',
    h1: '24/7 Emergency Contacts & Cancer Support Hotlines',
    path: '/emergency-contacts',
  },
  '/privacysecurity': {
    title: 'Privacy Policy & Data Security Practices',
    description:
      'Read our plain-language privacy policy explaining how Return to Work Navigator protects your health logs, workplace notes, and personal account data.',
    h1: 'Privacy Policy & Data Protection',
    path: '/PrivacySecurity',
  },
  '/login': {
    title: 'Sign In to Your Return to Work Navigator Account',
    description:
      'Sign in to Return to Work Navigator to access your saved accommodation drafts, energy logs, checklist progress, and private AI coaching conversations.',
    h1: 'Welcome Back — Sign In to Navigator',
    path: '/login',
  },
  '/register': {
    title: 'Create Your Free Return to Work Navigator Account',
    description:
      'Create a free Return to Work Navigator account to save your return-to-work checklist, track daily energy, and chat with the AI Return-to-Work Coach.',
    h1: 'Create Your Free Navigator Account',
    path: '/register',
  },
  '/forgot-password': {
    title: 'Reset Your Return to Work Navigator Password',
    description:
      'Request a secure password reset link for your Return to Work Navigator account.',
    h1: 'Reset Your Navigator Password',
    path: '/forgot-password',
  },
  '/reset-password': {
    title: 'Set a New Return to Work Navigator Password',
    description:
      'Choose a new password to complete your Return to Work Navigator account recovery.',
    h1: 'Set a New Account Password',
    path: '/reset-password',
  },
  '/toolegagementdashboard': {
    title: 'Admin Tool Engagement Analytics Dashboard',
    description:
      'Administrator analytics dashboard tracking engagement across the Accommodation Letter Generator, Employer Email Generator, Legal Rights Advisor, and AI Coach.',
    h1: 'Tool Engagement Metrics Dashboard',
    path: '/ToolEngagementDashboard',
  },
  '/managerguidees': {
    title: 'Guía para Gerentes y Recursos Humanos: Apoyo a Empleados con Cáncer',
    description:
      'Guía práctica en español para gerentes y Recursos Humanos sobre cómo apoyar a un empleado con cáncer: qué decir, adaptaciones bajo la ADA, licencia FMLA, confidencialidad y regreso gradual.',
    h1: 'Cómo Apoyar a un Empleado Durante el Cáncer y en su Regreso al Trabajo',
    path: '/ManagerGuideEs',
    lang: 'es',
  },
  '/accommodationses': {
    title: 'Adaptaciones Laborales bajo la ADA para Sobrevivientes de Cáncer (Guía y Carta)',
    description:
      'Guía completa en español sobre adaptaciones laborales razonables bajo la ADA para sobrevivientes de cáncer: fatiga, quimiocerebro, teletrabajo, regreso gradual y generador de carta para RR. HH.',
    h1: 'Adaptaciones Laborales para Sobrevivientes de Cáncer',
    path: '/AccommodationsEs',
    lang: 'es',
  },
  '/disclosureguidees': {
    title: 'Guía sobre la Divulgación del Cáncer en el Trabajo: Derechos, Privacidad y Guiones',
    description:
      'Guía práctica en español sobre si debes decir en el trabajo que tienes cáncer: privacidad bajo la ADA y la FMLA, diferencias entre RR. HH. y tu jefe, y guiones listos para usar.',
    h1: 'Guía sobre la Divulgación del Cáncer en el Trabajo',
    path: '/DisclosureGuideEs',
    lang: 'es',
  },
};

export function getRouteSEO(pathname = '/') {
  const clean = (pathname || '/').split('?')[0].split('#')[0].replace(/\/+$/, '') || '/';
  const key = clean.toLowerCase();
  const matched = ROUTE_SEO[key];
  if (matched) {
    return {
      ...matched,
      noindex: NOINDEX_ROUTES.has(key),
      isKnownRoute: true,
    };
  }
  return {
    title: 'Page Not Found (404)',
    description:
      'The page you requested could not be found. Explore Return to Work Navigator tools, ADA workplace accommodation guides, and cancer survivorship resources.',
    h1: 'Page Not Found',
    path: clean,
    noindex: true,
    isKnownRoute: false,
  };
}

/**
 * Updates document title, meta description, robots directive, and canonical URL per page.
 * Also updates Open Graph and Twitter card tags for social sharing.
 */
function setMeta(selector, attr, value) {
  if (typeof document === 'undefined') return;
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement('meta');
    const [, name] = selector.match(/\[(.+?)="(.+?)"\]/) || [];
    if (name) {
      const key = selector.includes('property=') ? 'property' : 'name';
      el.setAttribute(key, selector.match(/="(.+?)"/)[1]);
    }
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
}

export function applySEO({ title, description, path, noindex } = {}) {
  if (typeof document === 'undefined' || typeof window === 'undefined') return;
  const currentPathname = window.location.pathname || '/';
  const fallback = getRouteSEO(path || currentPathname);
  const resolvedTitle = title || fallback.title;
  const resolvedDescription = description || fallback.description;
  const canonicalPath = fallback.isKnownRoute
    ? fallback.path
    : (path || fallback.path || '/');
  const shouldNoIndex =
    typeof noindex === 'boolean' ? noindex : Boolean(fallback.noindex);

  const fullTitle = resolvedTitle.includes('Navigator')
    ? resolvedTitle
    : `${resolvedTitle} | ${BASE_TITLE}`;

  document.title = fullTitle;

  if (resolvedDescription) {
    setMeta('meta[name="description"]', 'content', resolvedDescription);
    setMeta('meta[property="og:description"]', 'content', resolvedDescription);
    setMeta('meta[name="twitter:description"]', 'content', resolvedDescription);
  }

  setMeta('meta[property="og:title"]', 'content', fullTitle);
  setMeta('meta[name="twitter:title"]', 'content', fullTitle);

  const robotsContent = shouldNoIndex ? 'noindex, nofollow' : 'index, follow';
  setMeta('meta[name="robots"]', 'content', robotsContent);
  setMeta('meta[name="googlebot"]', 'content', robotsContent);

  let canonical = document.head.querySelector('link[rel="canonical"]');
  if (shouldNoIndex && !fallback.isKnownRoute) {
    if (canonical) canonical.remove();
  } else {
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    const absoluteUrl = new URL(canonicalPath, CANONICAL_ORIGIN).href;
    canonical.setAttribute('href', absoluteUrl);
    setMeta('meta[property="og:url"]', 'content', absoluteUrl);
  }
}

// Apply route metadata immediately on module load so crawlers inspecting the
// initial DOM before effects/auth settle already see the route's real tags.
if (typeof window !== 'undefined') {
  applySEO(getRouteSEO(window.location.pathname));
}

export default function useSEO({ title, description, path, noindex, enabled = true } = {}) {
  useEffect(() => {
    if (!enabled) return;
    applySEO({ title, description, path, noindex });
  }, [title, description, path, noindex, enabled]);
}