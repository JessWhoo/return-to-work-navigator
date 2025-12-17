import React from 'react';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { BADGES } from './GamificationSystem';

export default function BadgeDisplay({ badgeId, size = 'md', showName = true, locked = false }) {
  const badge = BADGES[badgeId];
  if (!badge) return null;
  
  const Icon = badge.icon;
  
  const sizes = {
    sm: { icon: 'h-6 w-6', container: 'p-2', text: 'text-xs' },
    md: { icon: 'h-8 w-8', container: 'p-3', text: 'text-sm' },
    lg: { icon: 'h-12 w-12', container: 'p-4', text: 'text-base' },
    xl: { icon: 'h-16 w-16', container: 'p-6', text: 'text-lg' }
  };
  
  const sizeClasses = sizes[size];
  
  return (
    <motion.div 
      className="flex flex-col items-center space-y-2"
      whileHover={{ scale: 1.1 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <div
        className={`relative ${sizeClasses.container} rounded-2xl bg-gradient-to-br ${badge.color} shadow-lg ${
          locked ? 'opacity-40 grayscale' : ''
        }`}
      >
        <Icon className={`${sizeClasses.icon} text-white`} />
        {locked && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white text-2xl font-bold">🔒</div>
          </div>
        )}
      </div>
      {showName && (
        <div className="text-center">
          <p className={`font-semibold ${locked ? 'text-slate-500' : 'text-slate-200'} ${sizeClasses.text}`}>
            {badge.name}
          </p>
          {size !== 'sm' && (
            <p className="text-xs text-slate-400 max-w-[120px]">{badge.description}</p>
          )}
        </div>
      )}
    </motion.div>
  );
}