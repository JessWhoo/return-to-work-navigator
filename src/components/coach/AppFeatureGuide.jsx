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
      description: 'Track daily energy levels and identify patterns',
      color: 'from-amber-500 to-orange-500'
    },
    {
      name: 'Symptom Analysis',
      icon: Activity,
      page: 'SymptomAnalysis',
      description: 'Log symptoms and get AI-powered pattern insights',
      color: 'from-rose-500 to-pink-500'
    },
    {
      name: 'Accommodations',
      icon: Shield,
      page: 'Accommodations',
      description: 'Request and manage workplace accommodations',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      name: 'Communication Tools',
      icon: FileText,
      page: 'Communication',
      description: 'Templates for talking with employers and colleagues',
      color: 'from-purple-500 to-pink-500'
    },
    {
      name: 'Emotional Support',
      icon: Heart,
      page: 'EmotionalSupport',
      description: 'Coping strategies and wellness resources',
      color: 'from-rose-500 to-red-500'
    },
    {
      name: 'Return Planning',
      icon: Calendar,
      page: 'ReturnPlanning',
      description: 'Plan your timeline and track important dates',
      color: 'from-green-500 to-emerald-500'
    },
    {
      name: 'Resources Library',
      icon: BookOpen,
      page: 'Resources',
      description: 'Articles, videos, and support services',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      name: 'Progress Dashboard',
      icon: TrendingUp,
      page: 'ProgressDashboard',
      description: 'Visualize trends and track your journey',
      color: 'from-teal-500 to-cyan-500'
    }
  ];

  return (
    <Card className="bg-slate-800/90 backdrop-blur-sm border-2 border-teal-600">
      <CardHeader>
        <CardTitle className="text-slate-200">Explore App Features</CardTitle>
        <p className="text-xs text-slate-400 mt-1">
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
                className="w-full justify-start text-left h-auto p-3 bg-slate-700 hover:bg-slate-600 border-slate-600 text-slate-200 transition-all group"
              >
                <div className="flex items-center space-x-3 w-full">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${feature.color} flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold mb-0.5">{feature.name}</p>
                    <p className="text-xs text-slate-400">{feature.description}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-slate-300 group-hover:translate-x-1 transition-all" />
                </div>
              </Button>
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
}