import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { MessageSquare, Sparkles, ArrowRight, RefreshCw } from 'lucide-react';
import { DISCLOSURE_STEPS } from '@/components/disclosure/disclosureSteps';
import StepCard from '@/components/disclosure/StepCard';
import LegalProtectionsCard from '@/components/disclosure/LegalProtectionsCard';

const STORAGE_KEY = 'disclosure_checklist_v1';

export default function DisclosureGuide() {
  const [checkedItems, setCheckedItems] = useState([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setCheckedItems(JSON.parse(saved));
    } catch (e) {
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
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-3"
      >
        <span className="inline-block text-xs font-extrabold uppercase tracking-wider text-rose-600 bg-rose-100 border-2 border-rose-300 px-3 py-1 rounded-full">
          Step-by-step guide
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-rose-600 via-violet-600 to-sky-700 bg-clip-text text-transparent">
          Telling Your Employer
        </h1>
        <p className="text-lg font-medium text-slate-800 max-w-2xl mx-auto leading-relaxed">
          A confident, protected path to disclosing a cancer diagnosis at work —
          with clear steps and a checklist so you never go in unprepared.
        </p>
      </motion.div>

      {/* Progress */}
      <Card className="bg-white border-2 border-slate-300 shadow-md">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wider text-slate-600">
                Your Preparation
              </p>
              <p className="text-2xl font-extrabold text-slate-900">
                {checkedItems.length} of {totalItems} items complete
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={reset}
              className="border-2 border-slate-300 font-semibold"
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
              Reset
            </Button>
          </div>
          <Progress value={progressPct} className="h-3" />
          <p className="text-sm font-semibold text-slate-700 mt-2">
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
      <Card className="bg-gradient-to-br from-rose-100 via-violet-100 to-sky-100 border-2 border-rose-300 shadow-xl">
        <CardContent className="p-8 text-center space-y-4">
          <Sparkles className="h-10 w-10 text-rose-600 mx-auto" />
          <h2 className="text-2xl font-extrabold text-slate-900">
            Ready to draft your message?
          </h2>
          <p className="text-slate-800 font-medium max-w-xl mx-auto">
            Use the Communication Toolkit to turn your plan into a professional
            email — or rehearse with the AI Coach first.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/CommunicationToolkit">
              <Button className="bg-gradient-to-r from-rose-500 to-violet-600 hover:from-rose-600 hover:to-violet-700 text-white font-bold shadow-lg">
                Draft an Email
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <Link to="/Coach">
              <Button
                variant="outline"
                className="border-2 border-sky-600 text-sky-700 hover:bg-sky-50 font-bold"
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