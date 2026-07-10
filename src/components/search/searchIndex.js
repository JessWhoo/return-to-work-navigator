// Global search index: every major page/tool with keywords for matching.
export const SEARCH_INDEX = [
  { title: 'Home', path: '/', description: 'Your dashboard and starting point', keywords: ['dashboard', 'start', 'overview', 'home'] },
  { title: 'AI Coach', path: '/Coach', description: 'Chat with your return-to-work AI coach', keywords: ['coach', 'chat', 'advice', 'ai', 'questions', 'support'] },
  { title: 'My Journey', path: '/MyJourney', description: 'Track your return-to-work progress', keywords: ['journey', 'progress', 'tracking', 'milestones', 'energy log'] },
  { title: 'Career & Return', path: '/CareerHub', description: 'Return planning, job boards, and career tools', keywords: ['career', 'return to work', 'job', 'resume', 'planning'] },
  { title: 'Health & Well-Being', path: '/WellbeingHub', description: 'Energy, symptoms, and emotional support tools', keywords: ['health', 'wellbeing', 'fatigue', 'energy', 'symptoms', 'mood', 'stress'] },
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
  { title: 'Expert Advice', path: '/ExpertAdvice', description: 'Tips from workplace and cancer-care experts', keywords: ['expert', 'advice', 'tips', 'professional'] },
  { title: 'Expert Q&A', path: '/ExpertQA', description: 'Ask experts your return-to-work questions', keywords: ['expert', 'questions', 'answers', 'ask', 'q&a'] },
  { title: 'Coach Booking', path: '/CoachBooking', description: 'Book a one-on-one coaching session', keywords: ['booking', 'coach', 'session', 'appointment', 'schedule'] },
  { title: 'Record Keeping', path: '/RecordKeeping', description: 'Log medical, workplace, and symptom records', keywords: ['records', 'journal', 'medical', 'symptoms', 'notes', 'documentation'] },
  { title: 'Help & Support', path: '/HelpSupport', description: 'Get help using the app and find support', keywords: ['help', 'support', 'faq', 'contact'] },
  { title: 'Emergency Contacts', path: '/emergency-contacts', description: 'Crisis hotlines and urgent support services', keywords: ['emergency', 'crisis', 'hotline', 'urgent', '911', 'suicide'] },
  { title: 'Blog', path: '/Blog', description: 'Stories and articles from the founder', keywords: ['blog', 'articles', 'stories', 'posts'] },
  { title: 'FAQ', path: '/FAQ', description: 'Frequently asked questions', keywords: ['faq', 'questions', 'answers', 'how to'] },
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