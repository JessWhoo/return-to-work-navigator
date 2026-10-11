import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Trophy, Sparkles } from 'lucide-react';
import BadgeDisplay from './BadgeDisplay';

export default function CelebrationModal({ 
  open, 
  onClose, 
  type = 'points', // 'points', 'levelup', 'badge', 'streak'
  data = {} 
}) {
  useEffect(() => {
    if (open) {
      // Trigger confetti
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const theme = window.getComputedStyle(document.documentElement);
      const brandColors = ['--brand-primary', '--brand-accent', '--brand-secondary', '--brand-sky', '--brand-compass-cream'].map(token => theme.getPropertyValue(token).trim());
      
      const randomInRange = (min, max) => Math.random() * (max - min) + min;
      
      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        
        if (timeLeft <= 0) {
          clearInterval(interval);
          return;
        }
        
        confetti({
          particleCount: 3,
          angle: randomInRange(55, 125),
          spread: randomInRange(50, 70),
          origin: { x: randomInRange(0.1, 0.9), y: Math.random() - 0.2 },
          colors: brandColors
        });
      }, 50);
      
      return () => clearInterval(interval);
    }
  }, [open]);
  
  const renderContent = () => {
    switch (type) {
      case 'levelup':
        return (
          <div className="text-center space-y-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            >
              <div className="p-8 rounded-full bg-brand-primary shadow-brand-md mx-auto w-32 h-32 flex items-center justify-center">
                <Trophy className="h-16 w-16 text-primary-foreground" />
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-brand-text">
                Level Up!
              </h2>
              <p className="text-2xl text-brand-text mt-2">You reached Level {data.newLevel}</p>
              <p className="text-brand-muted-foreground mt-4 max-w-md mx-auto">
                Your dedication is paying off! Keep going on your journey.
              </p>
            </motion.div>
          </div>
        );
        
      case 'badge':
        return (
          <div className="text-center space-y-6">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="flex justify-center"
            >
              <BadgeDisplay badgeId={data.badgeId} size="xl" showName={false} />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-brand-text">
                Badge Earned!
              </h2>
              <p className="text-2xl text-brand-text mt-2">{data.badgeName}</p>
              <p className="text-brand-muted-foreground mt-4 max-w-md mx-auto">
                {data.badgeDescription}
              </p>
            </motion.div>
          </div>
        );
        
      case 'streak':
        return (
          <div className="text-center space-y-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            >
              <div className="text-8xl">🔥</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-brand-text">
                {data.streak}-Day Streak!
              </h2>
              <p className="text-brand-text mt-4 max-w-md mx-auto">
                You're building amazing consistency! Keep it going!
              </p>
            </motion.div>
          </div>
        );
        
      default: // points
        return (
          <div className="text-center space-y-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            >
              <div className="p-6 rounded-full bg-brand-primary shadow-brand-md mx-auto w-24 h-24 flex items-center justify-center">
                <Sparkles className="h-12 w-12 text-primary-foreground" />
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-brand-text">
                +{data.points} Points!
              </h2>
              <p className="text-brand-text mt-4">Great job! You're making progress!</p>
            </motion.div>
          </div>
        );
    }
  };
  
  // Rendered as a non-blocking overlay on purpose: as a modal it locked page
  // scroll (which jumped the page) and its backdrop swallowed the next click,
  // so people ticking off several checklist items in a row lost a click.
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="pointer-events-none fixed inset-0 z-[60] flex items-center justify-center p-4"
        >
          <div className="nv-card pointer-events-auto w-full max-w-md p-6 max-h-[90dvh] overflow-y-auto">
            <div className="py-6">
              {renderContent()}
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-8"
              >
                <Button
                  onClick={onClose}
                  className="w-full !whitespace-normal"
                >
                  Continue Journey
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}