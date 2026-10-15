import React, { useState } from 'react';
import { Calendar, FileDown, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PageHeader from '@/components/brand/PageHeader';
import useSEO from '@/hooks/useSEO';
import ClinicOverviewSection from '@/components/clinics/ClinicOverviewSection';
import ClinicFreeAndReferralSection from '@/components/clinics/ClinicFreeAndReferralSection';
import ClinicPrivacySection from '@/components/clinics/ClinicPrivacySection';
import ClinicDemoBookingCard from '@/components/clinics/ClinicDemoBookingCard';
import PrintablePatientHandout from '@/components/clinics/PrintablePatientHandout';
import { generateClinicHandoutPdf } from '@/components/clinics/generateClinicHandoutPdf';
import { toast } from 'sonner';

export default function ForClinics() {
  const [showPrintHandout, setShowPrintHandout] = useState(false);

  useSEO({
    title: 'For Clinics, Oncology Social Workers & Nurse Navigators',
    description:
      'Learn how oncology clinics, nurse navigators, and social workers can refer cancer survivors to Return to Work Navigator — 100% free for patients, privacy-first, with printable QR code handouts and a 15-minute team demo.',
    path: '/ForClinics',
  });

  const scrollToDemo = () => {
    const el = document.getElementById('book-clinic-demo');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDownloadHandout = () => {
    try {
      generateClinicHandoutPdf();
      toast.success('1-page patient handout PDF with QR code downloaded.');
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
            <Button onClick={() => setShowPrintHandout(true)}>
              <Printer className="h-4 w-4" />
              Printable Handout + QR Code
            </Button>
            <Button variant="secondary" onClick={handleDownloadHandout}>
              <FileDown className="h-4 w-4" />
              Download PDF
            </Button>
            <Button variant="outline" onClick={scrollToDemo}>
              <Calendar className="h-4 w-4" />
              Book 15-Min Demo
            </Button>
          </>
        }
      />

      <ClinicOverviewSection />

      <ClinicFreeAndReferralSection onOpenPrintHandout={() => setShowPrintHandout(true)} />

      <ClinicPrivacySection />

      <ClinicDemoBookingCard />

      <PrintablePatientHandout
        open={showPrintHandout}
        onClose={() => setShowPrintHandout(false)}
      />
    </div>
  );
}