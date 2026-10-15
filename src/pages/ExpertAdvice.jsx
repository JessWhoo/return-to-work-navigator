import React from 'react';
import { Sparkles, MessageCircleQuestion } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import PageHeader from '@/components/brand/PageHeader';
import useSEO from '@/hooks/useSEO';
import ExpertAdviceLibrary from '@/components/expertadvice/ExpertAdviceLibrary';
import ExpertQASection from '@/components/expertqa/ExpertQASection';

const initialTab = () => {
  const tab = new URLSearchParams(window.location.search).get('tab');
  return tab === 'qa' ? 'qa' : 'tips';
};

export default function ExpertAdvice() {
  useSEO({
    title: 'Expert Advice & Q&A for Cancer Survivors Returning to Work',
    description:
      'Practical return-to-work guidance from oncology social workers, employment attorneys, and clinical psychologists, plus real survivor questions answered by workplace experts.',
    path: '/ExpertAdvice',
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <PageHeader
        eyebrow="Expert advice"
        title="Expert Return-to-Work Advice & Answers"
        subtitle="Practical, evidence-based guidance from oncology social workers, employment attorneys, and clinical psychologists — plus real survivor questions answered by the experts."
      />

      <Tabs defaultValue={initialTab()}>
        <TabsList aria-label="Expert guidance" className="nv-tabs h-auto">
          <TabsTrigger value="tips" className="nv-tab">
            <Sparkles className="h-4 w-4" />
            <span>Expert Tips</span>
          </TabsTrigger>
          <TabsTrigger value="qa" className="nv-tab">
            <MessageCircleQuestion className="h-4 w-4" />
            <span>Ask the Experts</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tips" className="mt-6"><ExpertAdviceLibrary /></TabsContent>
        <TabsContent value="qa" className="mt-6"><ExpertQASection /></TabsContent>
      </Tabs>
    </div>
  );
}