import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import useSEO from '@/hooks/useSEO';
import PageHeader from '@/components/brand/PageHeader';
import StepIndicator from '@/components/accommodationLetter/StepIndicator';
import AccommodationSelector from '@/components/accommodationLetter/AccommodationSelector';
import LetterDetailsForm from '@/components/accommodationLetter/LetterDetailsForm';
import LetterPreview from '@/components/accommodationLetter/LetterPreview';
import PostLetterSharePrompt from '@/components/accommodationLetter/PostLetterSharePrompt';
import { buildLetter } from '@/components/accommodationLetter/buildLetter';
import { EMPTY_DETAILS } from '@/components/accommodationLetter/accommodationOptions';
import { logToolEngagement } from '@/lib/analytics';
import ToolSeoIntro from '@/components/seo/ToolSeoIntro';
import GuideFaqSection from '@/components/seo/GuideFaqSection';
import { ACCOMMODATION_LETTER_FAQS } from '@/components/seo/toolFaqs';

const STEP_COPY = {
  1: { title: 'ADA Workplace Accommodation Letter Generator', sub: 'Select every workplace accommodation that would help you do your job well. You can add custom adjustments too.' },
  2: { title: 'A few details for the letter', sub: 'This information fills in the letter — nothing is stored or sent anywhere.' },
  3: { title: 'Your accommodation request letter', sub: 'Review it, make any edits, then copy, print, or download it to send to your employer.' },
};

export default function AccommodationLetterGenerator() {
  useSEO({
    title: 'Free ADA Workplace Accommodation Letter Generator',
    description:
      'Generate a formal, ADA-aligned workplace accommodation request letter in three guided steps — customize schedule, remote work, and fatigue accommodations.',
    path: '/AccommodationLetterGenerator',
  });

  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState([]);
  const [details, setDetails] = useState(EMPTY_DETAILS);
  const [letter, setLetter] = useState('');

  const toggle = (opt) =>
    setSelected((prev) => (prev.some((s) => s.id === opt.id) ? prev.filter((s) => s.id !== opt.id) : [...prev, opt]));
  const addCustom = (label) =>
    setSelected((prev) => [...prev, { id: `custom-${Date.now()}`, label, rationale: '', custom: true }]);
  const removeCustom = (id) => setSelected((prev) => prev.filter((s) => s.id !== id));

  // Move to a step and bring its content into view. Without this, a user (or a
  // scripted test) sitting at the bottom of the long accommodation list clicks
  // Continue while the freshly rendered step sits above the viewport, so the
  // click looks like it did nothing.
  const goToStep = (target) => {
    setStep(target);
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const canContinue = step !== 1 || selected.length > 0;

  const next = () => {
    if (step === 1 && selected.length === 0) {
      toast.error('Select at least one accommodation to continue');
      return;
    }
    if (step === 2) {
      setLetter(buildLetter(selected, details));
      logToolEngagement('accommodation_letter_generator');
    }
    goToStep(step + 1);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <style>{`@media print { .no-print { display: none !important; } .print-letter { border: none !important; box-shadow: none !important; } }`}</style>

      <div className="no-print mb-8">
        <PageHeader
          eyebrow="Accommodation"
          title={STEP_COPY[step].title}
          subtitle={STEP_COPY[step].sub}
        />
        {step === 1 && (
          <div className="mt-6">
            <ToolSeoIntro
              id="accommodation-letter-intro"
              eyebrow="Accommodation letter"
              heading="How to Write an ADA Accommodation Request Letter After Cancer"
              paragraphs={[
                'A written accommodation request is what starts your employer’s legal duty under the Americans with Disabilities Act to consider adjustments to your job. This generator turns the accommodations you choose — flexible hours, remote work, rest breaks, ergonomic changes — into a formal request letter you can edit, print, or download and send to HR.',
                'You decide how much to disclose, and nothing you enter is stored or sent anywhere.',
              ]}
              points={[
                'Three guided steps, no sign-in needed',
                'Covers schedule, remote work, fatigue, and workspace needs',
                'Print or download the finished letter as a PDF',
              ]}
            />
          </div>
        )}
        <div className="mt-6"><StepIndicator current={step} /></div>
      </div>

      {/* Each step mounts immediately on click — no exit-wait animation, so the
          wizard can never stay parked on the previous step. */}
      <motion.div
        key={step}
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        {step === 3 ? (
          <div className="space-y-6">
            <LetterPreview text={letter} onChange={setLetter} onRegenerate={() => setLetter(buildLetter(selected, details))} />
            <PostLetterSharePrompt />
          </div>
        ) : (
          <Card>
            <CardContent className="p-5 sm:p-8">
              {step === 1 ? (
                <AccommodationSelector selected={selected} onToggle={toggle} onAddCustom={addCustom} onRemoveCustom={removeCustom} />
              ) : (
                <LetterDetailsForm details={details} onChange={(k, v) => setDetails((d) => ({ ...d, [k]: v }))} />
              )}
            </CardContent>
          </Card>
        )}
      </motion.div>

      <div className="no-print mt-6 flex items-center justify-between gap-3">
        <Button variant="outline" disabled={step === 1} onClick={() => goToStep(step - 1)}>
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        {step < 3 ? (
          <div className="flex items-center gap-3">
            {step === 1 && (
              <span className="text-sm font-semibold text-brand-muted-foreground">
                {selected.length > 0 ? `${selected.length} selected` : 'Select at least one to continue'}
              </span>
            )}
            <Button onClick={next} disabled={!canContinue}>
              {step === 2 ? <><FileText className="h-4 w-4" /> Generate letter</> : <>Continue <ArrowRight className="h-4 w-4" /></>}
            </Button>
          </div>
        ) : (
          <p className="text-right text-xs text-brand-muted-foreground">
            Educational use only — not legal advice.
          </p>
        )}
      </div>

      <div className="no-print mt-12">
        <GuideFaqSection
          id="accommodation-letter-faq"
          eyebrow="Accommodation letter FAQ"
          title="Frequently Asked Questions About ADA Accommodation Letters"
          subtitle="What to include, who to send it to, and what your employer has to do next."
          faqs={ACCOMMODATION_LETTER_FAQS}
        />
      </div>
    </div>
  );
}