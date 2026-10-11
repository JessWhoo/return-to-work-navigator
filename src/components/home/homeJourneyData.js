import { checklistData, getPhaseItems } from '@/components/checklist/checklistData';

const sections = checklistData[0].sections;
export const journeyMilestones = [
  { label: 'EXPLORE', description: 'Understand your options.', path: '/LegalRights', ids: sections.slice(0, 2).flatMap(section => section.items.map(item => item.id)) },
  { label: 'PLAN', description: 'Set goals and prepare.', path: '/ReturnPlanning', ids: sections[2].items.map(item => item.id) },
  { label: 'BUILD', description: 'Gain skills and confidence.', path: '/CommunicationToolkit', ids: sections[3].items.map(item => item.id) },
  { label: 'RETURN', description: 'Take action and transition.', path: '/Checklist', ids: getPhaseItems(checklistData[1]).map(item => item.id) },
  { label: 'THRIVE', description: 'Keep growing and moving forward.', path: '/ProgressDashboard', ids: getPhaseItems(checklistData[2]).map(item => item.id) },
];

export function getJourneyMilestones(progress) {
  const completed = new Set(progress?.completed_checklist_items || []);
  const milestones = journeyMilestones.map(step => ({ ...step, count: step.ids.filter(id => completed.has(id)).length }));
  // The five visual milestones do not change the four saved journey-stage values.
  // Completed states come only from their actual, existing checklist items.
  const current = progress?.journey_stage === 'planning' ? milestones.slice(0, 3).findIndex(step => step.count < step.ids.length)
    : progress?.journey_stage === 'first_week' ? 3 : progress?.journey_stage === 'ongoing' ? 4 : -1;
  return milestones.map((step, index) => ({ ...step, state: !progress ? 'unknown' : step.count === step.ids.length ? 'done' : index === current ? 'current' : 'upcoming' }));
}