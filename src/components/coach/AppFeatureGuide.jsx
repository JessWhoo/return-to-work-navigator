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
            <Link
              key={idx}
              to={createPageUrl(feature.page)}
              className="block"
            >
              <Button
                variant="outline"
                className="group h-auto w-full justify-start p-3 text-left"
              >
                <div className="flex w-full items-center space-x-3">
                  <div className="flex-shrink-0 rounded-brand bg-muted p-2 text-primary transition-transform group-hover:scale-110">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="mb-0.5 text-sm font-semibold text-foreground">{feature.name}</p>
                    <p className="text-xs text-muted-foreground">{feature.description}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-primary" />
                </div>
              </Button>
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
}