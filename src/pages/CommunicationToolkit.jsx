import React from 'react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Mail, Users, ShieldCheck, ArrowRight, Printer } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import PageHeader from '@/components/brand/PageHeader';
import Communication from './Communication';
import EmployerEmailGenerator from './EmployerEmailGenerator';
import MeetingPrep from './MeetingPrep';

const FEATURE_LINKS = [
  {
    to: '/DisclosureGuide',
    eyebrow: 'New guide',
    title: 'Telling Your Employer About Your Diagnosis',
    text: 'Step-by-step checklist to feel confident and protected by disability laws.',
    Icon: ShieldCheck,
  },
  {
    to: '/AccommodationWorksheet',
    eyebrow: 'Printable worksheet',
    title: 'Accommodation Meeting Worksheet',
    text: 'Fill in your goals and requests, then download a clean PDF to bring to your meeting.',
    Icon: Printer,
  },
];

export default function CommunicationToolkit() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <PageHeader
        eyebrow="Tools & rights"
        title="Communication Toolkit"
        subtitle="Templates, AI email drafting, and meeting preparation"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {FEATURE_LINKS.map(({ to, eyebrow, title, text, Icon }) => (
          <Link key={to} to={to} className="block h-full">
            <Card className="h-full">
              <CardContent className="flex items-center gap-4 p-5">
                <span className="flex-shrink-0 rounded-pill bg-brand-muted p-3 text-brand-primary">
                  <Icon className="h-6 w-6" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="nv-eyebrow nv-eyebrow--primary">{eyebrow}</p>
                  <h3 className="mt-1 font-heading text-base font-bold text-brand-text">{title}</h3>
                  <p className="mt-1 text-sm text-brand-muted-foreground">{text}</p>
                </div>
                <ArrowRight className="h-5 w-5 flex-shrink-0 text-brand-primary" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Tabs defaultValue="templates" className="space-y-6">
        <TabsList className="nv-tabs h-auto">
          <TabsTrigger value="templates" className="nv-tab">
            <FileText className="h-4 w-4" />
            Templates &amp; Scripts
          </TabsTrigger>
          <TabsTrigger value="email" className="nv-tab">
            <Mail className="h-4 w-4" />
            Email Generator
          </TabsTrigger>
          <TabsTrigger value="meeting" className="nv-tab">
            <Users className="h-4 w-4" />
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