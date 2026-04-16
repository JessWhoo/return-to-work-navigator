import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, TrendingUp, CheckSquare } from 'lucide-react';
import Profile from './Profile';
import ProgressDashboard from './ProgressDashboard';
import Checklist from './Checklist';

export default function MyJourney() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
          My Journey
        </h1>
        <p className="text-lg text-slate-300">Your profile, progress, and checklist all in one place</p>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 border border-slate-700">
          <TabsTrigger value="dashboard" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white text-slate-300">
            <TrendingUp className="h-4 w-4 mr-2" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="checklist" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white text-slate-300">
            <CheckSquare className="h-4 w-4 mr-2" />
            Checklist
          </TabsTrigger>
          <TabsTrigger value="profile" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white text-slate-300">
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