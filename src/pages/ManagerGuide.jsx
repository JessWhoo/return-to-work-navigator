import React, { useEffect, useRef, useState } from 'react';
import { Printer, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import PremiumPaywall from '@/components/premium/PremiumPaywall';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import useSEO from '@/hooks/useSEO';
import PageHeader from '@/components/brand/PageHeader';
import { generateManagerGuidePdf } from '@/components/managerguide/generateManagerGuidePdf';
import GuideTableOfContents from '@/components/managerguide/GuideTableOfContents';
import GuideSection from '@/components/managerguide/GuideSection';
import SupportTipsSection from '@/components/managerguide/SupportTipsSection';
import ManagerChecklistSection from '@/components/managerguide/ManagerChecklistSection';
import ManagerEmailTemplates from '@/components/managerguide/ManagerEmailTemplates';
import GuideFaqSection from '@/components/seo/GuideFaqSection';
import GuideLanguageSwitch from '@/components/seo/GuideLanguageSwitch';
import SubscriptionManager from '@/components/managerguide/SubscriptionManager';
import { Card, CardContent } from '@/components/ui/card';

export default function ManagerGuide() {
  const guideRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);
  const [access, setAccess] = useState(null);
  const [content, setContent] = useState(null);
  const [contentError, setContentError] = useState(false);

  useEffect(() => {
    base44.functions.invoke('check-premium-access', {})
      .then((res) => setAccess(res.data))
      .catch(() => setAccess({ hasAccess: false, isAuthenticated: false }));
  }, []);

  useEffect(() => {
    if (access?.hasAccess && !content && !contentError) {
      base44.functions.invoke('get-manager-guide', {})
        .then((res) => setContent(res.data))
        .catch(() => setContentError(true));
    }
  }, [access?.hasAccess]);

  const handleExport = async () => {
    if (!guideRef.current || isExporting) return;
    setIsExporting(true);
    try {
      await generateManagerGuidePdf(guideRef.current);
      toast.success('Manager Guide PDF downloaded.');
    } catch {
      toast.error('Could not generate the PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  useSEO({
    title: 'Manager & HR Guide',
    description: 'How managers and HR can support employees returning to work after cancer: what to say, accommodations, FMLA and ADA basics, talking to the team, and phased returns.',
    path: '/ManagerGuide',
  });

  const en = content?.en;
  const tocSections = en ? [...en.sections, { id: 'faq', title: 'Frequently Asked Questions (FAQ)' }] : [];

  return (
    <div ref={guideRef} className="max-w-4xl mx-auto space-y-8">
      <PageHeader
        eyebrow="For Managers & HR"
        title="Supporting an Employee Through Cancer and Back to Work"
        subtitle="Practical guidance for workplace conversations, accommodations, and return planning."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <GuideLanguageSwitch
              englishPath="/ManagerGuide"
              spanishPath="/ManagerGuideEs"
              currentLang="en"
            />
            {access?.hasAccess && (
              <Button variant="outline" onClick={handleExport} disabled={isExporting}>
                {isExporting
                  ? <><Loader2 className="h-4 w-4 animate-spin" /> Generating…</>
                  : <><Printer className="h-4 w-4" /> Print or save as PDF</>}
              </Button>
            )}
          </div>
        }
      />

      <Card>
        <CardContent className="p-6 sm:p-8 space-y-3">
          <p className="nv-eyebrow nv-eyebrow--primary">Executive Summary for HR &amp; People Leaders</p>
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-brand-text">
            How to Support an Employee With Cancer: The 4-Pillar Framework
          </h2>
          <p className="rounded-brand border border-brand-border bg-brand-muted p-4 text-sm font-medium text-brand-text leading-relaxed">
            <strong>Start with listening:</strong> Ask what support would be useful. Discuss work-related needs and agree on the next check-in. Avoid assumptions about readiness, recovery, or what the employee wants shared.
          </p>
          <p className="text-sm sm:text-base text-brand-text leading-relaxed">
            In practice, supportive workplace responses focus on four concrete habits: (1) <strong>Protect confidentiality</strong>—share nothing about an employee’s health without their explicit permission; (2) <strong>Use an interactive accommodation process</strong> to explore flexible hours, remote options, or phased schedules; (3) <strong>Confirm agreements in writing</strong> so expectations stay clear for both sides; and (4) <strong>Plan team workload proactively</strong> during leave and ramp-up periods.
          </p>
          <p className="text-xs text-brand-muted-foreground leading-relaxed">
            <strong>Legal note:</strong> Summaries of the ADA, FMLA, and state leave laws on this page are for general educational reference only and are not individualized legal advice. Employer coverage and employee eligibility depend on company size, tenure, and jurisdiction—consult HR or qualified employment counsel for your specific situation.
          </p>
        </CardContent>
      </Card>

      {access?.hasAccess ? (
        contentError ? (
          <div className="flex justify-center py-12">
            <p className="text-sm text-brand-muted-foreground">Could not load the premium guide. Please refresh the page to try again.</p>
          </div>
        ) : en ? (
          <>
            <SubscriptionManager />
            <GuideTableOfContents sections={tocSections} />

            <SupportTipsSection tips={en.supportTips} />

            <div className="space-y-6">
              {en.sections.map((section) => (
                <GuideSection key={section.id} section={section} />
              ))}
            </div>

            <ManagerChecklistSection checklist={en.checklist} />

            <ManagerEmailTemplates templates={en.emailTemplates} categories={en.emailTemplateCategories} />

            <GuideFaqSection
              id="faq"
              eyebrow="Manager & HR FAQ"
              title="Frequently Asked Questions: Supporting an Employee With Cancer"
              subtitle="Direct answers to the most common legal, communication, and accommodation questions managers and HR professionals face."
              faqs={en.faqs}
            />
          </>
        ) : (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-brand-primary" aria-label="Loading premium content" />
          </div>
        )
      ) : access ? (
        <PremiumPaywall isAuthenticated={access.isAuthenticated} />
      ) : (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-brand-primary" aria-label="Loading premium access" />
        </div>
      )}
    </div>
  );
}