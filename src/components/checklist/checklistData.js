// Single source of truth for the return-to-work checklist.
//
// Every view that counts checklist items (the Checklist page and the Progress
// Dashboard) reads this module. Keeping one copy means the totals and the
// completion percentages can never disagree between views again.
//
// Item ids are stored in UserProgress.completed_checklist_items, so NEVER
// rename or reuse an id — add new ids instead.

export const checklistData = [
  {
    phase: 'Phase 1: Before Returning to Work',
    color: 'rose',
    checkClass: 'text-rose-600',
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
    checkClass: 'text-teal-600',
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
    checkClass: 'text-purple-600',
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

// Every item in a phase, flattened across its sections.
export const getPhaseItems = (phase) => phase.sections.flatMap((section) => section.items);

// Total number of checklist items across all phases.
export const getChecklistTotalItems = () =>
  checklistData.reduce((total, phase) => total + getPhaseItems(phase).length, 0);

// IDs of the items the user has completed, restricted to the ids that still
// exist in the checklist (so the count can never exceed the total).
export const getCompletedChecklistIds = (completedIds = []) => {
  const validIds = new Set(checklistData.flatMap((phase) => getPhaseItems(phase).map((item) => item.id)));
  return completedIds.filter((id) => validIds.has(id));
};