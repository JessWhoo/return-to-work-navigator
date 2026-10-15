import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import useSEO from '@/hooks/useSEO';
import PageHeader from '@/components/brand/PageHeader';
import { MessageSquare, Sparkles, ArrowRight, RefreshCw } from 'lucide-react';
import { DISCLOSURE_STEPS } from '@/components/disclosure/disclosureSteps';
import StepCard from '@/components/disclosure/StepCard';
import LegalProtectionsCard from '@/components/disclosure/LegalProtectionsCard';

const STORAGE_KEY = 'disclosure_checklist_v1';

export default function DisclosureGuide() {
  useSEO({
    title: 'How to Tell Your Employer About a Cancer Diagnosis',
    description:
      'Step-by-step workplace disclosure guide for cancer survivors: decide whether, when, and how to share your diagnosis with HR or your manager while protecting your privacy.',
    path: '/DisclosureGuide',
  });
  const [checkedItems, setCheckedItems] = useState([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setCheckedItems(JSON.parse(saved));
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(checkedItems));
  }, [checkedItems]);

  const totalItems = useMemo(
    () => DISCLOSURE_STEPS.reduce((sum, s) => sum + s.checklistItems.length, 0),
    []
  );

  const progressPct = totalItems
    ? Math.round((checkedItems.length / totalItems) * 100)
    : 0;

  const toggle = (key) => {
    setCheckedItems((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const reset = () => setCheckedItems([]);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <PageHeader center eyebrow="Step-by-step guide" title="How to Tell Your Employer About Your Cancer Diagnosis" subtitle="A confident, protected path to disclosing a cancer diagnosis at work — with clear steps and a checklist so you never go in unprepared." />

      {/* Progress */}
      <Card className="">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <div>
              <p className="nv-eyebrow">
                Your Preparation
              </p>
              <p className="text-2xl font-extrabold text-brand-text">
                {checkedItems.length} of {totalItems} items complete
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={reset}
              className=""
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
              Reset
            </Button>
          </div>
          <Progress value={progressPct} className="h-3" />
          <p className="text-sm font-semibold text-brand-muted-foreground mt-2">
            {progressPct}% ready
          </p>
        </CardContent>
      </Card>

      {/* Legal protections */}
      <LegalProtectionsCard />

      {/* Steps */}
      <div className="space-y-5">
        {DISCLOSURE_STEPS.map((step, idx) => (
          <StepCard
            key={step.id}
            step={step}
            index={idx}
            checkedItems={checkedItems}
            onToggle={toggle}
          />
        ))}
      </div>

      {/* Next actions */}
      <Card className="nv-card--muted">
        <CardContent className="p-8 text-center space-y-4">
          <Sparkles className="h-10 w-10 text-brand-primary mx-auto" />
          <h2 className="text-2xl font-extrabold text-brand-text">
            Ready to draft your message?
          </h2>
          <p className="text-brand-text font-medium max-w-xl mx-auto">
            Use the Communication Toolkit to turn your plan into a professional
            email — or rehearse with the AI Coach first.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/CommunicationToolkit">
              <Button className="">
                Draft an Email
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <Link to="/Coach">
              <Button
                variant="outline"
                className="!whitespace-normal"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Practice with AI Coach
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}