// Legal rights checklist items. IDs are prefixed with "legal:" so they can
// share the UserProgress.completed_checklist_items array without colliding
// with the main return-to-work checklist.
export const legalChecklistSections = [
  {
    id: 'legal:understand',
    title: 'Understand your rights',
    description: 'Get familiar with the core federal protections before any workplace conversation.',
    items: [
      { id: 'legal:read-ada', label: 'Review the ADA (Americans with Disabilities Act) overview' },
      { id: 'legal:read-fmla', label: 'Review the FMLA (Family and Medical Leave Act) overview' },
      { id: 'legal:read-rehab', label: 'Read about the Rehabilitation Act (federal employees)' },
      { id: 'legal:read-state', label: 'Check your state-specific protections' },
    ],
  },
  {
    id: 'legal:documents',
    title: 'Gather your documents',
    description: 'Have paperwork ready before requesting leave or accommodations.',
    items: [
      { id: 'legal:doc-diagnosis', label: 'Collect medical documentation of diagnosis and treatment' },
      { id: 'legal:doc-restrictions', label: "Get a written note of your provider's work restrictions" },
      { id: 'legal:doc-handbook', label: 'Locate your employer handbook / leave policy' },
      { id: 'legal:doc-benefits', label: 'Review short-term / long-term disability benefits' },
    ],
  },
  {
    id: 'legal:accommodations',
    title: 'Request accommodations',
    description: 'Put your accommodation request in writing and track the response.',
    items: [
      { id: 'legal:acc-identify', label: 'Identify the accommodations you need (schedule, workload, environment)' },
      { id: 'legal:acc-draft', label: 'Draft a written accommodation request' },
      { id: 'legal:acc-submit', label: 'Submit the request to HR / your manager' },
      { id: 'legal:acc-response', label: "Save the employer's written response" },
    ],
  },
  {
    id: 'legal:leave',
    title: 'FMLA / medical leave',
    description: 'Steps to take if you need protected leave.',
    items: [
      { id: 'legal:fmla-eligibility', label: 'Confirm you meet FMLA eligibility (12 months / 1,250 hours)' },
      { id: 'legal:fmla-notice', label: 'Give your employer 30 days notice when possible' },
      { id: 'legal:fmla-certification', label: 'Complete the FMLA medical certification form' },
      { id: 'legal:fmla-benefits', label: 'Confirm health benefits continue during leave' },
    ],
  },
  {
    id: 'legal:medical-acc',
    title: 'Medical & physical accommodations',
    description: 'Specific adjustments to request so your workspace and schedule support your recovery.',
    items: [
      { id: 'legal:med-ergonomic', label: 'Request ergonomic desk / chair adjustments' },
      { id: 'legal:med-schedule', label: 'Request a modified or flexible work schedule' },
      { id: 'legal:med-remote', label: 'Request remote or hybrid work options if needed' },
      { id: 'legal:med-breaks', label: 'Request additional rest breaks for fatigue management' },
      { id: 'legal:med-parking', label: 'Request accessible parking or a workspace closer to facilities' },
      { id: 'legal:med-appointments', label: 'Arrange time off for ongoing medical appointments' },
      { id: 'legal:med-equipment', label: 'Request assistive equipment (screen filters, headsets, footrests)' },
    ],
  },
  {
    id: 'legal:protect',
    title: 'Protect yourself',
    description: 'Keep a record in case something changes or goes wrong.',
    items: [
      { id: 'legal:log-conversations', label: 'Keep a dated log of workplace conversations' },
      { id: 'legal:save-emails', label: 'Save copies of relevant emails to a personal folder' },
      { id: 'legal:know-retaliation', label: 'Know the signs of retaliation and how to report them' },
      { id: 'legal:consult-attorney', label: 'Consult an employment attorney if you feel your rights are being violated' },
    ],
  },
];