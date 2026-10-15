import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import PageHeader from '@/components/brand/PageHeader';
import { privacyPolicySections } from '@/components/privacy/privacyPolicySections';
import useSEO from '@/hooks/useSEO';

export default function PrivacySecurity() {
  useSEO({
    title: 'Privacy Policy & Data Security Practices',
    description:
      'Read our plain-language privacy policy explaining how Return to Work Navigator protects your health logs, workplace notes, and personal account data.',
    path: '/PrivacySecurity',
  });

  return (
    <article className="mx-auto max-w-3xl space-y-6">
      <PageHeader eyebrow="Return to Work Navigator" title="Privacy Policy & Data Protection" subtitle="Our data handling and privacy practices, explained in plain language." />
      <p className="text-sm text-brand-muted-foreground">Last updated: <time dateTime="2026-10-12">October 12, 2026</time></p>
      <Card>
        <CardContent className="space-y-8 p-6 sm:p-8">
          {privacyPolicySections.map(({ title, paragraphs }, index) => (
            <section key={title} aria-labelledby={`privacy-section-${index}`} className="space-y-3">
              <h2 id={`privacy-section-${index}`} className="font-heading text-xl font-bold text-brand-text">{title}</h2>
              {paragraphs.map(paragraph => <p key={paragraph} className="text-brand-text">{paragraph}</p>)}
            </section>
          ))}
          <nav aria-label="Privacy contacts and settings" className="flex flex-wrap gap-3 border-t border-brand-border pt-6">
            <Link to="/Contact" className="nv-btn nv-btn--outline">Contact the Navigator team</Link>
            <Link to="/Profile" className="nv-btn nv-btn--text">My Profile &amp; preferences</Link>
          </nav>
        </CardContent>
      </Card>
    </article>
  );
}