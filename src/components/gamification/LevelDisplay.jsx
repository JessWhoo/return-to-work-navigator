import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { calculateLevelProgress } from './GamificationSystem';

export default function LevelDisplay({ points, compact = false }) {
  const { percent, pointsToNext, currentLevel } = calculateLevelProgress(points);
  
  if (compact) {
    return (
      <div className="nv-card nv-card--muted flex items-center gap-3 p-3">
        <div className="relative">
          <div className="p-2 rounded-full bg-brand-primary shadow-brand-sm">
            <Trophy className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-brand-surface rounded-full px-1.5 py-0.5 border border-brand-border">
            <span className="text-xs font-bold text-brand-primary">{currentLevel.level}</span>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-semibold text-brand-text">{currentLevel.title}</span>
            <span className="text-xs text-brand-muted-foreground">{points} pts</span>
          </div>
          <Progress value={percent} className="h-2 bg-brand-muted" />
        </div>
      </div>
    );
  }
  
  return (
    <motion.div 
      className="nv-card p-6"
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <Trophy className="h-6 w-6 text-brand-primary" />
            <h3 className="text-2xl font-bold text-brand-text">Level {currentLevel.level}</h3>
          </div>
          <p className="text-lg text-brand-primary font-semibold">
            {currentLevel.title}
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-brand-primary">
            {points}
          </div>
          <p className="text-xs text-brand-muted-foreground">Total Points</p>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
          <span className="text-brand-muted-foreground">Progress to Level {currentLevel.level + 1}</span>
          {currentLevel.level < 10 && (
            <span className="text-brand-muted-foreground">{pointsToNext} pts to go</span>
          )}
        </div>
        <Progress 
          value={percent} 
          className="h-3 bg-brand-muted"
        />
        {currentLevel.level < 10 && (
          <p className="text-xs text-brand-muted-foreground text-center">
            {Math.round(percent)}% complete
          </p>
        )}
        {currentLevel.level === 10 && (
          <div className="flex items-center justify-center space-x-2 pt-2">
            <Star className="h-5 w-5 text-brand-primary fill-brand-primary" />
            <span className="text-sm font-semibold text-brand-primary">Max Level Reached!</span>
            <Star className="h-5 w-5 text-brand-primary fill-brand-primary" />
          </div>
        )}
      </div>
    </motion.div>
  );
}