// Global search index: every major page/tool with keywords for matching.
export const SEARCH_INDEX = [
  { title: 'Home', path: '/', description: 'Your dashboard and starting point', keywords: ['dashboard', 'start', 'overview', 'home'] },
  { title: 'AI Coach', path: '/Coach', description: 'Chat with your return-to-work AI coach', keywords: ['coach', 'chat', 'advice', 'ai', 'questions', 'support'] },
  { title: 'My Journey', path: '/MyJourney', description: 'Track your return-to-work progress', keywords: ['journey', 'progress', 'tracking', 'milestones', 'energy log'] },
  { title: 'Career & Return', path: '/CareerHub', description: 'Return planning, job boards, and career tools', keywords: ['career', 'return to work', 'job', 'resume', 'planning'] },
  { title: 'Health & Well-Being', path: '/WellbeingHub', description: 'Workday energy pacing and emotional support tools', keywords: ['health', 'wellbeing', 'fatigue', 'energy', 'pacing', 'mood', 'stress'] },
  { title: 'Wellness Library', path: '/WellnessLibrary', description: 'Browse resources on fatigue, rights, sleep, and more', keywords: ['wellness', 'library', 'fatigue', 'rights', 'sleep', 'nutrition', 'emotional', 'resources'] },
  { title: 'Energy Management', path: '/EnergyManagement', description: 'Tips and tracking for managing fatigue', keywords: ['energy', 'fatigue', 'tired', 'pacing', 'rest', 'exhaustion'] },
  { title: 'Emotional Support', path: '/EmotionalSupport', description: 'Coping tools and emotional well-being support', keywords: ['emotional', 'anxiety', 'depression', 'coping', 'mental health', 'stress'] },
  { title: 'Communication Toolkit', path: '/CommunicationToolkit', description: 'Draft emails and scripts for work conversations', keywords: ['communication', 'email', 'draft', 'script', 'disclosure', 'boundaries', 'hr'] },
  { title: 'Legal & Policy Hub', path: '/LegalPolicyHub', description: 'Know your workplace legal rights and policies', keywords: ['legal', 'rights', 'law', 'ada', 'fmla', 'policy', 'protection'] },
  { title: 'Legal Rights Checklist', path: '/LegalRightsChecklist', description: 'Step-by-step checklist for legal and FMLA documents', keywords: ['legal', 'rights', 'checklist', 'fmla', 'documents', 'paperwork'] },
  { title: 'Legal Directory', path: '/LegalDirectory', description: 'Searchable directory of legal rights and accommodations', keywords: ['legal', 'rights', 'directory', 'accommodations', 'ada', 'eeoc'] },
  { title: 'Accommodation Worksheet', path: '/AccommodationWorksheet', description: 'Plan and request workplace accommodations', keywords: ['accommodation', 'worksheet', 'request', 'flexible schedule', 'remote work', 'adjustments'] },
  { title: 'Disclosure Guide', path: '/DisclosureGuide', description: 'Decide what, when, and how to share at work', keywords: ['disclosure', 'telling employer', 'privacy', 'diagnosis', 'share'] },
  { title: 'Meeting Prep', path: '/MeetingPrep', description: 'Prepare for HR and supervisor meetings', keywords: ['meeting', 'prep', 'hr', 'supervisor', 'talking points', 'accommodation request'] },
  { title: 'Resource Library', path: '/ResourceLibrary', description: 'Legal rights and accommodation resources', keywords: ['resources', 'library', 'rights', 'legal', 'guides', 'articles'] },
  { title: 'Community & Resources', path: '/CommunityHub', description: 'Forums, peer connections, and shared resources', keywords: ['community', 'forum', 'peers', 'connections', 'support group', 'messages'] },
  { title: 'Community Guidelines', path: '/CommunityGuidelines', description: 'How the peer forum stays supportive, private, and work-focused', keywords: ['community guidelines', 'forum rules', 'guidelines', 'moderation', 'privacy', 'report a post'] },
  { title: 'Expert Advice & Q&A', path: '/ExpertAdvice', description: 'Tips from experts and answers to survivor questions', keywords: ['expert', 'advice', 'tips', 'professional', 'questions', 'answers', 'ask', 'q&a'] },
  { title: 'Coach Booking', path: '/CoachBooking', description: 'Book a one-on-one coaching session', keywords: ['booking', 'coach', 'session', 'appointment', 'schedule'] },
  { title: 'Record Keeping', path: '/RecordKeeping', description: 'Log medical, workplace, and journal records', keywords: ['records', 'journal', 'medical', 'workplace', 'notes', 'documentation'] },
  { title: 'Help & Support', path: '/HelpSupport', description: 'Get help using the app and find support', keywords: ['help', 'support', 'faq', 'contact'] },
  { title: 'Emergency Contacts', path: '/emergency-contacts', description: 'Crisis hotlines and urgent support services', keywords: ['emergency', 'crisis', 'hotline', 'urgent', '911', 'suicide'] },
  { title: 'Blog', path: '/Blog', description: 'Stories and articles from the founder', keywords: ['blog', 'articles', 'stories', 'posts'] },
  { title: 'FAQ', path: '/FAQ', description: 'Frequently asked questions', keywords: ['faq', 'questions', 'answers', 'how to'] },
  { title: 'For Clinics & Nurse Navigators', path: '/ForClinics', description: 'Free patient referral resources, privacy stance, and 15-minute clinic demo', keywords: ['clinic', 'clinics', 'nurse navigator', 'oncology social worker', 'refer', 'referral', 'handout', 'demo', 'hospital', 'patients'] },
  { title: 'Manager & HR Guide', path: '/ManagerGuide', description: 'How managers and HR can support employees returning after cancer', keywords: ['manager', 'hr', 'supervisor', 'employer', 'supporting employee'] },
  { title: 'Guía para Gerentes y RR. HH. (Español)', path: '/ManagerGuideEs', description: 'Cómo apoyar a un empleado con cáncer y en su regreso al trabajo (ADA y FMLA)', keywords: ['español', 'spanish', 'gerente', 'recursos humanos', 'apoyo', 'cáncer', 'regreso al trabajo'] },
  { title: 'Adaptaciones Laborales ADA (Español)', path: '/AccommodationsEs', description: 'Guía en español y generador de carta de adaptaciones laborales bajo la ADA', keywords: ['español', 'spanish', 'adaptaciones', 'ada', 'carta', 'fatiga', 'quimiocerebro', 'teletrabajo'] },
  { title: 'Guía de Divulgación en el Trabajo (Español)', path: '/DisclosureGuideEs', description: 'Privacidad laboral, derechos y guiones en español para hablar en el trabajo', keywords: ['español', 'spanish', 'divulgación', 'privacidad', 'guiones', 'jefe', 'recursos humanos'] },
  { title: 'Privacy & Security', path: '/PrivacySecurity', description: 'How your data is protected', keywords: ['privacy', 'security', 'data', 'protection'] },
];

export function searchSite(query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const terms = q.split(/\s+/);
  return SEARCH_INDEX
    .map((item) => {
      const haystack = `${item.title} ${item.description} ${item.keywords.join(' ')}`.toLowerCase();
      let score = 0;
      for (const t of terms) {
        if (item.title.toLowerCase().includes(t)) score += 3;
        else if (item.keywords.some((k) => k.includes(t))) score += 2;
        else if (haystack.includes(t)) score += 1;
      }
      return { ...item, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);
}