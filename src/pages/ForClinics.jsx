import React from 'react';
import { Calendar, FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PageHeader from '@/components/brand/PageHeader';
import useSEO from '@/hooks/useSEO';
import ClinicOverviewSection from '@/components/clinics/ClinicOverviewSection';
import ClinicFreeAndReferralSection from '@/components/clinics/ClinicFreeAndReferralSection';
import ClinicPrivacySection from '@/components/clinics/ClinicPrivacySection';
import ClinicDemoBookingCard from '@/components/clinics/ClinicDemoBookingCard';
import { generateClinicHandoutPdf } from '@/components/clinics/generateClinicHandoutPdf';
import { toast } from 'sonner';

export default function ForClinics() {
  useSEO({
    title: 'For Clinics, Oncology Social Workers & Nurse Navigators',
    description:
      'Learn how oncology clinics, nurse navigators, and social workers can refer cancer survivors to Return to Work Navigator — 100% free for patients, privacy-first, with printable handouts and a 15-minute team demo.',
    path: '/ForClinics',
  });

  const scrollToDemo = () => {
    const el = document.getElementById('book-clinic-demo');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDownloadHandout = () => {
    try {
      generateClinicHandoutPdf();
      toast.success('1-page patient handout PDF downloaded.');
    } catch {
      toast.error('Could not generate PDF handout.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <PageHeader
        eyebrow="For Clinics & Nurse Navigators"
        title="For Oncology Clinics, Nurse Navigators & Social Workers"
        subtitle="A 100% free, privacy-first return-to-work toolkit you can confidently hand to cancer survivors navigating ADA accommodations, FMLA leave, treatment fatigue, and employer conversations."
        actions={
          <>
            <Button onClick={scrollToDemo}>
              <Calendar className="h-4 w-4" />
              Book a 15-Minute Demo
            </Button>
            <Button variant="outline" onClick={handleDownloadHandout}>
              <FileDown className="h-4 w-4" />
              1-Page Patient Handout (PDF)
            </Button>
          </>
        }
      />

      <ClinicOverviewSection />

      <ClinicFreeAndReferralSection />

      <ClinicPrivacySection />

      <ClinicDemoBookingCard />
    </div>
  );
}