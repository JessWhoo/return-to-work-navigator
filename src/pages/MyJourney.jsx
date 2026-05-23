import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, TrendingUp, CheckSquare } from 'lucide-react';
import Profile from './Profile';
import ProgressDashboard from './ProgressDashboard';
import Checklist from './Checklist';
import useSEO from '@/hooks/useSEO';

export default function MyJourney() {
  useSEO({
    title: 'My Journey',
    description: 'Track your return-to-work progress, complete your checklist, and manage your profile — all in one place.',
    path: '/MyJourney'
  });
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-teal-700 via-cyan-700 to-sky-700 bg-clip-text text-transparent drop-shadow-sm">
          My Journey
        </h1>
        <p className="text-lg font-medium text-slate-800">Your profile, progress, and checklist all in one place</p>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-white/90 backdrop-blur-sm border-2 border-slate-300 shadow-sm p-1.5 h-auto">
          <TabsTrigger value="dashboard" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md text-slate-800 font-semibold text-sm sm:text-base py-2.5">
            <TrendingUp className="h-4 w-4 mr-2" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="checklist" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white data-[state=active]:shadow-md text-slate-800 font-semibold text-sm sm:text-base py-2.5">
            <CheckSquare className="h-4 w-4 mr-2" />
            Checklist
          </TabsTrigger>
          <TabsTrigger value="profile" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-md text-slate-800 font-semibold text-sm sm:text-base py-2.5">
            <User className="h-4 w-4 mr-2" />
            My Profile
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <ProgressDashboard />
        </TabsContent>
        <TabsContent value="checklist">
          <Checklist />
        </TabsContent>
        <TabsContent value="profile">
          <Profile />
        </TabsContent>
      </Tabs>
    </div>
  );
}