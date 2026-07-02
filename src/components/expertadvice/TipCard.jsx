import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Clock, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function TipCard({ tip, category }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <button onClick={() => setExpanded(v => !v)} className="w-full text-left">
        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            <div className={`flex-shrink-0 w-1 self-stretch rounded-full bg-gradient-to-b ${category.color}`} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <Badge variant="secondary" className="text-xs">{category.label}</Badge>
                <span className="text-xs text-slate-600 font-medium flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {tip.readTime}
                </span>
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 leading-snug mb-1.5">
                {tip.title}
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                {tip.summary}
              </p>
              <div className="flex items-center gap-2 mt-3 text-xs text-slate-600">
                <User className="h-3 w-3" />
                <span className="font-semibold">{tip.expert}</span>
                <span className="text-slate-500">•</span>
                <span>{tip.title_expert}</span>
              </div>
            </div>
            <ChevronDown
              className={`h-5 w-5 text-slate-500 flex-shrink-0 transition-transform ${expanded ? 'rotate-180' : ''}`}
            />
          </div>
        </CardContent>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: 'hidden' }}
          >
            <div className={`px-5 pb-5 pt-1 border-t bg-gradient-to-br ${category.bg}`}>
              <div className="ml-4 pt-4 text-sm text-slate-800 leading-relaxed whitespace-pre-line">
                {tip.body}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}