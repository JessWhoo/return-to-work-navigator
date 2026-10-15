import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HelpCircle, FileDown } from 'lucide-react';
import FAQ from '@/pages/FAQ';
import ExportReports from '@/pages/ExportReports';
import PageHeader from '@/components/brand/PageHeader';
import useSEO from '@/hooks/useSEO';

export default function HelpSupport() {
  useSEO({
    title: 'Help Center, Return-to-Work FAQs & PDF Report Exports',
    description:
      'Find answers to common questions about using Return to Work Navigator, workplace legal rights, and exporting PDF summaries for your doctor or HR team.',
    path: '/HelpSupport',
  });

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <PageHeader
        eyebrow="Support"
        title="Help, Frequently Asked Questions & Report Exports"
        subtitle="Answers to common return-to-work questions and printable PDF summaries of your saved records."
        className="nv-card nv-card--muted p-5 sm:p-8"
      />

      <Tabs defaultValue="faq" className="space-y-6">
        <TabsList aria-label="Help and support sections" className="nv-tabs h-auto">
          <TabsTrigger value="faq" className="nv-tab">
            <HelpCircle className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
            FAQ
          </TabsTrigger>
          <TabsTrigger value="export" className="nv-tab">
            <FileDown className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
            Export Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="faq">
          <FAQ embedded />
        </TabsContent>
        <TabsContent value="export">
          <ExportReports embedded />
        </TabsContent>
      </Tabs>
    </div>
  );
}