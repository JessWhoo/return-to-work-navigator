import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Compass, Home, FileText, Scale, MessageSquare, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import useSEO from '@/hooks/useSEO';

const POPULAR_TOOLS = [
  {
    title: 'ADA Accommodation Letter Generator',
    description: 'Draft a tailored workplace accommodation request letter in 3 steps.',
    href: '/AccommodationLetterGenerator',
    icon: FileText,
  },
  {
    title: 'Workplace Legal Rights Advisor',
    description: 'Get plain-language answers on ADA, FMLA, COBRA, and state protections.',
    href: '/LegalRightsAdvisor',
    icon: Scale,
  },
  {
    title: 'AI Return-to-Work Coach',
    description: 'Chat 24/7 for confidential support on schedules, fatigue, and HR scripts.',
    href: '/Coach',
    icon: MessageSquare,
  },
  {
    title: 'Resource & Wellness Libraries',
    description: 'Browse vetted guides on fatigue management, disclosure, and recovery.',
    href: '/ResourceLibrary',
    icon: BookOpen,
  },
];

export default function PageNotFound() {
  const location = useLocation();
  const pageName = location.pathname.replace(/^\/+/, '');

  useSEO({
    title: 'Page Not Found (404)',
    description:
      'The page you requested could not be found. Explore Return to Work Navigator tools, ADA workplace accommodation guides, and cancer survivorship resources.',
    path: location.pathname,
    noindex: true,
  });

  return (
    <main className="min-h-screen bg-brand-background px-4 py-12 sm:px-6 flex items-center justify-center">
      <div className="max-w-2xl w-full space-y-8 text-center">
        <div className="space-y-3">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-pill bg-brand-muted text-brand-primary">
            <Compass className="h-7 w-7" />
          </div>
          <p className="nv-eyebrow nv-eyebrow--primary">404 — Page Not Found</p>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-brand-text">
            We couldn&apos;t find that page
          </h1>
          <p className="text-brand-muted-foreground max-w-lg mx-auto">
            {pageName ? (
              <>
                The path <span className="font-semibold text-brand-text">&ldquo;/{pageName}&rdquo;</span> doesn&apos;t exist or may have moved. Use one of the direct links below to continue navigating your return to work.
              </>
            ) : (
              'The page you requested does not exist or may have moved. Use one of the direct links below to continue.'
            )}
          </p>
        </div>

        <div className="flex justify-center">
          <Button asChild>
            <Link to="/">
              <Home className="h-4 w-4 mr-2" />
              Return to Homepage
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
          {POPULAR_TOOLS.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link key={tool.href} to={tool.href} className="block group">
                <Card className="h-full transition-colors group-hover:border-brand-primary">
                  <CardContent className="p-5 space-y-1.5">
                    <div className="flex items-center gap-2 text-brand-primary font-heading font-bold text-base">
                      <Icon className="h-4 w-4 shrink-0" />
                      <span>{tool.title}</span>
                    </div>
                    <p className="text-xs text-brand-muted-foreground leading-relaxed">
                      {tool.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}