import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Users, Shield, Zap, BookOpen, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import PageHeader from '@/components/brand/PageHeader';
import useSEO from '@/hooks/useSEO';

const FEATURES = [
  { icon: Zap, title: 'Energy & Mood Tracking', desc: 'Daily check-ins with AI-matched resource recommendations.' },
  { icon: Shield, title: 'Legal Rights Guidance', desc: 'Plain-language summaries of ADA, FMLA, and state laws.' },
  { icon: BookOpen, title: '90+ Curated Resources', desc: 'Vetted guides, videos, support groups, and tools.' },
  { icon: Users, title: 'Community Forum', desc: 'Anonymous forums to share experiences and support.' },
  { icon: Heart, title: 'AI Return-to-Work Coach', desc: 'Personalized guidance available 24/7 via conversational AI.' },
  { icon: ArrowRight, title: 'Communication Toolkit', desc: 'Templates and scripts for employer conversations and emails.' },
];

export default function About() {
  useSEO({
    title: 'About Us',
    description:
      'Learn why Back to Life, Back to Work exists and how our toolkit helps cancer survivors return to the workplace with confidence and support.',
    path: '/About',
  });

  return (
    <div className="mx-auto max-w-4xl space-y-12 px-4 py-12">
      {/* Hero */}
      <PageHeader
        center
        eyebrow="Our story"
        title="About Back to Life, Back to Work Navigator"
        subtitle="A compassionate, comprehensive toolkit built for cancer survivors navigating the journey back to the workplace."
      />

      {/* Founder */}
      <Card>
        <CardContent className="p-8">
          <h2 className="mb-6 text-center font-heading text-3xl font-bold text-brand-text sm:text-left">Meet the Founder</h2>
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            <img
              src="https://media.base44.com/images/public/69406c752de234aafebf891d/c66b3b480_IMG_1779.jpg"
              alt="Founder & Creator"
              className="h-40 w-40 flex-shrink-0 rounded-brand-lg border-4 border-brand-accent object-cover shadow-brand-md sm:h-48 sm:w-48"
            />
            <div className="flex-1 space-y-3">
              <div>
                <p className="font-heading text-2xl font-bold text-brand-text">Jess Whorton</p>
                <p className="text-base font-semibold text-brand-primary">Founder &amp; Creator — Back to Life, Back to Work Navigator</p>
              </div>
              <p className="text-base leading-relaxed text-brand-text">
                As a cancer survivor herself, our founder knows firsthand how isolating and overwhelming the return-to-work
                journey can feel. After navigating her own diagnosis, treatment, and the difficult conversations that
                followed with employers, HR, and coworkers, she realized how little practical support existed for people
                trying to rebuild their careers while healing.
              </p>
              <p className="text-base leading-relaxed text-brand-text">
                She founded the Navigator to be the resource she wished she'd had — a warm, judgment-free companion that
                combines legal guidance, communication tools, emotional support, and community into one accessible place.
                Her mission is to make sure no survivor ever has to figure this out alone.
              </p>
              <p className="text-base italic text-brand-muted-foreground">
                "You are not going back to who you were. You are going forward as someone stronger — and you deserve support
                every step of the way."
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* What the app does */}
      <Card>
        <CardContent className="space-y-4 p-8">
          <h2 className="font-heading text-3xl font-bold text-brand-text">What We Do</h2>
          <p className="text-base leading-relaxed text-brand-text">
            The Back to Life, Back to Work Navigator is a free, all-in-one digital companion designed to guide cancer
            survivors through every phase of returning to employment after treatment. Returning to work after a cancer
            diagnosis is rarely straightforward — physical fatigue, cognitive changes, emotional anxiety, legal
            questions, and workplace communication challenges can all feel overwhelming at once.
          </p>
          <p className="text-base leading-relaxed text-brand-text">
            Our platform brings together evidence-based tools, curated resource libraries, AI-powered coaching, and
            community support in one accessible place. Users can track their daily energy and mood, generate
            accommodation request letters, prepare for difficult workplace conversations, understand their rights under
            the ADA and FMLA, and connect with peers who truly understand their experience.
          </p>
          <p className="text-base leading-relaxed text-brand-text">
            Whether you are in the early planning stages before returning, navigating your first week back, or
            managing ongoing challenges months into your return, the Navigator meets you where you are and adapts to
            your needs.
          </p>
        </CardContent>
      </Card>

      {/* Who it's for */}
      <Card className="nv-card--muted">
        <CardContent className="space-y-4 p-8">
          <h2 className="font-heading text-3xl font-bold text-brand-text">Who It's For</h2>
          <p className="text-base leading-relaxed text-brand-text">
            This platform is built for cancer survivors and patients at any stage of treatment or recovery who are
            thinking about, preparing for, or actively navigating a return to work. It is also a valuable resource
            for caregivers supporting a loved one through workplace reintegration, as well as HR professionals and
            occupational health practitioners seeking to better understand the needs of employees returning after
            serious illness.
          </p>
          <p className="text-base leading-relaxed text-brand-text">
            The Navigator is designed to be accessible, supportive, and non-judgmental — recognizing that every
            survivor's journey is unique and that there is no single "right" timeline or approach.
          </p>
        </CardContent>
      </Card>

      {/* Feature highlights */}
      <div>
        <h2 className="mb-6 text-center font-heading text-3xl font-bold text-brand-text">Key Features</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <Card key={title}>
              <CardContent className="flex items-start gap-3 p-4">
                <span className="mt-0.5 flex-shrink-0 rounded-pill bg-brand-muted p-2 text-brand-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-base font-bold text-brand-text">{title}</p>
                  <p className="mt-1 text-sm text-brand-muted-foreground">{desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="text-center">
        <Link to="/Contact" className="inline-flex items-center gap-2 text-base font-semibold text-brand-primary underline transition-colors hover:text-brand-text">
          Get in touch with us <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </div>
  );
}