import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, FileText, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import useSEO from '@/hooks/useSEO';
import StepIndicator from '@/components/accommodationLetter/StepIndicator';
import AccommodationSelector from '@/components/accommodationLetter/AccommodationSelector';
import LetterDetailsForm from '@/components/accommodationLetter/LetterDetailsForm';
import LetterPreview from '@/components/accommodationLetter/LetterPreview';
import { buildLetter } from '@/components/accommodationLetter/buildLetter';
import { EMPTY_DETAILS } from '@/components/accommodationLetter/accommodationOptions';

const STEP_COPY = {
  1: { title: 'Which accommodations do you need?', sub: 'Select everything that would help you do your job well. You can add your own too.' },
  2: { title: 'A few details for the letter', sub: 'This information fills in the letter — nothing is stored or sent anywhere.' },
  3: { title: 'Your accommodation request letter', sub: 'Review it, make any edits, then copy, print, or download it to send to your employer.' },
};

export default function AccommodationLetterGenerator() {
  useSEO({
    title: 'Accommodation Letter Generator',
    description: 'Choose standard workplace accommodations and generate a professionally formatted request letter for your employer.',
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

  const next = () => {
    if (step === 1 && selected.length === 0) {
      toast.error('Select at least one accommodation to continue');
      return;
    }
    if (step === 2) setLetter(buildLetter(selected, details));
    setStep((s) => s + 1);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <style>{`@media print { .no-print { display: none !important; } .print-letter { border: none !important; box-shadow: none !important; } }`}</style>

      <div className="no-print mb-8">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-violet-700">
          <Sparkles className="h-3.5 w-3.5" /> Accommodation Letter Generator
        </div>
        <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {STEP_COPY[step].title}
        </h1>
        <p className="mt-2 text-slate-700 font-medium max-w-2xl">{STEP_COPY[step].sub}</p>
        <div className="mt-6"><StepIndicator current={step} /></div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          {step === 3 ? (
            <LetterPreview text={letter} onChange={setLetter} onRegenerate={() => setLetter(buildLetter(selected, details))} />
          ) : (
            <Card className="border-2 border-slate-200 shadow-sm">
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
      </AnimatePresence>

      <div className="no-print mt-6 flex items-center justify-between gap-3">
        <Button variant="outline" className="font-bold" disabled={step === 1} onClick={() => setStep((s) => s - 1)}>
          <ArrowLeft className="h-4 w-4 mr-1.5" /> Back
        </Button>
        {step < 3 ? (
          <div className="flex items-center gap-3">
            {step === 1 && (
              <span className="text-sm font-semibold text-slate-700">{selected.length} selected</span>
            )}
            <Button onClick={next} className="bg-gradient-to-r from-violet-600 to-emerald-600 hover:from-violet-700 hover:to-emerald-700 text-white font-bold">
              {step === 2 ? <><FileText className="h-4 w-4 mr-1.5" /> Generate letter</> : <>Continue <ArrowRight className="h-4 w-4 ml-1.5" /></>}
            </Button>
          </div>
        ) : (
          <p className="text-xs text-slate-600 font-medium text-right">
            Educational use only — not legal advice.
          </p>
        )}
      </div>
    </div>
  );
}