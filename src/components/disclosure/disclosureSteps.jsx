import {
  Scale,
  ClipboardList,
  Users,
  MessageSquare,
  FileCheck,
  Calendar,
  Heart,
  ShieldCheck,
} from 'lucide-react';

export const DISCLOSURE_STEPS = [
  {
    id: 'step-1',
    icon: Scale,
    title: 'Know your legal protections first',
    color: 'from-indigo-500 to-violet-600',
    summary:
      "Before saying anything, understand the laws that protect you. Cancer is generally considered a disability under the ADA — meaning you have the right to reasonable accommodations without fear of discrimination.",
    bullets: [
      'In the US, the ADA protects employees with cancer at companies with 15+ employees.',
      'The FMLA gives eligible employees up to 12 weeks of unpaid, job-protected leave per year.',
      'You are not legally required to disclose your diagnosis — only that you need an accommodation.',
      'State laws may offer additional protections (paid leave, broader anti-discrimination).',
    ],
    checklistItems: [
      'I understand the ADA and FMLA basics',
      'I checked my state and local protections',
      'I know I can request accommodations without disclosing my diagnosis',
    ],
  },
  {
    id: 'step-2',
    icon: ClipboardList,
    title: 'Decide what — and how much — to share',
    color: 'from-rose-500 to-pink-600',
    summary:
      "Disclosure is your choice. Think through what you want your employer to know, and what stays private. You can share as little or as much as feels right.",
    bullets: [
      'You can describe needs without naming the diagnosis (e.g., "a serious health condition").',
      'Decide whether to share treatment timeline, side effects, or prognosis.',
      'Consider what your team versus HR versus your manager each need to know.',
      'Think about how comfortable you are with coworkers knowing.',
    ],
    checklistItems: [
      'I decided what to disclose (full, partial, or accommodation-only)',
      'I listed who needs to know what',
      'I wrote down what I want to keep private',
    ],
  },
  {
    id: 'step-3',
    icon: Users,
    title: 'Choose who to tell — and in what order',
    color: 'from-sky-500 to-blue-600',
    summary:
      'The right person depends on your workplace. Generally, HR is the gatekeeper for formal accommodations, while your direct supervisor handles day-to-day adjustments.',
    bullets: [
      'HR: Handles formal accommodation requests, FMLA paperwork, benefits.',
      'Direct supervisor: Manages your workload, schedule, and team communication.',
      'Consider telling HR first to formalize protections, then your manager.',
      'You typically do not need to tell coworkers — that is your choice.',
    ],
    checklistItems: [
      'I identified the right HR contact',
      'I planned the order I will tell people',
      'I decided what (if anything) my team will be told',
    ],
  },
  {
    id: 'step-4',
    icon: FileCheck,
    title: 'Gather documentation before the conversation',
    color: 'from-emerald-500 to-teal-600',
    summary:
      'Bring written backup. Documentation protects you and makes accommodation requests stronger and faster to approve.',
    bullets: [
      'A note from your doctor outlining work restrictions or accommodations needed.',
      'A written list of specific accommodations you are requesting.',
      'Copies of any prior performance reviews showing your track record.',
      'Your employee handbook section on leave and accommodations.',
    ],
    checklistItems: [
      "I have a doctor's note describing my work needs",
      'I wrote out my accommodation requests',
      'I reviewed my employee handbook',
    ],
  },
  {
    id: 'step-5',
    icon: MessageSquare,
    title: 'Prepare and practice what you will say',
    color: 'from-amber-500 to-orange-600',
    summary:
      'A short script keeps you grounded. Lead with what you need from work, not with medical details. Stay calm, professional, and clear.',
    bullets: [
      'Open with the purpose: "I want to discuss some adjustments I need at work."',
      'State the situation briefly: "I am managing a serious health condition."',
      'Name the accommodation: "I am requesting [specific accommodation]."',
      'Reassure on commitment: "I am committed to my role and want to perform well."',
    ],
    checklistItems: [
      'I drafted a short script (3–5 sentences)',
      'I practiced out loud or with a trusted person',
      'I prepared answers to likely questions',
    ],
  },
  {
    id: 'step-6',
    icon: Calendar,
    title: 'Set up the meeting the right way',
    color: 'from-violet-500 to-purple-600',
    summary:
      'Where, when, and how you have the conversation matters. Private, scheduled, and documented is best.',
    bullets: [
      'Request a private meeting — not a hallway conversation.',
      'Pick a low-stress time (avoid right before a big deadline).',
      'Consider asking to bring an HR rep or trusted colleague.',
      'Take notes during the meeting or ask to follow up in writing.',
    ],
    checklistItems: [
      'I scheduled a private meeting',
      'I chose a low-stress time',
      'I planned how I will document what was said',
    ],
  },
  {
    id: 'step-7',
    icon: ShieldCheck,
    title: 'Follow up in writing — always',
    color: 'from-cyan-500 to-blue-600',
    summary:
      'After the meeting, send a written summary. This protects you legally and creates a record of what was agreed.',
    bullets: [
      'Send a same-day or next-day email summarizing what was discussed.',
      'List the accommodations approved, denied, or under review.',
      'Confirm next steps and timelines.',
      'Keep all correspondence in a personal folder (not just work email).',
    ],
    checklistItems: [
      'I sent a written follow-up email',
      'I saved a personal copy of all correspondence',
      'I confirmed next steps and review dates',
    ],
  },
  {
    id: 'step-8',
    icon: Heart,
    title: 'Take care of yourself afterward',
    color: 'from-rose-500 to-red-600',
    summary:
      'These conversations are emotionally heavy. Plan something gentle for yourself after — and remember you did something brave.',
    bullets: [
      'Build in recovery time after the meeting (no big tasks right after).',
      'Talk to someone you trust — a friend, partner, or counselor.',
      'If the response was disappointing, you have options and rights.',
      'Reach out to a survivor support group or peer mentor.',
    ],
    checklistItems: [
      'I planned a gentle activity for after the meeting',
      'I identified someone to talk to',
      'I know where to get support if things go badly',
    ],
  },
];

export const LEGAL_PROTECTIONS = [
  {
    name: 'ADA (Americans with Disabilities Act)',
    description:
      'Protects employees with cancer from discrimination and entitles you to reasonable accommodations. Applies to employers with 15+ employees.',
  },
  {
    name: 'FMLA (Family and Medical Leave Act)',
    description:
      'Up to 12 weeks of unpaid, job-protected leave per year for serious health conditions. Eligible after 12 months of employment.',
  },
  {
    name: 'Rehabilitation Act (Section 501 / 504)',
    description:
      'Protects federal employees and employees of federal contractors from disability discrimination.',
  },
  {
    name: 'GINA (Genetic Information Nondiscrimination Act)',
    description:
      'Prevents employers from using genetic information — including family medical history — in employment decisions.',
  },
  {
    name: 'State laws',
    description:
      'Many states extend further protections: paid medical leave, smaller-employer coverage, and broader anti-discrimination rules.',
  },
];