import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Heart } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

export default function BlogPostCard({ post }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="bg-white border-2 border-rose-200 hover:border-rose-400 shadow-md hover:shadow-xl transition-all">
      <CardContent className="p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <Badge className="bg-gradient-to-r from-rose-500 to-violet-500 text-white">
            {post.tag}
          </Badge>
          <span className="text-xs text-slate-700 font-semibold">
            {format(parseISO(post.date), 'MMMM d, yyyy')}
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
          {post.title}
        </h2>

        <p className="text-base text-slate-700 leading-relaxed italic">
          {post.excerpt}
        </p>

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="space-y-4 pt-2 border-t-2 border-rose-100">
                {post.content.map((paragraph, i) => (
                  <p key={i} className="text-slate-800 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
                <div className="flex items-center gap-2 pt-2 text-sm text-rose-700 font-semibold">
                  <Heart className="h-4 w-4 fill-rose-500 text-rose-500" />
                  <span>— Jess</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Button
          variant="outline"
          onClick={() => setExpanded((v) => !v)}
          className="border-2 border-rose-300 text-rose-700 hover:bg-rose-50 font-semibold"
        >
          {expanded ? (
            <>
              Show less <ChevronUp className="h-4 w-4 ml-2" />
            </>
          ) : (
            <>
              Read the full post <ChevronDown className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}