import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  Zap, Activity, FileText, Shield, 
  Heart, Calendar, BookOpen, TrendingUp,
  ArrowRight
} from 'lucide-react';

export default function AppFeatureGuide() {
  const features = [
    {
      name: 'Energy & Fatigue Tracking',
      icon: Zap,
      page: 'EnergyManagement',
      description: 'Track daily energy levels and identify patterns'
    },
    {
      name: 'Symptom Analysis',
      icon: Activity,
      page: 'SymptomAnalysis',
      description: 'Log symptoms and get AI-powered pattern insights'
    },
    {
      name: 'Accommodations',
      icon: Shield,
      page: 'Accommodations',
      description: 'Request and manage workplace accommodations'
    },
    {
      name: 'Communication Tools',
      icon: FileText,
      page: 'Communication',
      description: 'Templates for talking with employers and colleagues'
    },
    {
      name: 'Emotional Support',
      icon: Heart,
      page: 'EmotionalSupport',
      description: 'Coping strategies and wellness resources'
    },
    {
      name: 'Return Planning',
      icon: Calendar,
      page: 'ReturnPlanning',
      description: 'Plan your timeline and track important dates'
    },
    {
      name: 'Resources Library',
      icon: BookOpen,
      page: 'Resources',
      description: 'Articles, videos, and support services'
    },
    {
      name: 'Progress Dashboard',
      icon: TrendingUp,
      page: 'ProgressDashboard',
      description: 'Visualize trends and track your journey'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-foreground">Explore App Features</CardTitle>
        <p className="mt-1 text-xs text-muted-foreground">
          Navigate to different sections for specialized tools and resources
        </p>
      </CardHeader>
      <CardContent className="space-y-2">
        {features.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <Button key={idx} asChild variant="outline" className="h-auto w-full justify-start !whitespace-normal p-3 text-left">
              <Link to={createPageUrl(feature.page)}>
                <div className="flex w-full items-center gap-3">
                  <div className="shrink-0 rounded-pill bg-muted p-2 text-primary"><Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" /></div>
                  <div className="min-w-0 flex-1">
                    <p className="mb-1 text-sm font-semibold text-foreground">{feature.name}</p>
                    <p className="text-xs text-muted-foreground">{feature.description}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                </div>
              </Link>
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
}