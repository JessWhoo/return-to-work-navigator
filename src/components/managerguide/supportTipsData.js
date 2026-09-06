import { Target, CalendarClock, HeartHandshake } from 'lucide-react';

export const SUPPORT_TIPS = [
  {
    id: 'expectations',
    icon: Target,
    color: 'violet',
    title: 'Managing Expectations',
    intro: 'Recovery is not a switch that flips when treatment ends. Reset what "good performance" looks like for this season.',
    tips: [
      'Agree on priorities together: what is essential now, what can wait, and what can be reassigned.',
      'Set realistic, written goals for the first 30/60/90 days and revisit them at each check-in.',
      'Measure output and impact, not hours at a desk or speed of replies.',
      'Expect good days and bad days — plan buffers into deadlines instead of assuming a straight line.',
      'Ask "what can you handle this week?" rather than deciding for them.',
    ],
  },
  {
    id: 'medical-leave',
    icon: CalendarClock,
    color: 'sky',
    title: 'Understanding Medical Leave Impacts',
    intro: 'Leave rarely ends cleanly. Follow-up scans, ongoing therapy, and side effects continue long after the return date.',
    tips: [
      'Plan for intermittent leave: appointments, infusions, and recovery days will keep recurring.',
      'Know how FMLA, short-term disability, PTO, and ADA accommodations fit together at your company.',
      'Keep health insurance and benefits continuous — this is often the survivor’s biggest fear.',
      'Cover their work with a clear, shared plan so they don’t return to a backlog or a resentful team.',
      'Anticipate financial strain: connect them with HR benefits counselors and employee assistance programs.',
    ],
  },
  {
    id: 'inclusive-transition',
    icon: HeartHandshake,
    color: 'emerald',
    title: 'Fostering an Inclusive Transition',
    intro: 'A supportive return is a team effort. Make belonging the default, not something the survivor has to earn back.',
    tips: [
      'Offer a phased return — part-time or reduced duties building back to full capacity.',
      'Let the employee decide what the team knows and how their return is announced.',
      'Keep them in the loop on projects, decisions, and social moments while they’re out, if they want that.',
      'Train the team on respectful language: no prognosis talk, no "you look great!" pressure, no burden framing.',
      'Model flexibility openly so no one feels singled out for needing accommodations.',
    ],
  },
];