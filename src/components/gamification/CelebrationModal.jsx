import React, { useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Trophy, Award, Sparkles } from 'lucide-react';
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
          colors: ['#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6']
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
              <div className="p-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 shadow-2xl mx-auto w-32 h-32 flex items-center justify-center">
                <Trophy className="h-16 w-16 text-white" />
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Level Up!
              </h2>
              <p className="text-2xl text-slate-300 mt-2">You reached Level {data.newLevel}</p>
              <p className="text-slate-400 mt-4 max-w-md mx-auto">
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
              <h2 className="text-4xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                Badge Earned!
              </h2>
              <p className="text-2xl text-slate-300 mt-2">{data.badgeName}</p>
              <p className="text-slate-400 mt-4 max-w-md mx-auto">
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
              <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                {data.streak}-Day Streak!
              </h2>
              <p className="text-slate-300 mt-4 max-w-md mx-auto">
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
              <div className="p-6 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 shadow-2xl mx-auto w-24 h-24 flex items-center justify-center">
                <Sparkles className="h-12 w-12 text-white" />
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                +{data.points} Points!
              </h2>
              <p className="text-slate-300 mt-4">Great job! You're making progress!</p>
            </motion.div>
          </div>
        );
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-purple-600">
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
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              Continue Journey
            </Button>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}