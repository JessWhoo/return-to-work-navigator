import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Users, FileText, Bookmark, Heart, MessageCircle, MessageCircleQuestion, ArrowRight } from 'lucide-react';
import ForumTab from '../components/community/ForumTab';
import ProgressReportTab from '../components/community/ProgressReportTab';
import SharedResourcesTab from '../components/community/SharedResourcesTab';
import PeerConnectionsTab from '../components/community/PeerConnectionsTab';
import MessagesTab from '../components/community/MessagesTab';
import useSEO from '@/hooks/useSEO';

export default function CommunityHub() {
  useSEO({
    title: 'Community Hub',
    description: 'Connect with peers, share your story, and build strength together with fellow cancer survivors returning to work.',
    path: '/CommunityHub'
  });
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-teal-700 via-cyan-700 to-sky-700 bg-clip-text text-transparent drop-shadow-sm">
          Community Hub
        </h1>
        <p className="text-lg font-medium text-slate-800 max-w-xl mx-auto">
          You're not alone on this journey. Connect with peers, share your story, and find strength together.
        </p>
      </div>

      <Link
        to="/ExpertQA"
        className="block rounded-2xl bg-gradient-to-r from-violet-600 via-rose-500 to-amber-500 p-5 text-white shadow-lg hover:shadow-xl transition-shadow"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="bg-white/25 backdrop-blur p-2.5 rounded-xl flex-shrink-0">
              <MessageCircleQuestion className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <p className="font-extrabold text-lg leading-tight">Ask the Experts</p>
              <p className="text-sm text-white/90 leading-tight">
                Answers from attorneys and oncology pros on fatigue, rights, and more.
              </p>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 flex-shrink-0" />
        </div>
      </Link>

      <Tabs defaultValue="forum">
        <TabsList className="grid grid-cols-5 bg-slate-800 border border-slate-600 w-full">
          <TabsTrigger value="forum" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white text-slate-300 flex gap-1 items-center text-xs sm:text-sm">
            <Users className="h-4 w-4" /><span className="hidden sm:inline">Forum</span>
          </TabsTrigger>
          <TabsTrigger value="peers" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white text-slate-300 flex gap-1 items-center text-xs sm:text-sm">
            <Heart className="h-4 w-4" /><span className="hidden sm:inline">Peers</span>
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
        <TabsContent value="report"><ProgressReportTab /></TabsContent>
        <TabsContent value="resources"><SharedResourcesTab /></TabsContent>
        <TabsContent value="messages"><MessagesTab /></TabsContent>
      </Tabs>
    </div>
  );
}