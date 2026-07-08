import React from 'react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Mail, Users, ShieldCheck, ArrowRight, Printer } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
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

      <Link to="/DisclosureGuide" className="block">
        <Card className="bg-gradient-to-r from-rose-100 via-violet-100 to-sky-100 border-2 border-rose-300 hover:border-rose-500 shadow-md hover:shadow-xl transition-all">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-rose-500 to-violet-600 shadow-lg flex-shrink-0">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-extrabold uppercase tracking-wider text-rose-700">New guide</p>
              <h3 className="text-lg font-extrabold text-slate-900">Telling Your Employer About Your Diagnosis</h3>
              <p className="text-sm font-medium text-slate-700">Step-by-step checklist to feel confident and protected by disability laws.</p>
            </div>
            <ArrowRight className="h-5 w-5 text-rose-600 flex-shrink-0" />
          </CardContent>
        </Card>
      </Link>

      <Link to="/AccommodationWorksheet" className="block">
        <Card className="bg-gradient-to-r from-violet-100 via-purple-100 to-emerald-100 border-2 border-violet-300 hover:border-violet-500 shadow-md hover:shadow-xl transition-all">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-violet-500 to-emerald-600 shadow-lg flex-shrink-0">
              <Printer className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-extrabold uppercase tracking-wider text-violet-700">Printable worksheet</p>
              <h3 className="text-lg font-extrabold text-slate-900">Accommodation Meeting Worksheet</h3>
              <p className="text-sm font-medium text-slate-700">Fill in your goals and requests, then download a clean PDF to bring to your meeting.</p>
            </div>
            <ArrowRight className="h-5 w-5 text-violet-600 flex-shrink-0" />
          </CardContent>
        </Card>
      </Link>

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