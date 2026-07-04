import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';
import { founderPosts } from '@/components/blog/founderPosts';
import BlogPostCard from '@/components/blog/BlogPostCard';
import useSEO from '@/hooks/useSEO';

export default function Blog() {
  useSEO({
    title: 'From the Founder — Inspiration & Hope',
    description:
      'Reflections, encouragement, and hope from Jess Whorton, cancer survivor and founder of Back to Life, Back to Work Navigator.',
    path: '/Blog',
  });

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-4"
      >
        <div className="inline-flex items-center gap-2 bg-white px-5 py-2 rounded-full border-2 border-rose-300 shadow-sm">
          <Sparkles className="h-4 w-4 text-rose-500" />
          <span className="text-sm font-bold text-slate-900">From the Founder</span>
          <Heart className="h-4 w-4 text-rose-500 fill-rose-500" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-rose-600 via-violet-600 to-sky-700 bg-clip-text text-transparent leading-tight">
          Inspiration & Hope
        </h1>
        <p className="text-lg text-slate-700 max-w-2xl mx-auto font-medium leading-relaxed">
          Honest reflections from Jess Whorton — cancer survivor, founder, and
          someone who has walked the road back to work. Read one when you need a
          reminder that you're not alone.
        </p>
      </motion.div>

      {/* Posts */}
      <div className="space-y-6">
        {founderPosts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.08, duration: 0.5 }}
          >
            <BlogPostCard post={post} />
          </motion.div>
        ))}
      </div>

      {/* Closing note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center bg-gradient-to-r from-rose-100 via-amber-50 to-sky-100 border-2 border-rose-200 rounded-2xl p-8 shadow-md"
      >
        <Heart className="h-10 w-10 text-rose-600 fill-rose-500 mx-auto mb-3" />
        <p className="text-slate-800 font-medium leading-relaxed max-w-xl mx-auto">
          More posts coming soon. If a post spoke to you, screenshot it, share
          it with someone who needs it, or come back to it on a hard day.
        </p>
      </motion.div>
    </div>
  );
}