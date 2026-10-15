import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Zap, Heart } from 'lucide-react';
import EnergyManagement from './EnergyManagement';
import EmotionalSupport from './EmotionalSupport';
import PageHeader from '@/components/brand/PageHeader';
import useSEO from '@/hooks/useSEO';

export default function WellbeingHub() {
  useSEO({
    title: 'Cancer Fatigue Management & Emotional Well-Being Hub',
    description:
      'Track daily energy levels, manage treatment fatigue and chemo brain at work, and access emotional support strategies for return-to-work anxiety.',
    path: '/WellbeingHub',
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <PageHeader
        eyebrow="Well-being"
        title="Workplace Energy, Fatigue & Emotional Well-Being Hub"
        subtitle="Track daily energy and symptoms, pace your workday, and manage return-to-work anxiety."
      />

      <Tabs defaultValue="energy" className="space-y-6">
        <TabsList className="nv-tabs h-auto">
          <TabsTrigger value="energy" className="nv-tab">
            <Zap className="h-4 w-4" />
            Energy &amp; Fatigue
          </TabsTrigger>
          <TabsTrigger value="emotional" className="nv-tab">
            <Heart className="h-4 w-4" />
            Emotional Support
          </TabsTrigger>
        </TabsList>

        <TabsContent value="energy">
          <EnergyManagement embedded />
        </TabsContent>
        <TabsContent value="emotional">
          <EmotionalSupport embedded />
        </TabsContent>
      </Tabs>
    </div>
  );
}