import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flame, Award, TrendingUp, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import LevelDisplay from './LevelDisplay';
import BadgeDisplay from './BadgeDisplay';
import { BADGES, calculateLevel } from './GamificationSystem';

export default function GamificationDashboard({ progress }) {
  const gamification = progress?.gamification || {
    total_points: 0,
    level: 1,
    badges: [],
    current_streak: 0,
    longest_streak: 0
  };
  
  const earnedBadges = gamification.badges || [];
  const allBadgeIds = Object.keys(BADGES);
  const lockedBadges = allBadgeIds.filter(id => !earnedBadges.includes(id));
  
  const currentLevel = calculateLevel(gamification.total_points);
  
  return (
    <div className="space-y-6">
      {/* Level and Points */}
      <LevelDisplay points={gamification.total_points} />
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 300 }}>
          <Card className="bg-gradient-to-br from-orange-900/40 to-red-900/40 border-2 border-orange-600">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Current Streak</p>
                  <p className="text-3xl font-bold text-orange-400">{gamification.current_streak}</p>
                  <p className="text-xs text-slate-500">days in a row</p>
                </div>
                <Flame className="h-12 w-12 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 300 }}>
          <Card className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border-2 border-purple-600">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Badges Earned</p>
                  <p className="text-3xl font-bold text-purple-400">{earnedBadges.length}</p>
                  <p className="text-xs text-slate-500">of {allBadgeIds.length} total</p>
                </div>
                <Award className="h-12 w-12 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 300 }}>
          <Card className="bg-gradient-to-br from-teal-900/40 to-cyan-900/40 border-2 border-teal-600">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Longest Streak</p>
                  <p className="text-3xl font-bold text-teal-400">{gamification.longest_streak}</p>
                  <p className="text-xs text-slate-500">personal best</p>
                </div>
                <TrendingUp className="h-12 w-12 text-teal-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      {/* Earned Badges */}
      <Card className="bg-slate-800/90 backdrop-blur-sm border-2 border-teal-600">
        <CardHeader>
          <CardTitle className="text-xl text-slate-200 flex items-center space-x-2">
            <Award className="h-6 w-6 text-teal-400" />
            <span>Your Badges</span>
            <Badge className="bg-teal-600 text-white ml-auto">{earnedBadges.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {earnedBadges.length === 0 ? (
            <div className="text-center py-8">
              <Zap className="h-12 w-12 text-slate-500 mx-auto mb-3" />
              <p className="text-slate-400">Complete actions to earn your first badge!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {earnedBadges.map(badgeId => (
                <BadgeDisplay key={badgeId} badgeId={badgeId} size="md" />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Locked Badges */}
      {lockedBadges.length > 0 && (
        <Card className="bg-slate-800/50 backdrop-blur-sm border-2 border-slate-700">
          <CardHeader>
            <CardTitle className="text-xl text-slate-400 flex items-center space-x-2">
              <span>Badges to Unlock</span>
              <Badge variant="outline" className="border-slate-600 text-slate-500 ml-auto">
                {lockedBadges.length} remaining
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {lockedBadges.slice(0, 8).map(badgeId => (
                <BadgeDisplay key={badgeId} badgeId={badgeId} size="md" locked />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}