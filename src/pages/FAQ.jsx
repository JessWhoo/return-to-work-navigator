import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import FAQCategoryHeader from '@/components/support/FAQCategoryHeader';
import useSEO from '@/hooks/useSEO';
import PageHeader from '@/components/brand/PageHeader';
import { ChevronDown, ChevronRight, Search, Heart } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { FAQ_PAGE_FAQ_CATEGORIES } from '@/components/seo/faqPageData';

const faqData = FAQ_PAGE_FAQ_CATEGORIES;

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