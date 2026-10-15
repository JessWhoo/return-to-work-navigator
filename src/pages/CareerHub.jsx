import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Search, Sparkles } from 'lucide-react';
import ReturnPlanning from './ReturnPlanning';
import JobBoards from './JobBoards';
import ApplyIQ from '@/components/career/ApplyIQ';
import PageHeader from '@/components/brand/PageHeader';
import useSEO from '@/hooks/useSEO';

export default function CareerHub() {
  useSEO({
    title: 'Phased Return-to-Work Planner & Survivor Career Hub',
    description:
      'Build a phased return-to-work schedule, explore disability-inclusive and remote job boards, and analyze resumes and job postings after a medical career break.',
    path: '/CareerHub',
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <PageHeader
        eyebrow="Career"
        title="Career & Phased Return-to-Work Planning Hub"
        subtitle="Build a week-by-week return schedule, browse flexible job boards, and prepare applications after cancer treatment."
      />

      <Tabs defaultValue="planning" className="space-y-6">
        <TabsList className="nv-tabs h-auto">
          <TabsTrigger value="planning" className="nv-tab">
            <Calendar className="h-4 w-4" />
            Return Planning
          </TabsTrigger>
          <TabsTrigger value="jobs" className="nv-tab">
            <Search className="h-4 w-4" />
            Job Boards
          </TabsTrigger>
          <TabsTrigger value="applyiq" className="nv-tab">
            <Sparkles className="h-4 w-4" />
            ApplyIQ
          </TabsTrigger>
        </TabsList>

        <TabsContent value="planning">
          <ReturnPlanning embedded />
        </TabsContent>
        <TabsContent value="jobs">
          <JobBoards embedded />
        </TabsContent>
        <TabsContent value="applyiq">
          <ApplyIQ />
        </TabsContent>
      </Tabs>
    </div>
  );
}