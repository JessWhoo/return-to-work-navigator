import React from 'react';
import { Users, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useSEO from '@/hooks/useSEO';
import { MANAGER_GUIDE_SECTIONS } from '@/components/managerguide/managerGuideData';
import GuideTableOfContents from '@/components/managerguide/GuideTableOfContents';
import GuideSection from '@/components/managerguide/GuideSection';
import SupportTipsSection from '@/components/managerguide/SupportTipsSection';
import ManagerChecklistSection from '@/components/managerguide/ManagerChecklistSection';
import ManagerEmailTemplates from '@/components/managerguide/ManagerEmailTemplates';

export default function ManagerGuide() {
  useSEO({
    title: 'Manager & HR Guide',
    description: 'How managers and HR can support employees returning to work after cancer: what to say, accommodations, FMLA and ADA basics, talking to the team, and phased returns.',
    path: '/ManagerGuide',
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header className="bg-gradient-to-br from-violet-600 via-purple-600 to-emerald-600 rounded-3xl p-8 sm:p-10 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-3">
          <Users className="h-8 w-8" />
          <span className="text-sm font-extrabold uppercase tracking-wider">For Managers &amp; HR</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
          Supporting an Employee Through Cancer and Back to Work
        </h1>
        <p className="text-white/95 text-lg leading-relaxed max-w-2xl">
          A practical guide to what your employee is facing, what actually helps, the mistakes to avoid,
          and your legal responsibilities.
        </p>
        <Button
          variant="outline"
          onClick={() => window.print()}
          className="mt-6 bg-white text-violet-800 border-white hover:bg-violet-50"
        >
          <Printer className="h-4 w-4" /> Print or save as PDF
        </Button>
      </header>

      <SupportTipsSection />

      <ManagerChecklistSection />

      <ManagerEmailTemplates />

      <GuideTableOfContents sections={MANAGER_GUIDE_SECTIONS} />

      <div className="space-y-6">
        {MANAGER_GUIDE_SECTIONS.map((section) => (
          <GuideSection key={section.id} section={section} />
        ))}
      </div>
    </div>
  );
}