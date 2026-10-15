import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, CheckSquare, User } from 'lucide-react';
import Profile from './Profile';
import ProgressDashboard from './ProgressDashboard';
import Checklist from './Checklist';
import useSEO from '@/hooks/useSEO';
import DownloadReturnSummaryButton from '@/components/summary/DownloadReturnSummaryButton';
import PageHeader from '@/components/brand/PageHeader';

export default function MyJourney() {
  useSEO({
    title: 'My Return-to-Work Journey Dashboard & Checklist',
    description:
      'Track your return-to-work milestones, complete your step-by-step preparation checklist, and download your personalized return summary in one place.',
    path: '/MyJourney',
  });
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <PageHeader
        eyebrow="Your return journey"
        title="My Return-to-Work Journey & Progress Hub"
        subtitle="Your progress analytics, preparation checklist, and personal profile all in one place."
        actions={<DownloadReturnSummaryButton />}
      />

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="nv-tabs h-auto">
          <TabsTrigger value="dashboard" className="nv-tab">
            <TrendingUp className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="checklist" className="nv-tab">
            <CheckSquare className="h-4 w-4" />
            Checklist
          </TabsTrigger>
          <TabsTrigger value="profile" className="nv-tab">
            <User className="h-4 w-4" />
            My Profile
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <ProgressDashboard embedded />
        </TabsContent>
        <TabsContent value="checklist">
          <Checklist embedded />
        </TabsContent>
        <TabsContent value="profile">
          <Profile embedded />
        </TabsContent>
      </Tabs>
    </div>
  );
}