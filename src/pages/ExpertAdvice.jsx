import React from 'react';
import { Sparkles, MessageCircleQuestion, MessageCircle } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import PageHeader from '@/components/brand/PageHeader';
import useSEO from '@/hooks/useSEO';
import ExpertAdviceLibrary from '@/components/expertadvice/ExpertAdviceLibrary';
import ExpertQASection from '@/components/expertqa/ExpertQASection';
import ForumTab from '@/components/community/ForumTab';

const initialTab = () => {
  const tab = new URLSearchParams(window.location.search).get('tab');
  return tab === 'qa' || tab === 'forum' ? tab : 'tips';
};

export default function ExpertAdvice() {
  useSEO({
    title: 'Expert Advice & Q&A for Cancer Survivors Returning to Work',
    description:
      'Practical return-to-work guidance from oncology social workers, employment attorneys, and clinical psychologists, real survivor questions answered by workplace experts, and peer community discussions.',
    path: '/ExpertAdvice',
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <PageHeader
        eyebrow="Expert advice"
        title="Expert Return-to-Work Advice & Answers"
        subtitle="Practical, evidence-based guidance from oncology social workers, employment attorneys, and clinical psychologists — plus real survivor questions and peer discussions."
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
          <TabsTrigger value="forum" className="nv-tab">
            <MessageCircle className="h-4 w-4" />
            <span>Community Forum</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tips" className="mt-6"><ExpertAdviceLibrary /></TabsContent>
        <TabsContent value="qa" className="mt-6"><ExpertQASection /></TabsContent>
        <TabsContent value="forum" className="mt-6"><ForumTab /></TabsContent>
      </Tabs>
    </div>
  );
}