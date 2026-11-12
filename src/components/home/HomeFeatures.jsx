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
    <section aria-label="Community support and resources" className="grid gap-5 md:grid-cols-2">
      {features.map(feature => <article key={feature.title} className={`nv-card flex flex-col gap-6 p-5 sm:p-8 ${feature.tone}`}>
        <div className="grid grid-cols-[minmax(0,1fr)_64px] items-center gap-3 sm:grid-cols-[minmax(0,1fr)_120px]">
          <div className="space-y-3"><h2 className="text-xl font-bold sm:text-2xl">{feature.title}</h2><p className="text-sm text-brand-text sm:text-base">{feature.description}</p></div>
          <img src={feature.artwork} alt="" width="1024" height="1024" loading="lazy" decoding="async" className="h-auto w-full object-contain" />
        </div>
        <Button asChild variant="outline" className="mt-auto self-start !whitespace-normal"><Link to={feature.path}>{feature.cta}<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link></Button>
      </article>)}
    </section>
  );
}