import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function QuickPointsDisplay({ points, show, onComplete }) {
  React.useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onComplete?.();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);
  
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.5 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.5 }}
          className="fixed bottom-24 right-8 z-50 bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-3 rounded-full shadow-2xl flex items-center space-x-2"
        >
          <Sparkles className="h-5 w-5" />
          <span className="font-bold text-lg">+{points} Points!</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}