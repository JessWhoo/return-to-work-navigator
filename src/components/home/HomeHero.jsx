import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BrandMark from '@/components/brand/BrandMark';

/**
 * Hero — one filled action, one quiet line of secondary links.
 * Everything else that used to compete here is demoted so the first screen
 * asks for a single decision.
 */
export default function HomeHero({ canTour, onTour, tourOpen, isAuthenticated }) {
  return (
    <section className="nv-hero nv-home-hero" aria-labelledby="home-title">
      <video autoPlay muted loop playsInline preload="metadata" aria-hidden="true" className="nv-home-scenery">
        <source src="/video/home-hero.mp4" type="video/mp4" />
        Your browser does not support video playback. <a href="/video/home-hero.mp4">Open the video</a>.
      </video>
      <div className="nv-home-hero-content grid gap-8 lg:grid-cols-[3fr_1fr] lg:items-center">
        <div className="space-y-6">
          <BrandMark size="lg" showName={false} className="lg:hidden" />
          <h1 id="home-title" className="max-w-2xl text-3xl font-bold text-brand-text sm:text-5xl">Return-to-work guidance, at your pace.</h1>
          <p className="max-w-xl text-base text-brand-text sm:text-lg">A free toolkit for people navigating work after cancer. Explore workplace conversation templates, accommodation guidance, energy tools, and return planning—if and when returning is right for you.</p>

          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
              <Button asChild variant="onGradient"><Link to="/Checklist">View the return-to-work checklist<ArrowRight className="h-5 w-5" aria-hidden="true" /></Link></Button>
              <p className="text-xs font-medium text-brand-text sm:text-sm">No account needed to view the checklist. Choose one useful step today.</p>
            </div>
            <nav aria-label="More ways to begin" className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-semibold">
              <Link to="/Resources" className="text-brand-text underline underline-offset-4 hover:text-brand-primary">Explore resources</Link>
              {!isAuthenticated && <Link to="/register" className="text-brand-text underline underline-offset-4 hover:text-brand-primary">Create a free account</Link>}
              {canTour && (
                <button
                  type="button"
                  onClick={onTour}
                  disabled={tourOpen}
                  className="text-brand-text underline underline-offset-4 hover:text-brand-primary disabled:opacity-60"
                >
                  Take the tour
                </button>
              )}
            </nav>
          </div>
        </div>
        <BrandMark size="hero" showName={false} className="hidden justify-center lg:flex" />
      </div>
    </section>
  );
}