import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, ChevronDown, ChevronRight } from 'lucide-react';
import { useGamification } from '../components/gamification/useGamification';
import QuickPointsDisplay from '../components/gamification/QuickPointsDisplay';
import CelebrationModal from '../components/gamification/CelebrationModal';
import LevelDisplay from '../components/gamification/LevelDisplay';
import { useUserProgress } from '@/hooks/useUserProgress';
import { checklistData, getChecklistTotalItems, getCompletedChecklistIds } from '@/components/checklist/checklistData';

export default function Checklist() {
  const queryClient = useQueryClient();
  const { trackAction, showQuickPoints, quickPointsAmount, setShowQuickPoints, celebration, setCelebration } = useGamification();
  const [expandedPhases, setExpandedPhases] = useState([0]);

  const { data: progress, isLoading } = useUserProgress({
    completed_checklist_items: [],
    journey_stage: 'planning'
  });

  const updateProgressMutation = useMutation({
    mutationFn: async ({ itemId, isChecked }) => {
      const currentItems = progress?.completed_checklist_items || [];
      const updatedItems = isChecked
        ? [...currentItems, itemId]
        : currentItems.filter(id => id !== itemId);

      return await base44.entities.UserProgress.update(progress.id, {
        completed_checklist_items: updatedItems
      });
    },
    // Optimistic update — apply locally instantly, roll back on error.
    onMutate: async ({ itemId, isChecked }) => {
      await queryClient.cancelQueries({ queryKey: ['userProgress'] });
      const previous = queryClient.getQueryData(['userProgress']);
      queryClient.setQueryData(['userProgress'], (old) => {
        if (!old) return old;
        const currentItems = old.completed_checklist_items || [];
        const updatedItems = isChecked
          ? [...currentItems, itemId]
          : currentItems.filter(id => id !== itemId);
        return { ...old, completed_checklist_items: updatedItems };
      });
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['userProgress'], context.previous);
      }
    },
    onSuccess: (_, { isChecked }) => {
      // Award points when checking (not unchecking)
      if (isChecked && progress) {
        trackAction(progress, 'checklist_complete');
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3">
          <div className="animate-spin h-12 w-12 border-4 border-rose-200 border-t-rose-600 rounded-full mx-auto" />
          <p className="text-gray-600">Loading your checklist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <QuickPointsDisplay 
        points={quickPointsAmount}
        show={showQuickPoints}
        onComplete={() => setShowQuickPoints(false)}
      />
      
      <CelebrationModal
        open={celebration.show}
        onClose={() => setCelebration({ show: false, type: 'points', data: {} })}
        type={celebration.type}
        data={celebration.data}
      />
      
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-600 to-teal-600 bg-clip-text text-transparent">
          Your Return to Work Checklist
        </h1>
        <p className="text-lg text-slate-700 max-w-2xl mx-auto">
          Use this step-by-step guide to prepare for your return to work. Check off items as you complete them.
        </p>
      </div>

      {/* Progress Overview */}
      <Card className="bg-white border-2 border-rose-200 shadow-sm">
        <CardContent className="pt-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-slate-800">Overall Progress</span>
              <span className="text-sm font-bold text-rose-600">
                {completedItems.length} of {totalItems} completed
              </span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
            <p className="text-xs text-slate-700 text-center font-medium">
              {progressPercentage.toFixed(0)}% complete
            </p>
          </div>
        </CardContent>
      </Card>
      
      {/* Gamification Level Display */}
      {progress?.gamification && (
        <LevelDisplay points={progress.gamification.total_points} compact />
      )}

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
            <Card 
              key={phaseIndex}
              className="bg-white border-2 border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all"
            >
              <CardHeader 
                className="cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => togglePhase(phaseIndex)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {isExpanded ? 
                      <ChevronDown className="h-5 w-5 text-slate-600" /> : 
                      <ChevronRight className="h-5 w-5 text-slate-600" />
                    }
                    <CardTitle className="text-xl text-slate-900">
                      {phase.phase}
                    </CardTitle>
                  </div>
                  <Badge variant="secondary" className="bg-slate-100 text-slate-800 font-bold">
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
                       <h4 className="font-semibold text-slate-900 text-lg">
                        {section.title}
                      </h4>
                      <div className="space-y-3 ml-2">
                        {section.items.map((item) => {
                          const isChecked = completedItems.includes(item.id);
                          return (
                            <div 
                              key={item.id}
                              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                            >
                              <Checkbox
                                id={item.id}
                                checked={isChecked}
                                onCheckedChange={(checked) => handleCheckboxChange(item.id, checked)}
                                className="mt-1"
                              />
                              <label
                                htmlFor={item.id}
                                className={`flex-1 text-sm leading-relaxed cursor-pointer ${
                                     isChecked ? 'line-through text-slate-500' : 'text-slate-800'
                                }`}
                              >
                                {item.text}
                              </label>
                              {isChecked && (
                                <CheckCircle2 className={`h-5 w-5 ${phase.checkClass} flex-shrink-0`} />
                              )}
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

      {/* Completion Message */}
      {progressPercentage === 100 && (
        <Card className="bg-gradient-to-r from-green-50 to-teal-50 border-2 border-green-300">
          <CardContent className="pt-6 text-center">
            <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Congratulations! 🎉</h3>
            <p className="text-slate-800 font-medium">
              You've completed all checklist items. Remember, returning to work is an ongoing journey. 
              Continue to advocate for yourself and adjust as needed.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}