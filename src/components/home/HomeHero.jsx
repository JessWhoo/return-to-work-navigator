import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BrandMark from '@/components/brand/BrandMark';

export default function HomeHero({ canTour, onTour, tourOpen }) {
  return (
    <section className="nv-hero nv-home-hero" aria-labelledby="home-title">
      <video autoPlay muted loop playsInline preload="metadata" aria-hidden="true" className="nv-home-scenery">
        <source src="https://media.base44.com/videos/public/69406c752de234aafebf891d/e6ff51187_128375816_1791718492796861.mp4" type="video/mp4" />
        Your browser does not support video playback. <a href="https://media.base44.com/videos/public/69406c752de234aafebf891d/e6ff51187_128375816_1791718492796861.mp4">Open the video</a>.
      </video>
      <div className="nv-home-hero-content grid gap-8 lg:grid-cols-[3fr_1fr] lg:items-center">
        <div className="space-y-6">
          <BrandMark size="lg" showName={false} className="lg:hidden" />
          <h1 id="home-title" className="max-w-2xl text-3xl font-bold text-brand-text sm:text-5xl">Your Journey Forward Starts Here</h1>
          <p className="max-w-xl text-base text-brand-text sm:text-lg">Practical guidance, tools, and support to help you transition back to work with confidence.</p>
          <div className="flex flex-wrap items-center gap-3">
            <Button asChild variant="onGradient"><Link to="/Checklist">Get Started<ArrowRight className="h-5 w-5" aria-hidden="true" /></Link></Button>
            {canTour && <Button variant="outline" onClick={onTour} disabled={tourOpen}>Take the tour</Button>}
          </div>
        </div>
        <BrandMark size="hero" showName={false} className="hidden justify-center lg:flex" />
      </div>
    </section>
  );
}