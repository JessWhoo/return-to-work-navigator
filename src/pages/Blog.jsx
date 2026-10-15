import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import PageHeader from '@/components/brand/PageHeader';
import { founderPosts } from '@/components/blog/founderPosts';
import BlogPostCard from '@/components/blog/BlogPostCard';
import useSEO from '@/hooks/useSEO';

export default function Blog() {
  useSEO({
    title: 'Cancer Survivor Return-to-Work Stories & Founder Blog',
    description:
      'Read honest reflections, practical encouragement, and workplace recovery stories from cancer survivor and founder Jess Whorton.',
    path: '/Blog',
  });

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <PageHeader center eyebrow="From the Founder" title="Founder Reflections: Inspiration & Hope After Cancer" subtitle="Honest reflections from Jess Whorton — cancer survivor, founder, and someone who has walked the road back to work. Read one when you need a reminder that you're not alone." />

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
        className="nv-card nv-card--muted text-center p-8"
      >
        <Heart className="h-10 w-10 text-brand-primary fill-brand-primary mx-auto mb-3" />
        <p className="text-brand-text font-medium max-w-xl mx-auto">
          More posts coming soon. If a post spoke to you, screenshot it, share
          it with someone who needs it, or come back to it on a hard day.
        </p>
      </motion.div>
    </div>
  );
}