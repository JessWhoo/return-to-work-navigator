import React from 'react';
import { Award, Target } from 'lucide-react';
import PageHeader from '@/components/brand/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import GamificationDashboard from '@/components/gamification/GamificationDashboard';
import { motion } from 'framer-motion';
import { useUserProgress } from '@/hooks/useUserProgress';

export default function Gamification() {
  const { data: progress } = useUserProgress({
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
  
  if (!progress) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <PageHeader center title="Your Progress & Achievements" subtitle="Track your journey, celebrate milestones, and unlock achievements as you progress through your return-to-work journey." />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="nv-card--muted">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-4"><Target className="h-5 w-5 text-brand-primary" /><h3 className="font-semibold text-brand-text">How to Earn Points</h3></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
              {[[10, 'Complete checklist item'], [5, 'Log daily energy'], [3, 'Bookmark a resource'], [5, 'Rate a resource'], [5, 'Message AI Coach'], [15, 'Request accommodation'], [20, 'Set return date'], [5, 'Create calendar event'], [2, 'Daily login']].map(([points, label]) => <div key={label} className="flex items-center gap-2 text-brand-text"><span className="font-bold text-brand-primary">+{points}</span><span>{label}</span></div>)}
            </div>
          </CardContent>
        </Card>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}><GamificationDashboard progress={progress} /></motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="nv-card nv-card--muted p-8 text-center">
        <Award className="h-12 w-12 text-brand-primary mx-auto mb-4" /><h3 className="text-2xl font-bold text-brand-text mb-2">Every Step Counts</h3><p className="text-brand-muted-foreground max-w-2xl mx-auto">Your journey back to work is unique and valuable. Each action you take, every resource you explore, and all the planning you do represents progress. Celebrate your achievements—you're doing great!</p>
      </motion.div>
    </div>
  );
}