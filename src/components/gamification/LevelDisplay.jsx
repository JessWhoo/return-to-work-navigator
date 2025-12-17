import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { calculateLevelProgress } from './GamificationSystem';

export default function LevelDisplay({ points, compact = false }) {
  const { percent, pointsToNext, currentLevel } = calculateLevelProgress(points);
  
  if (compact) {
    return (
      <div className="flex items-center space-x-3 bg-gradient-to-r from-purple-900/40 to-pink-900/40 rounded-xl p-3 border-2 border-purple-500/30">
        <div className="relative">
          <div className="p-2 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
            <Trophy className="h-5 w-5 text-white" />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-slate-900 rounded-full px-1.5 py-0.5 border border-purple-500">
            <span className="text-xs font-bold text-purple-300">{currentLevel.level}</span>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-semibold text-slate-200">{currentLevel.title}</span>
            <span className="text-xs text-slate-400">{points} pts</span>
          </div>
          <Progress value={percent} className="h-2 bg-slate-700" />
        </div>
      </div>
    );
  }
  
  return (
    <motion.div 
      className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border-2 border-purple-600 shadow-xl"
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <Trophy className="h-6 w-6 text-purple-400" />
            <h3 className="text-2xl font-bold text-slate-200">Level {currentLevel.level}</h3>
          </div>
          <p className="text-lg bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-semibold">
            {currentLevel.title}
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
            {points}
          </div>
          <p className="text-xs text-slate-400">Total Points</p>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-300">Progress to Level {currentLevel.level + 1}</span>
          {currentLevel.level < 10 && (
            <span className="text-slate-400">{pointsToNext} pts to go</span>
          )}
        </div>
        <Progress 
          value={percent} 
          className="h-3 bg-slate-700"
        />
        {currentLevel.level < 10 && (
          <p className="text-xs text-slate-500 text-center">
            {Math.round(percent)}% complete
          </p>
        )}
        {currentLevel.level === 10 && (
          <div className="flex items-center justify-center space-x-2 pt-2">
            <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
            <span className="text-sm font-semibold text-amber-400">Max Level Reached!</span>
            <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
          </div>
        )}
      </div>
    </motion.div>
  );
}