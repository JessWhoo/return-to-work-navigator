import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Search } from 'lucide-react';
import ReturnPlanning from './ReturnPlanning';
import JobBoards from './JobBoards';

export default function CareerHub() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">
          Career & Return Planning
        </h1>
        <p className="text-lg text-slate-300">Plan your return to work and explore career opportunities</p>
      </div>

      <Tabs defaultValue="planning" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-slate-800/50 border border-slate-700">
          <TabsTrigger value="planning" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white text-slate-300">
            <Calendar className="h-4 w-4 mr-2" />
            Return Planning
          </TabsTrigger>
          <TabsTrigger value="jobs" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white text-slate-300">
            <Search className="h-4 w-4 mr-2" />
            Job Boards
          </TabsTrigger>
        </TabsList>

        <TabsContent value="planning">
          <ReturnPlanning />
        </TabsContent>
        <TabsContent value="jobs">
          <JobBoards />
        </TabsContent>
      </Tabs>
    </div>
  );
}