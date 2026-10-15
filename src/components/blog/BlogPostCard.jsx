import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Heart } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

export default function BlogPostCard({ post, defaultExpanded = false }) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <Card className="">
      <CardContent className="p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <Badge className="">
            {post.tag}
          </Badge>
          <span className="text-xs text-brand-muted-foreground font-semibold">
            {format(parseISO(post.date), 'MMMM d, yyyy')}
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-brand-text">
          {post.title}
        </h2>

        <p className="text-base text-brand-muted-foreground italic">
          {post.excerpt}
        </p>

        <div className={expanded ? 'space-y-4 pt-2 border-t border-brand-border' : 'sr-only'}>
          {post.content.map((paragraph, i) => (
            <p key={i} className="text-brand-text">
              {paragraph}
            </p>
          ))}
          <div className="flex items-center gap-2 pt-2 text-sm text-brand-primary font-semibold">
            <Heart className="h-4 w-4 fill-brand-primary text-brand-primary" />
            <span>— Jess</span>
          </div>
        </div>

        <Button
          variant="outline"
          onClick={() => setExpanded((v) => !v)}
          className="!whitespace-normal"
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