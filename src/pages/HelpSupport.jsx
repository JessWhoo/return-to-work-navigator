import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HelpCircle, FileDown } from 'lucide-react';
import FAQ from './FAQ';
import ExportReports from './ExportReports';

export default function HelpSupport() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-teal-700 via-cyan-700 to-sky-700 bg-clip-text text-transparent drop-shadow-sm">
          Help & Support
        </h1>
        <p className="text-lg font-medium text-slate-800">Frequently asked questions and export your data</p>
      </div>

      <Tabs defaultValue="faq" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-slate-800/50 border border-slate-700">
          <TabsTrigger value="faq" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white text-slate-300">
            <HelpCircle className="h-4 w-4 mr-2" />
            FAQ
          </TabsTrigger>
          <TabsTrigger value="export" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white text-slate-300">
            <FileDown className="h-4 w-4 mr-2" />
            Export Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="faq">
          <FAQ />
        </TabsContent>
        <TabsContent value="export">
          <ExportReports />
        </TabsContent>
      </Tabs>
    </div>
  );
}