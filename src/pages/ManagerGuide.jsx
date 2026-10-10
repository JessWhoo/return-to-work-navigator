import React, { useRef, useState } from 'react';
import { Printer, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import useSEO from '@/hooks/useSEO';
import PageHeader from '@/components/brand/PageHeader';
import { generateManagerGuidePdf } from '@/components/managerguide/generateManagerGuidePdf';
import { MANAGER_GUIDE_SECTIONS } from '@/components/managerguide/managerGuideData';
import GuideTableOfContents from '@/components/managerguide/GuideTableOfContents';
import GuideSection from '@/components/managerguide/GuideSection';
import SupportTipsSection from '@/components/managerguide/SupportTipsSection';
import ManagerChecklistSection from '@/components/managerguide/ManagerChecklistSection';
import ManagerEmailTemplates from '@/components/managerguide/ManagerEmailTemplates';

export default function ManagerGuide() {
  const guideRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);

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

  return (
    <div ref={guideRef} className="max-w-4xl mx-auto space-y-8">
      <PageHeader
        eyebrow="For Managers & HR"
        title="Supporting an Employee Through Cancer and Back to Work"
        subtitle="A practical guide to what your employee is facing, what actually helps, the mistakes to avoid, and your legal responsibilities."
        actions={
          <Button variant="outline" onClick={handleExport} disabled={isExporting}>
            {isExporting
              ? <><Loader2 className="h-4 w-4 animate-spin" /> Generating…</>
              : <><Printer className="h-4 w-4" /> Print or save as PDF</>}
          </Button>
        }
      />

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