import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/lib/AuthContext';
import { 
  CheckSquare, Zap, MessageSquare, FileText, Shield, 
  Heart, Calendar, BookOpen, ArrowRight, Sparkles, Star, Search
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import CalendarView from '../components/dashboard/CalendarView';
import OnboardingFlow from '../components/OnboardingFlow';
import DailyCheckIn from '../components/DailyCheckIn';
import useSEO from '@/hooks/useSEO';


export default function Home() {
  useSEO({
    title: 'Home',
    description: 'Your return-to-work compass for cancer survivors. Track progress, manage energy, request accommodations, and find support — at your own pace.',
    path: '/'
  });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAuthenticated, user } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);

  const particles = useMemo(() => Array.from({ length: 6 }, (_, i) => ({
    id: i,
    width: Math.random() * 300 + 50,
    height: Math.random() * 300 + 50,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    dx: Math.random() * 100 - 50,
    dy: Math.random() * 100 - 50,
    duration: Math.random() * 10 + 10,
  })), []);
  
  const { data: progress, error: progressError } = useQuery({
    queryKey: ['userProgress', user?.id],
    enabled: !!isAuthenticated && !!user?.id,
    queryFn: async () => {
      // First try to read an existing record — the common case after first load.
      const progressList = await base44.entities.UserProgress.list();
      if (progressList.length > 0) return progressList[0];

      // No record yet — attempt to create one. This can 403 if another
      // component/tab created a record in the same instant, or if the user
      // session is stale. Always fall back to a re-list rather than surfacing
      // the transient race as a hard failure.
      try {
        return await base44.entities.UserProgress.create({
          completed_checklist_items: [],
          journey_stage: 'planning',
          calendar_events: [],
          onboarding_completed: false
        });
      } catch (err) {
        const retry = await base44.entities.UserProgress.list();
        if (retry.length > 0) return retry[0];
        // Genuine failure — bubble up so react-query records the error and
        // downstream UI can degrade gracefully instead of spinning forever.
        throw err;
      }
    },
    retry: (failureCount, err) => {
      // Retry twice for transient 403s (race with another tab/component)
      // but never for other errors.
      const status = err?.response?.status ?? err?.status;
      return status === 403 && failureCount < 2;
    },
    staleTime: 60_000,
  });

  useEffect(() => {
    if (progress && !progress.onboarding_completed) {
      setShowOnboarding(true);
    }
  }, [progress]);

  const updateProgressMutation = useMutation({
    mutationFn: async (updates) => {
      if (!progress?.id) return null;
      return await base44.entities.UserProgress.update(progress.id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['userProgress']);
    }
  });

  const completeOnboardingMutation = useMutation({
    mutationFn: async () => {
      if (!progress?.id) return null;
      return await base44.entities.UserProgress.update(progress.id, {
        onboarding_completed: true
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['userProgress']);
      setShowOnboarding(false);
    }
  });

  const handleCompleteOnboarding = () => {
    // Guard against double-clicks: ignore if a completion is already in flight.
    if (completeOnboardingMutation.isPending) return;
    completeOnboardingMutation.mutate();
  };

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
    },
    {
      title: 'Job Boards',
      description: 'Cancer-friendly job boards, returnship programs, and remote work opportunities',
      icon: Search,
      page: 'JobBoards',
      color: 'from-sky-400 to-blue-500',
      bgColor: 'bg-sky-50'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <OnboardingFlow 
        open={showOnboarding} 
        onComplete={handleCompleteOnboarding}
      />
      
      {/* Hero Cover Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative min-h-[85vh] flex items-center justify-center overflow-hidden rounded-3xl mb-12"
      >
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-rose-200 via-sky-200 to-emerald-200">
          <div className="absolute inset-0 opacity-80">
            {particles.map((p) => (
              <motion.div
                key={p.id}
                className="absolute rounded-full bg-gradient-to-br from-rose-400 to-sky-400 blur-2xl"
                style={{
                  width: p.width,
                  height: p.height,
                  left: p.left,
                  top: p.top,
                }}
                animate={{
                  x: [0, p.dx],
                  y: [0, p.dy],
                  scale: [1, 1.1, 1],
                  opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                  duration: p.duration,
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
            className="inline-flex items-center space-x-2 bg-white px-6 py-3 rounded-full border-2 border-rose-300 shadow-lg"
          >
            <Star className="h-5 w-5 text-rose-500 fill-rose-500" />
            <span className="text-sm font-bold text-slate-900">Your Journey, Your Pace</span>
            <Star className="h-5 w-5 text-sky-500 fill-sky-500" />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight"
          >
            <span className="bg-gradient-to-r from-rose-600 via-violet-600 to-sky-700 bg-clip-text text-transparent">
              Welcome Back
            </span>
            <br />
            <span className="text-slate-900">to Your Work,<br />Your Life</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-xl sm:text-2xl text-slate-800 max-w-3xl mx-auto leading-relaxed font-medium"
          >
            Returning to work after cancer treatment is a journey.<br />
            This toolkit provides guidance, templates, and support<br />
            to help you transition with <span className="font-bold text-rose-600">confidence</span>.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6"
          >
            <Button 
              onClick={() => navigate(createPageUrl('Checklist'))}
              className="bg-gradient-to-r from-rose-500 via-violet-500 to-sky-600 hover:from-rose-600 hover:via-violet-600 hover:to-sky-700 text-white font-bold px-8 py-6 text-lg rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
            >
              <CheckSquare className="h-5 w-5 mr-2" />
              View My Checklist
            </Button>
            {progress?.onboarding_completed && (
              <Button 
                onClick={() => setShowOnboarding(true)}
                disabled={showOnboarding}
                variant="outline"
                className="border-2 border-sky-600 text-sky-700 bg-white hover:bg-sky-50 hover:border-sky-700 font-semibold px-8 py-6 text-lg rounded-full shadow-md hover:shadow-lg transition-all disabled:opacity-60"
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
              className="bg-white border-2 border-rose-300 rounded-2xl p-6 max-w-md mx-auto shadow-xl mt-8"
            >
              <p className="text-sm font-semibold text-slate-700 mb-2">Your planned return date</p>
              <p className="text-3xl font-extrabold bg-gradient-to-r from-rose-600 to-sky-700 bg-clip-text text-transparent">
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

      {/* Standing Ovation Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.6 }}
        className="mb-12 rounded-3xl overflow-hidden shadow-lg border border-white/80"
      >
        <img
          src="https://media.base44.com/images/public/69406c752de234aafebf891d/4835056a4_unnamed.png"
          alt="Every Survivor Deserves a Standing Ovation - Celebrating the strength, beauty, and resilience of cancer survivors"
          className="w-full h-auto block"
        />
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
            <Card className="bg-white border-2 border-rose-200 shadow-md hover:shadow-xl hover:border-rose-400 transition-all">
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <div className="text-4xl font-extrabold bg-gradient-to-r from-rose-600 to-violet-600 bg-clip-text text-transparent">
                    {progress.completed_checklist_items?.length || 0}
                  </div>
                  <p className="text-sm font-bold text-slate-800">Checklist Items Completed</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
            <Card className="bg-white border-2 border-emerald-200 shadow-md hover:shadow-xl hover:border-emerald-400 transition-all">
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <div className="text-4xl font-extrabold bg-gradient-to-r from-emerald-600 to-sky-600 bg-clip-text text-transparent capitalize">
                    {progress.journey_stage?.replace('_', ' ') || 'Planning'}
                  </div>
                  <p className="text-sm font-bold text-slate-800">Current Stage</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
            <Card className="bg-white border-2 border-sky-200 shadow-md hover:shadow-xl hover:border-sky-400 transition-all">
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <div className="text-4xl font-extrabold bg-gradient-to-r from-sky-600 to-violet-600 bg-clip-text text-transparent">
                    {progress.bookmarked_resources?.length || 0}
                  </div>
                  <p className="text-sm font-bold text-slate-800">Saved Resources</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}

      {/* Daily Check-In */}
      <DailyCheckIn />

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
        <h2 className="text-3xl font-extrabold text-slate-900 mb-8 text-center">Explore Your Toolkit</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={section.page}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + index * 0.03 }}
                whileHover={{ y: -8 }}
              >
                <Link to={createPageUrl(section.page)}>
                  <Card className="group hover:shadow-2xl transition-all duration-300 bg-white border-2 border-slate-200 hover:border-rose-400 h-full">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <motion.div 
                          className={`p-4 rounded-2xl bg-gradient-to-br ${section.color} shadow-lg`}
                          whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                          transition={{ duration: 0.5 }}
                        >
                          <Icon className="h-7 w-7 text-white" />
                        </motion.div>
                        <ArrowRight className="h-6 w-6 text-slate-400 group-hover:text-rose-600 group-hover:translate-x-2 transition-all" />
                      </div>

                      <h3 className="text-xl font-extrabold text-slate-900 mb-3 group-hover:bg-gradient-to-r group-hover:from-rose-600 group-hover:to-sky-700 group-hover:bg-clip-text group-hover:text-transparent transition-all">
                        {section.title}
                      </h3>

                      <p className="text-slate-700 leading-relaxed text-sm font-medium">
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
        transition={{ delay: 0.2 }}
        className="relative overflow-hidden bg-gradient-to-r from-rose-200 via-amber-100 to-sky-200 rounded-3xl p-12 text-center shadow-xl mt-16 border-2 border-rose-300"
      >
        <div className="absolute inset-0 opacity-70">
          <div className="absolute top-0 left-0 w-40 h-40 bg-rose-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-sky-400 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-emerald-300 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          >
            <Heart className="h-16 w-16 text-rose-600 mx-auto mb-6 fill-rose-500" />
          </motion.div>
          <h3 className="text-3xl font-extrabold text-slate-900 mb-4">You're Not Alone</h3>
          <p className="text-lg text-slate-800 max-w-2xl mx-auto leading-relaxed font-medium">
            You're navigating something incredibly difficult. This toolkit is here to support you 
            every step of the way. Take what you need, move at your own pace, and remember—
            <span className="font-bold text-rose-700"> your well-being comes first</span>.
          </p>
        </div>
      </motion.div>
    </div>
  );
}