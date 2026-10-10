import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Zap, Heart } from 'lucide-react';
import EnergyManagement from './EnergyManagement';
import EmotionalSupport from './EmotionalSupport';
import PageHeader from '@/components/brand/PageHeader';

export default function WellbeingHub() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <PageHeader
        eyebrow="Well-being"
        title="Health & Well-Being"
        subtitle="Energy management, fatigue tracking, and emotional support"
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
          <EnergyManagement />
        </TabsContent>
        <TabsContent value="emotional">
          <EmotionalSupport />
        </TabsContent>
      </Tabs>
    </div>
  );
}