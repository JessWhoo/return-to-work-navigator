import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  CheckSquare, Zap, MessageSquare, FileText, Shield, 
  Heart, Calendar, BookOpen, ArrowRight, Sparkles, Star
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import CalendarView from '../components/dashboard/CalendarView';
import OnboardingFlow from '../components/OnboardingFlow';

export default function Home() {
  const queryClient = useQueryClient();
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  const { data: progress } = useQuery({
    queryKey: ['userProgress'],
    queryFn: async () => {
      const progressList = await base44.entities.UserProgress.list();
      if (progressList.length > 0) return progressList[0];
      
      return await base44.entities.UserProgress.create({
        completed_checklist_items: [],
        journey_stage: 'planning',
        calendar_events: [],
        onboarding_completed: false
      });
    }
  });

  useEffect(() => {
    if (progress && !progress.onboarding_completed) {
      setShowOnboarding(true);
    }
  }, [progress]);

  const updateProgressMutation = useMutation({
    mutationFn: async (updates) => {
      return await base44.entities.UserProgress.update(progress.id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['userProgress']);
    }
  });

  const completeOnboardingMutation = useMutation({
    mutationFn: async () => {
      return await base44.entities.UserProgress.update(progress.id, {
        onboarding_completed: true
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['userProgress']);
      setShowOnboarding(false);
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
    <div className="max-w-7xl mx-auto">
      <OnboardingFlow 
        open={showOnboarding} 
        onComplete={() => completeOnboardingMutation.mutate()}
      />
      
      {/* Hero Cover Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative min-h-[85vh] flex items-center justify-center overflow-hidden rounded-3xl mb-12"
      >
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-700 to-teal-900">
          <div className="absolute inset-0 opacity-20">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-gradient-to-br from-teal-500 to-cyan-600"
                style={{
                  width: Math.random() * 300 + 50,
                  height: Math.random() * 300 + 50,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  x: [0, Math.random() * 100 - 50],
                  y: [0, Math.random() * 100 - 50],
                  scale: [1, 1.1, 1],
                  opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                  duration: Math.random() * 10 + 10,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center space-y-8 px-6 py-16">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center space-x-2 bg-slate-900/80 backdrop-blur-md px-6 py-3 rounded-full border-2 border-teal-500 shadow-lg"
          >
            <Star className="h-5 w-5 text-teal-400 fill-teal-400" />
            <span className="text-sm font-semibold text-slate-200">Your Journey, Your Pace</span>
            <Star className="h-5 w-5 text-cyan-400 fill-cyan-400" />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight"
          >
            <span className="bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent drop-shadow-sm">
              Welcome Back
            </span>
            <br />
            <span className="text-slate-100">to Your Work,<br />Your Life</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-xl sm:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-light"
          >
            Returning to work after cancer treatment is a journey.<br />
            This toolkit provides guidance, templates, and support<br />
            to help you transition with <span className="font-semibold text-teal-400">confidence</span>.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6"
          >
            <Link to={createPageUrl('Coach')}>
              <Button className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white px-8 py-6 text-lg rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:scale-105">
                <MessageSquare className="h-5 w-5 mr-2" />
                Talk to AI Coach
              </Button>
            </Link>
            <Link to={createPageUrl('Checklist')}>
              <Button variant="outline" className="border-2 border-slate-300 text-slate-200 hover:bg-slate-800 hover:border-teal-400 hover:text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                <CheckSquare className="h-5 w-5 mr-2" />
                View My Checklist
              </Button>
            </Link>
            {progress?.onboarding_completed && (
              <Button 
                onClick={() => setShowOnboarding(true)}
                variant="outline"
                className="border-2 border-cyan-400 text-cyan-300 hover:bg-cyan-900/30 hover:border-cyan-300 px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all"
              >
                <Sparkles className="h-5 w-5 mr-2" />
                View Tutorial
              </Button>
            )}
          </motion.div>

          {progress?.return_date && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="bg-slate-800/90 backdrop-blur-md border-2 border-teal-500 rounded-2xl p-6 max-w-md mx-auto shadow-2xl mt-8"
            >
              <p className="text-sm font-medium text-slate-400 mb-2">Your planned return date</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                {new Date(progress.return_date).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Quick Stats */}
      {progress && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12"
        >
          <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
            <Card className="bg-gradient-to-br from-slate-800 to-slate-700 border-2 border-teal-600 shadow-lg hover:shadow-xl transition-all">
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <div className="text-4xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                    {progress.completed_checklist_items?.length || 0}
                  </div>
                  <p className="text-sm font-semibold text-slate-300">Checklist Items Completed</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
            <Card className="bg-gradient-to-br from-slate-800 to-slate-700 border-2 border-emerald-600 shadow-lg hover:shadow-xl transition-all">
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <div className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent capitalize">
                    {progress.journey_stage?.replace('_', ' ') || 'Planning'}
                  </div>
                  <p className="text-sm font-semibold text-slate-300">Current Stage</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
            <Card className="bg-gradient-to-br from-slate-800 to-slate-700 border-2 border-cyan-600 shadow-lg hover:shadow-xl transition-all">
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    {progress.bookmarked_resources?.length || 0}
                  </div>
                  <p className="text-sm font-semibold text-slate-300">Saved Resources</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}

      {/* Calendar View */}
      {progress && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <CalendarView 
            progress={progress} 
            onUpdateProgress={(updates) => updateProgressMutation.mutate(updates)}
          />
        </motion.div>
      )}

      {/* Main Sections Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Explore Your Toolkit</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={section.page}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <Link to={createPageUrl(section.page)}>
                  <Card className="group hover:shadow-2xl transition-all duration-300 bg-slate-800/90 backdrop-blur-sm border-2 border-slate-700 hover:border-teal-500 h-full">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <motion.div 
                          className={`p-4 rounded-2xl bg-gradient-to-br ${section.color} shadow-lg`}
                          whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                          transition={{ duration: 0.5 }}
                        >
                          <Icon className="h-7 w-7 text-white" />
                        </motion.div>
                        <ArrowRight className="h-6 w-6 text-slate-500 group-hover:text-teal-400 group-hover:translate-x-2 transition-all" />
                      </div>

                      <h3 className="text-xl font-bold text-slate-200 mb-3 group-hover:bg-gradient-to-r group-hover:from-teal-400 group-hover:to-cyan-400 group-hover:bg-clip-text group-hover:text-transparent transition-all">
                        {section.title}
                      </h3>

                      <p className="text-slate-400 leading-relaxed text-sm">
                        {section.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Supportive Message */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2 }}
        className="relative overflow-hidden bg-gradient-to-r from-slate-800 via-teal-900 to-slate-800 rounded-3xl p-12 text-center shadow-xl mt-16 border-2 border-teal-600"
      >
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-40 h-40 bg-teal-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-cyan-500 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          >
            <Heart className="h-16 w-16 text-teal-400 mx-auto mb-6 fill-teal-400" />
          </motion.div>
          <h3 className="text-3xl font-bold text-slate-100 mb-4">You're Not Alone</h3>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            You're navigating something incredibly difficult. This toolkit is here to support you 
            every step of the way. Take what you need, move at your own pace, and remember—
            <span className="font-bold text-teal-400"> your well-being comes first</span>.
          </p>
        </div>
      </motion.div>
    </div>
  );
}