import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, ChevronDown, ChevronRight } from 'lucide-react';
import { useUserProgress } from '@/hooks/useUserProgress';
import { checklistData, getChecklistTotalItems, getCompletedChecklistIds, getPhaseItems } from '@/components/checklist/checklistData';
import ChecklistQuickStart from '@/components/checklist/ChecklistQuickStart';
import { Button } from '@/components/ui/button';
import useSEO from '@/hooks/useSEO';
import { Link } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';

const MARKS_STORAGE_KEY = 'nv_checklist_item_marks';
function readItemMarks() {
  try { return JSON.parse(localStorage.getItem(MARKS_STORAGE_KEY) || '{}'); }
  catch { return {}; }
}

export default function Checklist({ embedded = false }) {
  useSEO({
    title: 'Return-to-Work Preparation Checklist',
    description:
      'Interactive preparation checklist for navigating work after cancer: medical clearance, HR conversations, schedule planning, and pacing.',
    path: '/Checklist',
    enabled: !embedded,
  });
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [expandedPhases, setExpandedPhases] = useState([0]);
  const [showFullChecklist, setShowFullChecklist] = useState(false);
  const [itemMarks, setItemMarks] = useState(readItemMarks);

  const handleSetMark = (itemId, mark) => {
    setItemMarks((prev) => {
      const next = { ...prev };
      if (!mark) delete next[itemId];
      else next[itemId] = mark;
      try { localStorage.setItem(MARKS_STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const allChecklistItems = checklistData.flatMap(getPhaseItems);

  const { data: progress, isLoading } = useUserProgress({
    completed_checklist_items: [],
    journey_stage: 'planning'
  });

  const updateProgressMutation = useMutation({
    mutationFn: async (/** @type {{ itemId: string, isChecked: boolean }} */ { itemId, isChecked }) => {
      const currentItems = progress?.completed_checklist_items || [];
      const updatedItems = isChecked
        ? [...currentItems, itemId]
        : currentItems.filter(id => id !== itemId);

      // When no UserProgress record exists yet (a just-registered user whose
      // record hasn't been created, or a guest session), create one carrying
      // this completion instead of calling update(undefined) and losing the
      // mark.
      if (progress?.id) {
        return await base44.entities.UserProgress.update(progress.id, {
          completed_checklist_items: updatedItems
        });
      }
      return await base44.entities.UserProgress.create({
        completed_checklist_items: updatedItems,
        journey_stage: 'planning'
      });
    },
    // Optimistic update — apply locally instantly, roll back on error.
    onMutate: async (/** @type {{ itemId: string, isChecked: boolean }} */ { itemId, isChecked }) => {
      await queryClient.cancelQueries({ queryKey: ['userProgress'] });
      const previous = queryClient.getQueryData(['userProgress']);
      queryClient.setQueryData(['userProgress'], (old) => {
        // Fall back to a base object so the checkbox still reflects the click
        // before a record exists, rather than no-oping on a null cache.
        const base = /** @type {any} */ (old) || { completed_checklist_items: [], journey_stage: 'planning' };
        const currentItems = base.completed_checklist_items || [];
        const updatedItems = isChecked
          ? [...currentItems, itemId]
          : currentItems.filter(id => id !== itemId);
        return { ...base, completed_checklist_items: updatedItems };
      });
      return { previous };
    },
    onError: (_err, _vars, context) => {
      // Roll back only when there was a prior cache. A guest with no cached
      // record (previous === undefined) keeps the optimistic local state so
      // the checkbox still reflects the click.
      if (context?.previous !== undefined) {
        queryClient.setQueryData(['userProgress'], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['userProgress'] });
    }
  });

  const handleCheckboxChange = (itemId, checked) => {
    updateProgressMutation.mutate({ itemId, isChecked: checked });
  };

  const togglePhase = (index) => {
    setExpandedPhases(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  // Count only this checklist's ids — the same UserProgress array also holds
  // Legal Rights and Disclosure Guide items.
  const completedItems = getCompletedChecklistIds(progress?.completed_checklist_items);
  const totalItems = getChecklistTotalItems();
  const progressPercentage = totalItems > 0 ? (completedItems.length / totalItems) * 100 : 0;

  const HeadingTag = embedded ? 'h2' : 'h1';

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="space-y-3 text-center">
          <HeadingTag className="font-heading text-3xl font-bold text-brand-text sm:text-4xl">
            Your return-to-work preparation checklist
          </HeadingTag>
          <p className="max-w-2xl mx-auto text-brand-muted-foreground">
            Choose one item that feels useful today. You do not need to complete everything at once, and some items may not apply to you.
          </p>
        </div>
        <div className="flex items-center justify-center min-h-[240px]">
          <div className="text-center space-y-3">
            <div className="animate-spin h-12 w-12 border-4 border-brand-border border-t-brand-primary rounded-full mx-auto" />
            <p className="text-brand-muted-foreground">Loading your checklist...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-3 text-center">
        <HeadingTag className="font-heading text-3xl font-bold text-brand-text sm:text-4xl">
          Your return-to-work preparation checklist
        </HeadingTag>
        <p className="max-w-2xl mx-auto text-brand-muted-foreground">
          Choose one item that feels useful today. You do not need to complete everything at once, and some items may not apply to you.
        </p>
        {!isAuthenticated && (
          <p className="text-xs text-brand-muted-foreground">
            Viewing as a guest.{' '}
            <Link to="/register" className="font-semibold text-brand-primary underline underline-offset-4">
              Create a free account
            </Link>{' '}
            to save your progress across visits.
          </p>
        )}
      </div>

      {/* Short Opening View vs Full Checklist */}
      {!showFullChecklist ? (
        <ChecklistQuickStart
          allItems={allChecklistItems}
          completedItems={completedItems}
          itemMarks={itemMarks}
          onToggleComplete={handleCheckboxChange}
          onSetMark={handleSetMark}
          onShowFull={() => setShowFullChecklist(true)}
        />
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-brand-muted-foreground">
              Showing all {totalItems} items across {checklistData.length} phases.
            </p>
            <Button variant="ghost" size="sm" onClick={() => setShowFullChecklist(false)}>
              Back to 3 suggested prompts
            </Button>
          </div>

          {/* Progress Overview */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="nv-eyebrow">Overall progress</span>
                  <span className="text-sm font-bold text-brand-primary">
                    {completedItems.length} of {totalItems} completed
                  </span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
                <p className="text-center text-xs font-semibold text-brand-muted-foreground">
                  {progressPercentage.toFixed(0)}% checked
                  {Object.values(itemMarks).filter(m => m === 'revisit_later').length > 0 &&
                    ` · ${Object.values(itemMarks).filter(m => m === 'revisit_later').length} to revisit later`}
                  {Object.values(itemMarks).filter(m => m === 'not_relevant').length > 0 &&
                    ` · ${Object.values(itemMarks).filter(m => m === 'not_relevant').length} marked not relevant`}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Straightforward Phase Summary */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {checklistData.map((phase, idx) => {
          const phaseItems = phase.sections.flatMap(s => s.items);
          const doneCount = phaseItems.filter(item => completedItems.includes(item.id)).length;
          return (
            <button
              key={phase.phase}
              type="button"
              onClick={() => {
                if (!expandedPhases.includes(idx)) {
                  setExpandedPhases(prev => [...prev, idx]);
                }
              }}
              className="nv-card p-4 text-left transition-colors hover:bg-brand-muted"
            >
              <span className="nv-eyebrow nv-eyebrow--primary">Phase {idx + 1}</span>
              <p className="mt-1 font-heading text-sm font-bold text-brand-text line-clamp-1">
                {phase.phase.replace(/^Phase \d+:\s*/, '')}
              </p>
              <p className="mt-2 text-xs font-semibold text-brand-muted-foreground">
                {doneCount} of {phaseItems.length} completed
              </p>
            </button>
          );
        })}
      </div>

      {/* Checklist Phases */}
      <div className="space-y-6">
        {checklistData.map((phase, phaseIndex) => {
          const isExpanded = expandedPhases.includes(phaseIndex);
          const phaseItems = phase.sections.flatMap(s => s.items);
          const phaseCompleted = phaseItems.filter(item => 
            completedItems.includes(item.id)
          ).length;
          const phaseProgress = (phaseCompleted / phaseItems.length) * 100;

          return (
            <Card key={phaseIndex}>
              <CardHeader 
                role="button"
                tabIndex={0}
                aria-expanded={isExpanded}
                className="cursor-pointer transition-colors hover:bg-brand-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                onClick={() => togglePhase(phaseIndex)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    togglePhase(phaseIndex);
                  }
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {isExpanded ? 
                      <ChevronDown className="h-5 w-5 text-brand-muted-foreground" /> : 
                      <ChevronRight className="h-5 w-5 text-brand-muted-foreground" />
                    }
                    <CardTitle className="font-heading text-xl text-brand-text">
                      {phase.phase}
                    </CardTitle>
                  </div>
                  <Badge variant="secondary" className="bg-brand-muted font-semibold text-brand-text">
                    {phaseCompleted}/{phaseItems.length}
                  </Badge>
                </div>
                {!isExpanded && (
                  <Progress value={phaseProgress} className="h-2 mt-3" />
                )}
              </CardHeader>

              {isExpanded && (
                <CardContent className="space-y-6 pt-0">
                  <Progress value={phaseProgress} className="h-2" />
                  
                  {phase.sections.map((section, sectionIndex) => (
                    <div key={sectionIndex} className="space-y-3">
                      <h4 className="font-heading text-lg font-bold text-brand-text">
                        {section.title}
                      </h4>
                      <div className="space-y-3 ml-2">
                        {section.items.map((item) => {
                          const isChecked = completedItems.includes(item.id);
                          const mark = itemMarks[item.id];
                          return (
                            <div 
                              key={item.id}
                              className="rounded-brand p-3 transition-colors hover:bg-brand-muted space-y-2"
                            >
                              <div className="flex items-start space-x-3">
                                <Checkbox
                                  id={item.id}
                                  checked={isChecked}
                                  onCheckedChange={(checked) => handleCheckboxChange(item.id, checked)}
                                  className="mt-1"
                                />
                                <label
                                  htmlFor={item.id}
                                  className={`flex-1 cursor-pointer text-sm ${
                                    isChecked
                                      ? 'line-through text-brand-muted-foreground'
                                      : mark === 'not_relevant'
                                        ? 'italic text-brand-muted-foreground'
                                        : 'text-brand-text'
                                  }`}
                                >
                                  {item.text}
                                </label>
                                {/* Fixed-width slot: the icon appearing must not reflow the list below. */}
                                <span className="w-5 flex-shrink-0">
                                  {isChecked && (
                                    <CheckCircle2 className={`h-5 w-5 ${phase.checkClass}`} />
                                  )}
                                </span>
                              </div>
                              <div className="flex flex-wrap items-center gap-2 pl-7">
                                <button
                                  type="button"
                                  onClick={() => handleSetMark(item.id, mark === 'revisit_later' ? null : 'revisit_later')}
                                  aria-pressed={mark === 'revisit_later'}
                                  className={`rounded-pill border px-2.5 py-0.5 text-xs font-semibold transition-colors ${
                                    mark === 'revisit_later'
                                      ? 'border-brand-primary bg-brand-primary text-brand-on-primary'
                                      : 'border-brand-border bg-brand-surface text-brand-muted-foreground hover:bg-brand-background'
                                  }`}
                                >
                                  Revisit later
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleSetMark(item.id, mark === 'not_relevant' ? null : 'not_relevant')}
                                  aria-pressed={mark === 'not_relevant'}
                                  className={`rounded-pill border px-2.5 py-0.5 text-xs font-semibold transition-colors ${
                                    mark === 'not_relevant'
                                      ? 'border-brand-primary bg-brand-muted text-brand-text'
                                      : 'border-brand-border bg-brand-surface text-brand-muted-foreground hover:bg-brand-background'
                                  }`}
                                >
                                  Not relevant
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

          {/* Completion message — a plain progress acknowledgement, never a readiness claim */}
          {progressPercentage === 100 && (
            <Card className="nv-card--muted">
              <CardContent className="pt-6 text-center">
                <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-brand-primary" />
                <h3 className="mb-2 font-heading text-2xl font-bold text-brand-text">All items checked</h3>
                <p className="font-medium text-brand-text">
                  You have checked every item on this list. Checking items helps organize your questions,
                  and does not determine medical or personal readiness—continue to discuss timing and support with your healthcare team.
                </p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}