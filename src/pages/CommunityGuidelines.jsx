import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import useSEO from '@/hooks/useSEO';
import PageHeader from '@/components/brand/PageHeader';
import GuidelineSection from '@/components/community/GuidelineSection';
import GuideFaqSection from '@/components/seo/GuideFaqSection';
import { COMMUNITY_GUIDELINES_FAQS } from '@/components/seo/guideFaqsData';
import {
  COMMUNITY_GUIDELINES,
  COMMUNITY_GUIDELINES_INTRO,
  COMMUNITY_GUIDELINES_EXPORTS,
} from '@/components/community/guidelinesData';
import {
  Heart, Briefcase, ShieldCheck, Stethoscope, Flag, Users,
  ArrowRight, LifeBuoy, MessageCircle,
} from 'lucide-react';

const ICONS = { Heart, Briefcase, ShieldCheck, Stethoscope, Flag, Users };

export default function CommunityGuidelines() {
  useSEO({
    title: 'Community Forum Guidelines: Supportive, Work-Focused Peer Support',
    description:
      'How the Return to Work Navigator community forum works: kindness, privacy, on-topic peer support about returning to work after cancer, and how posts are moderated.',
    path: '/CommunityGuidelines',
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <PageHeader
        center
        eyebrow="Community Guidelines"
        title="Community Guidelines"
        subtitle="Peer conversations are the heart of this community. These are the shared expectations that keep the forum supportive, private, and focused on the practical work of returning to work after cancer."
        actions={
          <Button asChild variant="outline">
            <Link to="/CommunityHub">
              <MessageCircle className="h-4 w-4 mr-2" />
              Go to the forum
            </Link>
          </Button>
        }
      />

      {/* Why these guidelines exist */}
      <Card className="nv-card--muted">
        <CardContent className="p-6 space-y-3">
          <p className="nv-eyebrow nv-eyebrow--primary">Why these guidelines exist</p>
          <p className="text-brand-text">{COMMUNITY_GUIDELINES_INTRO.purpose}</p>
          <p className="text-sm text-brand-muted-foreground">{COMMUNITY_GUIDELINES_INTRO.appliesTo}</p>
          <p className="text-xs text-brand-muted-foreground">{COMMUNITY_GUIDELINES_INTRO.reviewed}</p>
        </CardContent>
      </Card>

      {/* Sections */}
      <section aria-labelledby="guidelines-heading" className="space-y-5">
        <div className="space-y-1.5">
          <p className="nv-eyebrow nv-eyebrow--primary">What we ask of every member</p>
          <h2 id="guidelines-heading" className="font-heading text-2xl sm:text-3xl font-bold text-brand-text">
            Six shared expectations
          </h2>
        </div>
        {COMMUNITY_GUIDELINES.map((section, idx) => (
          <GuidelineSection
            key={section.id}
            {...section}
            number={idx + 1}
            icon={ICONS[section.icon]}
          />
        ))}
      </section>

      <GuideFaqSection
        id="community-faq"
        eyebrow="Community FAQ"
        title="Frequently Asked Questions About the Forum"
        subtitle="Who can read the forum, how anonymity works, and what happens when a post crosses a line."
        faqs={COMMUNITY_GUIDELINES_FAQS}
      />

      {/* Raising a concern */}
      <Card className="nv-card--sage">
        <CardContent className="p-8 space-y-4 text-center">
          <LifeBuoy className="mx-auto h-10 w-10 text-brand-primary" />
          <h2 className="font-heading text-2xl font-bold text-brand-text">
            {COMMUNITY_GUIDELINES_EXPORTS.helpTitle}
          </h2>
          <p className="mx-auto max-w-2xl text-brand-text">{COMMUNITY_GUIDELINES_EXPORTS.helpBody}</p>
          <p className="mx-auto max-w-2xl text-sm text-brand-muted-foreground">
            {COMMUNITY_GUIDELINES_EXPORTS.crisis}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild>
              <Link to="/Contact">
                Report a concern
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/emergency-contacts">Emergency contacts</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}