import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle, ChevronDown, ChevronRight } from 'lucide-react';

const checklistData = [
  {
    phase: 'Phase 1: Before Returning to Work',
    color: 'rose',
    sections: [
      {
        title: 'Medical Considerations',
        items: [
          { id: 'med_1', text: 'Consult with your healthcare team about readiness to return to work' },
          { id: 'med_2', text: 'Obtain medical documentation about work restrictions or needed accommodations' },
          { id: 'med_3', text: 'Plan for follow-up medical appointments' },
          { id: 'med_4', text: 'Understand potential side effects that might affect work performance' }
        ]
      },
      {
        title: 'Legal and Benefits Review',
        items: [
          { id: 'legal_1', text: 'Review your legal rights under ADA, FMLA, and state laws' },
          { id: 'legal_2', text: 'Review your employee benefits (health insurance, disability, etc.)' },
          { id: 'legal_3', text: 'Review company policies on return-to-work and accommodations' }
        ]
      },
      {
        title: 'Communication with Employer',
        items: [
          { id: 'comm_1', text: 'Notify employer of your intent to return to work' },
          { id: 'comm_2', text: 'Request necessary accommodations' },
          { id: 'comm_3', text: 'Discuss return-to-work schedule (gradual return, part-time, etc.)' },
          { id: 'comm_4', text: 'Discuss privacy concerns and what will be shared with coworkers' }
        ]
      },
      {
        title: 'Personal Preparation',
        items: [
          { id: 'prep_1', text: 'Evaluate your physical and emotional readiness' },
          { id: 'prep_2', text: 'Practice your commute and work routine' },
          { id: 'prep_3', text: 'Prepare responses for questions about your absence or condition' },
          { id: 'prep_4', text: 'Organize comfortable work clothing that accommodates your needs' },
          { id: 'prep_5', text: 'Set up your personal support system' }
        ]
      }
    ]
  },
  {
    phase: 'Phase 2: First Week Back at Work',
    color: 'teal',
    sections: [
      {
        title: 'First Day',
        items: [
          { id: 'first_1', text: 'Arrive early to reorient yourself to the workplace' },
          { id: 'first_2', text: 'Meet with your supervisor to discuss expectations and accommodations' },
          { id: 'first_3', text: 'Set up your workspace with any needed accommodations' },
          { id: 'first_4', text: 'Pace yourself and take breaks as needed' }
        ]
      },
      {
        title: 'Throughout the Week',
        items: [
          { id: 'week_1', text: 'Track your energy levels throughout the day' },
          { id: 'week_2', text: 'Note any adjustments needed to your accommodations' },
          { id: 'week_3', text: 'Prioritize essential tasks and delegate if possible' },
          { id: 'week_4', text: 'Document any challenges or issues that arise' }
        ]
      },
      {
        title: 'Self-Care',
        items: [
          { id: 'care_1', text: 'Schedule rest periods before and after work' },
          { id: 'care_2', text: 'Maintain good nutrition and hydration' },
          { id: 'care_3', text: 'Monitor your emotional responses to being back at work' },
          { id: 'care_4', text: 'Seek support from your personal network or professionals as needed' }
        ]
      }
    ]
  },
  {
    phase: 'Phase 3: Ongoing Adjustment (First Month and Beyond)',
    color: 'purple',
    sections: [
      {
        title: 'Regular Check-ins',
        items: [
          { id: 'check_1', text: 'Schedule regular check-ins with your supervisor' },
          { id: 'check_2', text: 'Meet with HR if needed to assess accommodations' },
          { id: 'check_3', text: 'Maintain communication with your healthcare team about work impact' }
        ]
      },
      {
        title: 'Adjustment and Advocacy',
        items: [
          { id: 'adjust_1', text: 'Refine accommodations based on experience' },
          { id: 'adjust_2', text: 'Advocate for your needs as they change' },
          { id: 'adjust_3', text: 'Adjust workload and responsibilities as appropriate' },
          { id: 'adjust_4', text: 'Recognize and respect your limits' }
        ]
      },
      {
        title: 'Long-term Considerations',
        items: [
          { id: 'long_1', text: 'Reassess career goals and plans if needed' },
          { id: 'long_2', text: 'Consider skill development or training needs' },
          { id: 'long_3', text: 'Focus on work-life balance and self-care routines' },
          { id: 'long_4', text: 'Consider connecting with other cancer survivors who have returned to work' }
        ]
      }
    ]
  }
];

export default function Checklist() {
  const queryClient = useQueryClient();
  const [expandedPhases, setExpandedPhases] = useState([0]);

  const { data: progress, isLoading } = useQuery({
    queryKey: ['userProgress'],
    queryFn: async () => {
      const progressList = await base44.entities.UserProgress.list();
      if (progressList.length > 0) return progressList[0];
      
      const newProgress = await base44.entities.UserProgress.create({
        completed_checklist_items: [],
        journey_stage: 'planning'
      });
      return newProgress;
    }
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
    onSuccess: () => {
      queryClient.invalidateQueries(['userProgress']);
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

  const completedItems = progress?.completed_checklist_items || [];
  const totalItems = checklistData.reduce((sum, phase) => 
    sum + phase.sections.reduce((sectionSum, section) => 
      sectionSum + section.items.length, 0
    ), 0
  );
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
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-600 to-teal-600 bg-clip-text text-transparent">
          Your Return to Work Checklist
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Use this step-by-step guide to prepare for your return to work. Check off items as you complete them.
        </p>
      </div>

      {/* Progress Overview */}
      <Card className="bg-white/80 backdrop-blur-sm border-rose-200">
        <CardContent className="pt-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Overall Progress</span>
              <span className="text-sm font-bold text-rose-600">
                {completedItems.length} of {totalItems} completed
              </span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
            <p className="text-xs text-gray-500 text-center">
              {progressPercentage.toFixed(0)}% complete
            </p>
          </div>
        </CardContent>
      </Card>

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
              className="bg-white/80 backdrop-blur-sm border-2 hover:shadow-lg transition-all"
            >
              <CardHeader 
                className="cursor-pointer hover:bg-gray-50/50 transition-colors"
                onClick={() => togglePhase(phaseIndex)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {isExpanded ? 
                      <ChevronDown className="h-5 w-5 text-gray-500" /> : 
                      <ChevronRight className="h-5 w-5 text-gray-500" />
                    }
                    <CardTitle className="text-xl">
                      <span className={`bg-gradient-to-r from-${phase.color}-600 to-${phase.color}-700 bg-clip-text text-transparent`}>
                        {phase.phase}
                      </span>
                    </CardTitle>
                  </div>
                  <Badge variant="secondary" className="bg-gray-100">
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
                      <h4 className={`font-semibold text-${phase.color}-700 text-lg`}>
                        {section.title}
                      </h4>
                      <div className="space-y-3 ml-2">
                        {section.items.map((item) => {
                          const isChecked = completedItems.includes(item.id);
                          return (
                            <div 
                              key={item.id}
                              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50/50 transition-colors"
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
                                  isChecked ? 'line-through text-gray-500' : 'text-gray-700'
                                }`}
                              >
                                {item.text}
                              </label>
                              {isChecked && (
                                <CheckCircle2 className={`h-5 w-5 text-${phase.color}-600 flex-shrink-0`} />
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
        <Card className="bg-gradient-to-r from-green-50 to-teal-50 border-green-200">
          <CardContent className="pt-6 text-center">
            <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Congratulations! 🎉</h3>
            <p className="text-gray-700">
              You've completed all checklist items. Remember, returning to work is an ongoing journey. 
              Continue to advocate for yourself and adjust as needed.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}