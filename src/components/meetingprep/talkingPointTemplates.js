// Starter templates for common manager-meeting scenarios.
export const SCENARIO_TEMPLATES = [
  {
    id: 'fatigue',
    name: 'Discussing Fatigue',
    description: 'Explain treatment-related fatigue and its impact on your work capacity.',
    constraints: ['Ongoing fatigue from treatment', 'Energy dips in the afternoon'],
    points: [
      "I want to be transparent: I'm managing treatment-related fatigue, which is a recognized medical effect — not a motivation issue.",
      'My focus and productivity are strongest in the morning; I\'d like to schedule demanding tasks and meetings before noon.',
      'Short scheduled breaks help me sustain output across the day rather than burning out by mid-afternoon.',
      'I\'ll flag proactively if fatigue affects a deadline so we can adjust early instead of missing commitments.',
    ],
  },
  {
    id: 'flexible_hours',
    name: 'Requesting Flexible Hours',
    description: 'Propose a flexible schedule around medical appointments and energy patterns.',
    constraints: ['Regular medical appointments', 'Variable energy through the day'],
    points: [
      'I\'d like to propose a flexible schedule: the same total hours, arranged around my medical appointments and peak energy times.',
      'For example, starting later on treatment days and making up time when I\'m at my best keeps my output consistent.',
      'I can share my appointment calendar in advance so coverage is never a surprise for the team.',
      'I suggest we trial this for 4–6 weeks and review together what\'s working.',
    ],
  },
  {
    id: 'gradual_return',
    name: 'Gradual Return to Work',
    description: 'Outline a phased return plan that ramps hours and responsibilities up safely.',
    constraints: ['Reduced stamina after leave', 'Doctor recommends phased return'],
    points: [
      'My care team recommends a phased return — starting at reduced hours and stepping up over several weeks.',
      'Phase 1: half days focused on core responsibilities; Phase 2: 3–4 full days; Phase 3: full schedule as stamina allows.',
      'I\'d like to agree on which responsibilities are priority during the ramp-up and which can be temporarily delegated.',
      'Regular check-ins (weekly at first) will let us adjust the plan based on how my recovery is going.',
    ],
  },
];

export const CONSTRAINT_OPTIONS = [
  'Ongoing fatigue from treatment',
  'Regular medical appointments',
  'Reduced stamina / need for breaks',
  'Difficulty concentrating (chemo brain)',
  'Physical limitations (lifting, standing)',
  'Need to work from home some days',
  'Immune system precautions',
];