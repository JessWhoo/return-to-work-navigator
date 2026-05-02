import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Users, FileText, Bookmark, Heart, GraduationCap, MessageCircle } from 'lucide-react';
import ForumTab from '../components/community/ForumTab';
import ProgressReportTab from '../components/community/ProgressReportTab';
import SharedResourcesTab from '../components/community/SharedResourcesTab';
import PeerConnectionsTab from '../components/community/PeerConnectionsTab';
import MentorshipTab from '../components/community/MentorshipTab';
import MessagesTab from '../components/community/MessagesTab';

export default function CommunityHub() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
          Community Hub
        </h1>
        <p className="text-slate-300 max-w-xl mx-auto">
          You're not alone on this journey. Connect with peers, share your story, and find strength together.
        </p>
      </div>

      <Tabs defaultValue="forum">
        <TabsList className="grid grid-cols-6 bg-slate-800 border border-slate-600 w-full">
          <TabsTrigger value="forum" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white text-slate-300 flex gap-1 items-center text-xs sm:text-sm">
            <Users className="h-4 w-4" /><span className="hidden sm:inline">Forum</span>
          </TabsTrigger>
          <TabsTrigger value="peers" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white text-slate-300 flex gap-1 items-center text-xs sm:text-sm">
            <Heart className="h-4 w-4" /><span className="hidden sm:inline">Peers</span>
          </TabsTrigger>
          <TabsTrigger value="mentorship" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-slate-300 flex gap-1 items-center text-xs sm:text-sm">
            <GraduationCap className="h-4 w-4" /><span className="hidden sm:inline">Mentorship</span>
          </TabsTrigger>
          <TabsTrigger value="report" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white text-slate-300 flex gap-1 items-center text-xs sm:text-sm">
            <FileText className="h-4 w-4" /><span className="hidden sm:inline">Progress</span>
          </TabsTrigger>
          <TabsTrigger value="resources" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white text-slate-300 flex gap-1 items-center text-xs sm:text-sm">
            <Bookmark className="h-4 w-4" /><span className="hidden sm:inline">Resources</span>
          </TabsTrigger>
          <TabsTrigger value="messages" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white text-slate-300 flex gap-1 items-center text-xs sm:text-sm">
            <MessageCircle className="h-4 w-4" /><span className="hidden sm:inline">Messages</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="forum"><ForumTab /></TabsContent>
        <TabsContent value="peers"><PeerConnectionsTab /></TabsContent>
        <TabsContent value="mentorship"><MentorshipTab /></TabsContent>
        <TabsContent value="report"><ProgressReportTab /></TabsContent>
        <TabsContent value="resources"><SharedResourcesTab /></TabsContent>
        <TabsContent value="messages"><MessagesTab /></TabsContent>
      </Tabs>
    </div>
  );
}