import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import FAQCategoryHeader from '@/components/support/FAQCategoryHeader';
import useSEO from '@/hooks/useSEO';
import PageHeader from '@/components/brand/PageHeader';
import { 
  ChevronDown, ChevronRight, HelpCircle, Search, 
  Briefcase, Shield, Heart, Zap, FileText, Calendar
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';

const faqData = [
  {
    category: 'Getting Started',
    icon: HelpCircle,
    questions: [
      {
        q: 'How do I start planning my return to work?',
        a: 'Begin with the "My Checklist" section to track your progress through each phase. Set your return date in "Return Planning" and consult with your healthcare team about your readiness. The toolkit will guide you through medical, legal, and practical considerations.'
      },
      {
        q: 'What should I do first when using this toolkit?',
        a: 'Start by completing your profile and setting your return date. Then review your legal rights under ADA and FMLA, assess what accommodations you might need, and begin tracking your energy levels. The onboarding tutorial can guide you through the key features.'
      },
      {
        q: 'Is this toolkit a substitute for medical or legal advice?',
        a: 'No, this toolkit provides educational information and resources but is not a substitute for professional medical or legal advice. Always consult with your healthcare team and legal counsel for your specific situation.'
      }
    ]
  },
  {
    category: 'Legal Rights & Accommodations',
    icon: Shield,
    questions: [
      {
        q: 'What is the Americans with Disabilities Act (ADA)?',
        a: 'The ADA is a federal law that prohibits discrimination against individuals with disabilities and requires employers to provide reasonable accommodations. Cancer survivors are protected under the ADA if their condition substantially limits a major life activity.'
      },
      {
        q: 'What accommodations can I request?',
        a: 'Common accommodations include flexible work schedules, reduced hours, work-from-home options, modified duties, frequent breaks, ergonomic equipment, and adjusted deadlines. Your specific needs will depend on your condition and treatment effects.'
      },
      {
        q: 'How do I request accommodations from my employer?',
        a: 'Use our "Request Accommodations" tool to generate a professional letter. Include medical documentation from your healthcare provider, be specific about your needs, and propose solutions. You don\'t need to disclose your full medical history.'
      },
      {
        q: 'What is FMLA and am I eligible?',
        a: 'The Family and Medical Leave Act (FMLA) provides up to 12 weeks of unpaid, job-protected leave per year. You\'re eligible if you\'ve worked for your employer for at least 12 months and 1,250 hours, and your employer has 50+ employees within 75 miles.'
      },
      {
        q: 'Can my employer fire me because of my cancer diagnosis?',
        a: 'No. The ADA prohibits discrimination based on disability, including cancer. If you can perform the essential functions of your job with or without reasonable accommodations, you are protected. Document everything and consult an employment attorney if you experience discrimination.'
      }
    ]
  },
  {
    category: 'Managing Energy & Fatigue',
    icon: Zap,
    questions: [
      {
        q: 'How do I manage cancer-related fatigue at work?',
        a: 'Use the "Energy & Fatigue" section to track your energy patterns. Practice pacing strategies, take regular breaks, prioritize tasks during your high-energy times, and consider a gradual return-to-work schedule. Stay hydrated and maintain good nutrition.'
      },
      {
        q: 'What is pacing and how does it help?',
        a: 'Pacing means breaking activities into smaller chunks with rest periods in between. It helps conserve energy and prevent exhaustion. Track your energy levels to identify your best times for demanding tasks and schedule rest periods proactively.'
      },
      {
        q: 'Should I work full-time or part-time when I return?',
        a: 'This depends on your energy levels, medical recommendations, and financial situation. Many survivors benefit from a gradual return, starting part-time and increasing hours as they adjust. Use our "Return Planning" tool to create a phased schedule.'
      }
    ]
  },
  {
    category: 'Communication',
    icon: FileText,
    questions: [
      {
        q: 'How much should I tell my employer about my cancer?',
        a: 'You control how much you disclose. For accommodation requests, you need to provide enough information to show you have a disability and need accommodation, but you don\'t need to share your full medical history. Use our communication templates for guidance.'
      },
      {
        q: 'What should I tell my coworkers?',
        a: 'This is entirely your choice. You can share as much or as little as you\'re comfortable with. Prepare responses for questions in advance. The "Communication Tools" section has scripts to help you navigate these conversations.'
      },
      {
        q: 'How do I address performance concerns with my supervisor?',
        a: 'Be proactive and honest about any limitations. Request a meeting to discuss accommodations and timeline. Document everything in writing. Use our email templates to communicate professionally about your needs and capabilities.'
      }
    ]
  },
  {
    category: 'Planning & Timeline',
    icon: Calendar,
    questions: [
      {
        q: 'When is the right time to return to work?',
        a: 'There\'s no one-size-fits-all answer. Consult with your healthcare team, consider your energy levels, financial needs, and job demands. Some return during treatment, others wait until after. The "Return Planning" section can help you evaluate your readiness.'
      },
      {
        q: 'What is a phased return-to-work plan?',
        a: 'A phased return involves gradually increasing your work hours or responsibilities over time. For example, starting at 4 hours/day for 2 weeks, then 6 hours/day, then full-time. This helps you adjust physically and emotionally while maintaining job protections.'
      },
      {
        q: 'What if I need more time off after I\'ve returned?',
        a: 'You may be eligible for additional FMLA leave, short-term disability, or unpaid leave depending on your situation. Communicate with your employer early and provide medical documentation. Keep detailed records of all communications.'
      }
    ]
  },
  {
    category: 'Emotional & Mental Health',
    icon: Heart,
    questions: [
      {
        q: 'I\'m anxious about returning to work. Is this normal?',
        a: 'Absolutely. Anxiety about returning is very common among cancer survivors. Use the "Emotional Support" resources, consider speaking with a therapist, practice stress-reduction techniques, and connect with other survivors who\'ve been through this transition.'
      },
      {
        q: 'What if my cognitive abilities have changed?',
        a: 'Many survivors experience "chemo brain" or cognitive changes. Request accommodations like written instructions, frequent breaks, or reduced multitasking. These changes often improve over time. Discuss strategies with your healthcare team.'
      },
      {
        q: 'How do I deal with coworkers who don\'t understand?',
        a: 'Set boundaries about what you will and won\'t discuss. Prepare brief responses to common questions. If someone is insensitive, you can address it directly or through HR. Focus on supportive relationships and use the wellness resources for coping strategies.'
      }
    ]
  },
  {
    category: 'Using This Toolkit',
    icon: Briefcase,
    questions: [
      {
        q: 'How do I track my progress?',
        a: 'Use the "Progress Dashboard" to see your overall journey. Complete items in "My Checklist," log your energy levels, and track accommodations. Your progress is automatically saved and visualized in the dashboard.'
      },
      {
        q: 'Can I print or share resources from this toolkit?',
        a: 'Yes! Many sections include download or print options. You can export your accommodation requests, download resources, and save templates. Use the share features in the Progress Dashboard to send reports to your healthcare team.'
      },
      {
        q: 'How often should I update my information?',
        a: 'Update your energy logs daily or weekly, track checklist progress regularly, and adjust your accommodation needs as they change. The more you engage with the toolkit, the more useful it becomes for your journey.'
      },
      {
        q: 'How does the Return-to-Work Checklist work?',
        a: 'Your checklist breaks preparation into four clear stages: Before You Return, Planning Your Return, First Weeks Back, and Ongoing Success. You can check off items at your own pace—without points, timers, or streaks—and export your summary whenever you need it.'
      }
    ]
  }
];

export default function FAQ({ embedded = false }) {
  useSEO({
    title: 'Frequently Asked Questions: Returning to Work After Cancer',
    description:
      'Clear answers to common questions about returning to work after cancer treatment: diagnosis disclosure, ADA accommodations, FMLA leave, fatigue, and privacy.',
    path: '/FAQ',
    enabled: !embedded,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState(() => faqData.map((_, i) => i));
  const [expandedQuestions, setExpandedQuestions] = useState(() =>
    faqData.flatMap((cat, cIdx) => cat.questions.map((_, qIdx) => `${cIdx}-${qIdx}`))
  );

  const toggleCategory = (index) => {
    setExpandedCategories(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const toggleQuestion = (categoryIndex, questionIndex) => {
    const key = `${categoryIndex}-${questionIndex}`;
    setExpandedQuestions(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const filteredFAQ = faqData.map(category => ({
    ...category,
    questions: category.questions.filter(
      q =>
        q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.a.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <PageHeader center={!embedded} headingLevel={embedded ? 'h2' : 'h1'} title="Frequently Asked Questions About Returning to Work After Cancer" subtitle="Find answers to common questions about disclosure, ADA accommodations, fatigue, and returning to work after cancer treatment" />
      <Card>
        <CardContent className="pt-6"><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-brand-muted-foreground" aria-hidden="true" /><Input aria-label="Search frequently asked questions" placeholder="Search for answers..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 h-12 text-base" /></div></CardContent>
      </Card>
      <div className="space-y-4">
        {filteredFAQ.length === 0 ? <Card><CardContent className="pt-6 text-center"><p className="text-brand-muted-foreground">No results found for "{searchQuery}"</p></CardContent></Card> : filteredFAQ.map(category => {
          const actualIndex = faqData.findIndex(c => c.category === category.category);
          const isExpanded = expandedCategories.includes(actualIndex);
          return (
            <Card key={actualIndex} className="overflow-hidden">
              <FAQCategoryHeader category={category} expanded={isExpanded} onToggle={() => toggleCategory(actualIndex)} contentId={`faq-category-${actualIndex}`} />
              <CardContent id={`faq-category-${actualIndex}`} className={isExpanded ? 'space-y-3 px-5 pb-5 pt-0 sm:px-6 sm:pb-6' : 'sr-only'}>
                {category.questions.map((question, questionIndex) => {
                  const key = `${actualIndex}-${questionIndex}`;
                  const isQuestionExpanded = expandedQuestions.includes(key);
                  return (
                    <div key={questionIndex} className="border-l-4 border-brand-border">
                      <button onClick={() => toggleQuestion(actualIndex, questionIndex)} aria-expanded={isQuestionExpanded} className="w-full text-left p-4 text-brand-text rounded-r-brand hover:bg-brand-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
                        <div className="flex items-start justify-between gap-3"><span className="font-body font-semibold">{question.q}</span>{isQuestionExpanded ? <ChevronDown className="h-5 w-5 text-brand-primary shrink-0 mt-0.5" /> : <ChevronRight className="h-5 w-5 text-brand-primary shrink-0 mt-0.5" />}</div>
                      </button>
                      <div className={isQuestionExpanded ? 'px-4 pb-4 text-brand-muted-foreground' : 'sr-only'}>{question.a}</div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          );
        })}
      </div>
      <Card className="nv-card--sage"><CardContent className="pt-6 text-center space-y-3"><Heart className="h-12 w-12 text-brand-primary mx-auto" /><h3 className="text-xl font-bold text-brand-text">Still Have Questions?</h3><p className="text-brand-muted-foreground">Can't find what you're looking for? Explore our Resources section for additional support, or consult with your healthcare team and legal counsel for personalized guidance.</p></CardContent></Card>
    </div>
  );
}