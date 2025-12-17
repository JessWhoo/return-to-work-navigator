import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Trophy, Award, Target, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import GamificationDashboard from '../components/gamification/GamificationDashboard';
import { motion } from 'framer-motion';

export default function Gamification() {
  const { data: progress } = useQuery({
    queryKey: ['userProgress'],
    queryFn: async () => {
      const progressList = await base44.entities.UserProgress.list();
      if (progressList.length > 0) return progressList[0];
      
      return await base44.entities.UserProgress.create({
        completed_checklist_items: [],
        journey_stage: 'planning',
        gamification: {
          total_points: 0,
          level: 1,
          badges: [],
          achievements: [],
          current_streak: 0,
          longest_streak: 0,
          milestones_reached: []
        }
      });
    }
  });
  
  if (!progress) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }
  
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-900/40 to-pink-900/40 px-6 py-3 rounded-full border-2 border-purple-600">
          <Trophy className="h-6 w-6 text-purple-400" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Your Progress & Achievements
          </h1>
          <Sparkles className="h-6 w-6 text-pink-400" />
        </div>
        <p className="text-lg text-slate-300 max-w-2xl mx-auto">
          Track your journey, celebrate milestones, and unlock achievements as you progress through your return-to-work journey.
        </p>
      </motion.div>
      
      {/* Points Guide */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-cyan-600">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 mb-4">
              <Target className="h-5 w-5 text-cyan-400" />
              <h3 className="font-semibold text-slate-200">How to Earn Points</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
              <div className="flex items-center space-x-2 text-slate-300">
                <span className="font-bold text-amber-400">+10</span>
                <span>Complete checklist item</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-300">
                <span className="font-bold text-amber-400">+5</span>
                <span>Log daily energy</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-300">
                <span className="font-bold text-amber-400">+3</span>
                <span>Bookmark a resource</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-300">
                <span className="font-bold text-amber-400">+5</span>
                <span>Rate a resource</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-300">
                <span className="font-bold text-amber-400">+5</span>
                <span>Message AI Coach</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-300">
                <span className="font-bold text-amber-400">+15</span>
                <span>Request accommodation</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-300">
                <span className="font-bold text-amber-400">+20</span>
                <span>Set return date</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-300">
                <span className="font-bold text-amber-400">+5</span>
                <span>Create calendar event</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-300">
                <span className="font-bold text-amber-400">+2</span>
                <span>Daily login</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Main Dashboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <GamificationDashboard progress={progress} />
      </motion.div>
      
      {/* Motivational Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 rounded-2xl p-8 text-center border-2 border-purple-600"
      >
        <Award className="h-12 w-12 text-purple-400 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-slate-200 mb-2">Every Step Counts</h3>
        <p className="text-slate-300 max-w-2xl mx-auto">
          Your journey back to work is unique and valuable. Each action you take, every resource you explore, 
          and all the planning you do represents progress. Celebrate your achievements—you're doing great!
        </p>
      </motion.div>
    </div>
  );
}