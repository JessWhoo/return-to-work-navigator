import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HelpCircle, FileDown } from 'lucide-react';
import FAQ from './FAQ';
import ExportReports from './ExportReports';
import PageHeader from '@/components/brand/PageHeader';

export default function HelpSupport() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <PageHeader
        eyebrow="Support"
        title="Help & Support"
        subtitle="Frequently asked questions and exporting your data"
      />

      <Tabs defaultValue="faq" className="space-y-6">
        <TabsList className="nv-tabs h-auto">
          <TabsTrigger value="faq" className="nv-tab">
            <HelpCircle className="h-4 w-4" />
            FAQ
          </TabsTrigger>
          <TabsTrigger value="export" className="nv-tab">
            <FileDown className="h-4 w-4" />
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