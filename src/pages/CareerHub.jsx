import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Search, Sparkles } from 'lucide-react';
import ReturnPlanning from './ReturnPlanning';
import JobBoards from './JobBoards';
import ApplyIQ from '@/components/career/ApplyIQ';
import PageHeader from '@/components/brand/PageHeader';

export default function CareerHub() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <PageHeader
        eyebrow="Career"
        title="Career & Return Planning"
        subtitle="Plan your return to work and explore career opportunities"
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
          <ReturnPlanning />
        </TabsContent>
        <TabsContent value="jobs">
          <JobBoards />
        </TabsContent>
        <TabsContent value="applyiq">
          <ApplyIQ />
        </TabsContent>
      </Tabs>
    </div>
  );
}