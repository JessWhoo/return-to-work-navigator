import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { 
  CheckSquare, Zap, MessageSquare, FileText, Shield, 
  Heart, Calendar, BookOpen, ArrowRight, Sparkles 
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Home() {
  const { data: progress } = useQuery({
    queryKey: ['userProgress'],
    queryFn: async () => {
      const progressList = await base44.entities.UserProgress.list();
      return progressList[0] || null;
    }
  });

  const sections = [
    {
      title: 'My Journey Checklist',
      description: 'Track your progress through each phase of returning to work',
      icon: CheckSquare,
      page: 'Checklist',
      color: 'from-rose-400 to-pink-500',
      bgColor: 'bg-rose-50'
    },
    {
      title: 'Energy & Fatigue',
      description: 'Manage fatigue with pacing strategies and energy tracking',
      icon: Zap,
      page: 'EnergyManagement',
      color: 'from-amber-400 to-orange-500',
      bgColor: 'bg-amber-50'
    },
    {
      title: 'Communication Tools',
      description: 'Templates, scripts, and guidance for workplace conversations',
      icon: MessageSquare,
      page: 'Communication',
      color: 'from-blue-400 to-indigo-500',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Request Accommodations',
      description: 'Learn about your rights and generate accommodation requests',
      icon: FileText,
      page: 'Accommodations',
      color: 'from-purple-400 to-violet-500',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Legal Rights',
      description: 'Understand ADA, FMLA, and your workplace protections',
      icon: Shield,
      page: 'LegalRights',
      color: 'from-green-400 to-emerald-500',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Emotional Support',
      description: 'Resources for managing anxiety and building confidence',
      icon: Heart,
      page: 'EmotionalSupport',
      color: 'from-pink-400 to-rose-500',
      bgColor: 'bg-pink-50'
    },
    {
      title: 'Return Planning',
      description: 'Create a phased return-to-work schedule',
      icon: Calendar,
      page: 'ReturnPlanning',
      color: 'from-teal-400 to-cyan-500',
      bgColor: 'bg-teal-50'
    },
    {
      title: 'Resource Library',
      description: 'Access curated guides, organizations, and support services',
      icon: BookOpen,
      page: 'Resources',
      color: 'from-indigo-400 to-blue-500',
      bgColor: 'bg-indigo-50'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6 py-8">
        <div className="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-rose-200">
          <Sparkles className="h-4 w-4 text-rose-500" />
          <span className="text-sm font-medium text-gray-700">Your Journey, Your Pace</span>
        </div>
        
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
          <span className="bg-gradient-to-r from-rose-600 via-pink-600 to-teal-600 bg-clip-text text-transparent">
            Welcome Back
          </span>
          <br />
          <span className="text-gray-800">to Your Work, Your Life</span>
        </h1>
        
        <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Returning to work after cancer treatment is a journey. This toolkit provides guidance, 
          templates, and support to help you transition with confidence.
        </p>

        {progress?.return_date && (
          <div className="bg-white/60 backdrop-blur-sm border border-teal-200 rounded-2xl p-6 max-w-md mx-auto">
            <p className="text-sm text-gray-600 mb-1">Your planned return date</p>
            <p className="text-2xl font-bold text-teal-700">
              {new Date(progress.return_date).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      {progress && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="bg-white/60 backdrop-blur-sm border-rose-200">
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-rose-600">
                  {progress.completed_checklist_items?.length || 0}
                </div>
                <p className="text-sm text-gray-600">Checklist Items Completed</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm border-teal-200">
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-teal-600 capitalize">
                  {progress.journey_stage?.replace('_', ' ') || 'Planning'}
                </div>
                <p className="text-sm text-gray-600">Current Stage</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm border-amber-200">
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-amber-600">
                  {progress.bookmarked_resources?.length || 0}
                </div>
                <p className="text-sm text-gray-600">Saved Resources</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Sections Grid */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Explore Your Toolkit</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <Link key={section.page} to={createPageUrl(section.page)}>
                <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm border-gray-200 hover:border-rose-300 h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${section.color}`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-rose-500 group-hover:translate-x-1 transition-all" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-rose-700 transition-colors">
                      {section.title}
                    </h3>
                    
                    <p className="text-gray-600 leading-relaxed">
                      {section.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Supportive Message */}
      <div className="bg-gradient-to-r from-rose-100 via-pink-100 to-teal-100 rounded-2xl p-8 text-center">
        <Heart className="h-12 w-12 text-rose-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-800 mb-3">You're Not Alone</h3>
        <p className="text-gray-700 max-w-2xl mx-auto leading-relaxed">
          You're navigating something incredibly difficult. This toolkit is here to support you 
          every step of the way. Take what you need, move at your own pace, and remember—
          your well-being comes first.
        </p>
      </div>
    </div>
  );
}