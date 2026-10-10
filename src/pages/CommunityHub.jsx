import React from 'react';
import { Link } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { FileText, Bookmark, MessageCircleQuestion, ArrowRight, Sparkles } from 'lucide-react';
import ProgressReportTab from '../components/community/ProgressReportTab';
import SharedResourcesTab from '../components/community/SharedResourcesTab';
import useSEO from '@/hooks/useSEO';
import PageHeader from '@/components/brand/PageHeader';

const EXPERT_LINKS = [
  {
    to: '/ExpertAdvice',
    icon: Sparkles,
    eyebrow: 'Guidance',
    title: 'Expert Advice',
    text: 'Professional tips on workplace adjustments, emotional readiness, and career conversations.',
  },
  {
    to: '/ExpertQA',
    icon: MessageCircleQuestion,
    eyebrow: 'Ask the experts',
    title: 'Ask the Experts',
    text: 'Answers from attorneys and oncology pros on fatigue, rights, and more.',
  },
];

export default function CommunityHub() {
  useSEO({
    title: 'Community Hub',
    description: 'Connect with peers, share your story, and build strength together with fellow cancer survivors returning to work.',
    path: '/CommunityHub'
  });
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <PageHeader
        center
        eyebrow="Community"
        title="Community Hub"
        subtitle="You're not alone on this journey. Connect with peers, share your story, and find strength together."
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {EXPERT_LINKS.map(({ to, icon: Icon, eyebrow, title, text }) => (
          <Link key={to} to={to} className="nv-resource">
            <div className="nv-media" />
            <div className="nv-body">
              <span className="nv-eyebrow nv-eyebrow--primary">{eyebrow}</span>
              <h3>{title}</h3>
              <p>{text}</p>
              <span className="nv-meta flex items-center gap-1.5 font-semibold text-brand-primary">
                <Icon className="h-4 w-4" />
                Open
                <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </Link>
        ))}
      </div>

      <Tabs defaultValue="report">
        <TabsList className="nv-tabs h-auto">
          <TabsTrigger value="report" className="nv-tab">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Progress</span>
          </TabsTrigger>
          <TabsTrigger value="resources" className="nv-tab">
            <Bookmark className="h-4 w-4" />
            <span className="hidden sm:inline">Resources</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="report"><ProgressReportTab /></TabsContent>
        <TabsContent value="resources"><SharedResourcesTab /></TabsContent>
      </Tabs>
    </div>
  );
}