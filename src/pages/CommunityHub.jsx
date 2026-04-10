import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Users, FileText, Bookmark } from 'lucide-react';
import ForumTab from '../components/community/ForumTab';
import ProgressReportTab from '../components/community/ProgressReportTab';
import SharedResourcesTab from '../components/community/SharedResourcesTab';

export default function CommunityHub() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
          Community Hub
        </h1>
        <p className="text-slate-300 max-w-xl mx-auto">
          Connect with peers, share your journey, and access community wisdom.
        </p>
      </div>

      <Tabs defaultValue="forum">
        <TabsList className="grid grid-cols-3 bg-slate-800 border border-slate-600 w-full">
          <TabsTrigger value="forum" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white text-slate-300 flex gap-2 items-center">
            <Users className="h-4 w-4" /> Forum
          </TabsTrigger>
          <TabsTrigger value="report" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white text-slate-300 flex gap-2 items-center">
            <FileText className="h-4 w-4" /> Progress Report
          </TabsTrigger>
          <TabsTrigger value="resources" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white text-slate-300 flex gap-2 items-center">
            <Bookmark className="h-4 w-4" /> Share Resources
          </TabsTrigger>
        </TabsList>

        <TabsContent value="forum"><ForumTab /></TabsContent>
        <TabsContent value="report"><ProgressReportTab /></TabsContent>
        <TabsContent value="resources"><SharedResourcesTab /></TabsContent>
      </Tabs>
    </div>
  );
}