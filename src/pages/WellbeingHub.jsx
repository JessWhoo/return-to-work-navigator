import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Zap, Heart, BookOpen, Brain, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import EnergyManagement from './EnergyManagement';
import EmotionalSupport from './EmotionalSupport';
import WellbeingResourcesTab from '@/components/wellbeing/WellbeingResourcesTab';
import PageHeader from '@/components/brand/PageHeader';
import useSEO from '@/hooks/useSEO';

export default function WellbeingHub() {
  useSEO({
    title: 'Cancer Fatigue Management & Emotional Well-Being Hub',
    description:
      'Track daily energy levels, manage treatment fatigue and chemo brain at work, and access emotional support strategies for return-to-work anxiety.',
    path: '/WellbeingHub',
  });

  // Allow deep-linking the consolidated Resources tab (e.g. from redirected
  // library routes) via ?tab=resources.
  const [params] = useSearchParams();
  const [tab, setTab] = useState(params.get('tab') === 'resources' ? 'resources' : 'energy');

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <PageHeader
        eyebrow="Well-being"
        title="Workplace Energy, Fatigue & Emotional Well-Being Hub"
        subtitle="Track daily workday energy, pace your tasks, and manage return-to-work anxiety."
      />

      <Card className="nv-card--sage">
        <CardContent className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5">
          <span className="flex-shrink-0 rounded-pill bg-brand-muted p-3 text-brand-primary">
            <Brain className="h-6 w-6" aria-hidden="true" />
          </span>
          <div className="flex-1 min-w-0">
            <p className="font-heading text-lg font-bold text-brand-text">Chemo brain at work</p>
            <p className="text-sm text-brand-muted-foreground">Real symptoms, practical focus strategies, ADA accommodations, and a daily energy check-in.</p>
          </div>
          <Button asChild><Link to="/ChemoBrainGuide">Read the guide <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" /></Link></Button>
        </CardContent>
      </Card>

      <Tabs value={tab} onValueChange={setTab} className="space-y-6">
        <TabsList className="nv-tabs h-auto">
          <TabsTrigger value="energy" className="nv-tab">
            <Zap className="h-4 w-4" />
            Energy &amp; Fatigue
          </TabsTrigger>
          <TabsTrigger value="emotional" className="nv-tab">
            <Heart className="h-4 w-4" />
            Emotional Support
          </TabsTrigger>
          <TabsTrigger value="resources" className="nv-tab">
            <BookOpen className="h-4 w-4" />
            Resources &amp; Libraries
          </TabsTrigger>
        </TabsList>

        <TabsContent value="energy">
          <EnergyManagement embedded />
        </TabsContent>
        <TabsContent value="emotional">
          <EmotionalSupport embedded />
        </TabsContent>
        <TabsContent value="resources">
          <WellbeingResourcesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}