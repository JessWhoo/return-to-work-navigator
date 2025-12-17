import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ChevronDown, ChevronRight, HelpCircle, Search, 
  Briefcase, Shield, Heart, Zap, FileText, Calendar
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';

const faqData = [
  {
    category: 'Getting Started',
    icon: HelpCircle,
    color: 'from-teal-500 to-cyan-500',
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
    color: 'from-green-500 to-emerald-500',
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
    color: 'from-amber-500 to-orange-500',
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
    color: 'from-blue-500 to-indigo-500',
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
    color: 'from-purple-500 to-violet-500',
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
    color: 'from-pink-500 to-rose-500',
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
    color: 'from-indigo-500 to-blue-500',
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
        q: 'What are the Achievements for?',
        a: 'The gamification system rewards your progress with points, badges, and levels. It\'s designed to motivate and celebrate your journey milestones. Earn points by completing checklist items, logging energy, and engaging with resources.'
      }
    ]
  }
];

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState([0]);
  const [expandedQuestions, setExpandedQuestions] = useState([]);

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
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="inline-block"
        >
          <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center mx-auto shadow-lg">
            <HelpCircle className="h-10 w-10 text-white" />
          </div>
        </motion.div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
          Frequently Asked Questions
        </h1>
        <p className="text-lg text-slate-300 max-w-2xl mx-auto">
          Find answers to common questions about returning to work after cancer treatment
        </p>
      </div>

      {/* Search */}
      <Card className="bg-white/80 backdrop-blur-sm border-2 border-teal-200">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-base"
            />
          </div>
        </CardContent>
      </Card>

      {/* FAQ Categories */}
      <div className="space-y-4">
        {filteredFAQ.length === 0 ? (
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="pt-6 text-center">
              <p className="text-gray-500">No results found for "{searchQuery}"</p>
            </CardContent>
          </Card>
        ) : (
          filteredFAQ.map((category, categoryIndex) => {
            const actualIndex = faqData.findIndex(c => c.category === category.category);
            const isExpanded = expandedCategories.includes(actualIndex);
            const Icon = category.icon;

            return (
              <Card
                key={actualIndex}
                className="bg-white/80 backdrop-blur-sm border-2 hover:shadow-lg transition-all overflow-hidden"
              >
                <CardHeader
                  className="cursor-pointer hover:bg-gray-50/50 transition-colors"
                  onClick={() => toggleCategory(actualIndex)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {isExpanded ? (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-gray-500" />
                      )}
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${category.color}`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <CardTitle className="text-xl text-gray-800">
                        {category.category}
                      </CardTitle>
                    </div>
                    <Badge variant="secondary" className="bg-gray-100">
                      {category.questions.length}
                    </Badge>
                  </div>
                </CardHeader>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CardContent className="space-y-3 pt-0">
                        {category.questions.map((question, questionIndex) => {
                          const key = `${actualIndex}-${questionIndex}`;
                          const isQuestionExpanded = expandedQuestions.includes(key);

                          return (
                            <div
                              key={questionIndex}
                              className="border-l-4 border-gray-200 hover:border-teal-400 transition-colors"
                            >
                              <button
                                onClick={() => toggleQuestion(actualIndex, questionIndex)}
                                className="w-full text-left p-4 hover:bg-gray-50 transition-colors rounded-r-lg"
                              >
                                <div className="flex items-start justify-between">
                                  <h4 className="font-semibold text-gray-800 pr-4">
                                    {question.q}
                                  </h4>
                                  {isQuestionExpanded ? (
                                    <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                                  ) : (
                                    <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                                  )}
                                </div>
                              </button>

                              <AnimatePresence>
                                {isQuestionExpanded && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                  >
                                    <div className="px-4 pb-4 text-gray-600 leading-relaxed">
                                      {question.a}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        })}
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            );
          })
        )}
      </div>

      {/* Help Section */}
      <Card className="bg-gradient-to-br from-teal-50 to-cyan-50 border-2 border-teal-200">
        <CardContent className="pt-6 text-center space-y-3">
          <Heart className="h-12 w-12 text-teal-600 mx-auto" />
          <h3 className="text-xl font-bold text-gray-800">Still Have Questions?</h3>
          <p className="text-gray-700">
            Can't find what you're looking for? Explore our Resources section for additional support,
            or consult with your healthcare team and legal counsel for personalized guidance.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}