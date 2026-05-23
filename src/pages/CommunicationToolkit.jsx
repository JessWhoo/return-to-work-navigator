import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Mail, Users } from 'lucide-react';
import Communication from './Communication';
import EmployerEmailGenerator from './EmployerEmailGenerator';
import MeetingPrep from './MeetingPrep';

export default function CommunicationToolkit() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 bg-clip-text text-transparent drop-shadow-sm">
          Communication Toolkit
        </h1>
        <p className="text-lg font-medium text-slate-800">Templates, AI email drafting, and meeting preparation</p>
      </div>

      <Tabs defaultValue="templates" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 border border-slate-700">
          <TabsTrigger value="templates" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white text-slate-300">
            <FileText className="h-4 w-4 mr-2" />
            Templates & Scripts
          </TabsTrigger>
          <TabsTrigger value="email" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white text-slate-300">
            <Mail className="h-4 w-4 mr-2" />
            Email Generator
          </TabsTrigger>
          <TabsTrigger value="meeting" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white text-slate-300">
            <Users className="h-4 w-4 mr-2" />
            Meeting Prep
          </TabsTrigger>
        </TabsList>

        <TabsContent value="templates">
          <Communication />
        </TabsContent>
        <TabsContent value="email">
          <EmployerEmailGenerator />
        </TabsContent>
        <TabsContent value="meeting">
          <MeetingPrep />
        </TabsContent>
      </Tabs>
    </div>
  );
}