import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  { title: 'You Are Not Alone', description: 'Connect with a supportive community of people who understand your journey.', cta: 'Join Our Community', path: '/CommunityHub', tone: 'nv-card--sage', artwork: '/images/community-artwork.webp' },
  { title: 'Resources That Empower', description: 'Guides, templates, and expert tips to help you feel prepared at every stage.', cta: 'Explore Resources', path: '/Resources', tone: 'nv-card--pink', artwork: '/images/resources-artwork.webp' },
];

export default function HomeFeatures() {
  return (
    <div className="grid overflow-hidden rounded-brand-lg border border-brand-border md:grid-cols-2">
      {features.map(feature => (
        <article key={feature.title} className={`flex flex-col ${feature.tone}`}>
          <img src={feature.artwork} alt="" width="1024" height="1024" loading="lazy" decoding="async" className="aspect-[4/3] w-full object-cover" />
          <div className="flex flex-1 flex-col gap-3 p-6 sm:p-8">
            <h4 className="font-heading text-xl font-bold sm:text-2xl">{feature.title}</h4>
            <p className="text-sm text-brand-text sm:text-base">{feature.description}</p>
            <Button asChild variant="outline" className="mt-auto self-start !whitespace-normal"><Link to={feature.path}>{feature.cta}<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link></Button>
          </div>
        </article>
      ))}
    </div>
  );
}