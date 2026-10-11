import React from 'react';
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
        className={`relative ${sizeClasses.container} rounded-brand-lg shadow-brand-sm ${locked ? 'bg-brand-muted border border-brand-border' : 'bg-brand-primary'}`}
      >
        <Icon className={`${sizeClasses.icon} ${locked ? 'text-brand-muted-foreground' : 'text-primary-foreground'}`} />
        {locked && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-brand-text text-2xl font-bold">🔒</div>
          </div>
        )}
      </div>
      {showName && (
        <div className="text-center">
          <p className={`font-semibold ${locked ? 'text-brand-muted-foreground' : 'text-brand-text'} ${sizeClasses.text}`}>
            {badge.name}
          </p>
          {size !== 'sm' && (
            <p className="text-xs text-brand-muted-foreground max-w-[120px]">{badge.description}</p>
          )}
        </div>
      )}
    </motion.div>
  );
}