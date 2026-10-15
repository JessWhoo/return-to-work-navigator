// Shared topic list and seed Q&A content for the Ask the Experts section.

import {
  MessageCircleQuestion, Battery, Scale, Handshake, MessageSquare,
  Briefcase, Heart, Shield, HelpCircle, Star,
} from 'lucide-react';

export const TOPICS = [
  { id: 'all', label: 'All Topics', icon: MessageCircleQuestion },
  { id: 'fatigue', label: 'Fatigue & Energy', icon: Battery },
  { id: 'rights', label: 'Workplace Rights', icon: Scale },
  { id: 'accommodations', label: 'Accommodations', icon: Handshake },
  { id: 'disclosure', label: 'Disclosure', icon: Shield },
  { id: 'communication', label: 'Communication', icon: MessageSquare },
  { id: 'career_return', label: 'Career & Return', icon: Briefcase },
  { id: 'emotional_support', label: 'Emotional Support', icon: Heart },
  { id: 'insurance_benefits', label: 'Insurance & Benefits', icon: Star },
  { id: 'general', label: 'General', icon: HelpCircle },
];

export const getTopic = (id) => TOPICS.find(t => t.id === id) || TOPICS[0];

export const FEATURED_EXPERT_QAS = [
  {
    id: 'seed-ada-disclosure',
    topic: 'disclosure',
    status: 'featured',
    question: 'Do I have to tell my manager my exact cancer diagnosis to get ADA workplace accommodations?',
    question_details: 'I need a flexible start time and remote work days for ongoing fatigue and follow-up infusions, but I want to keep my medical history private.',
    answer: 'No. Under the Americans with Disabilities Act (ADA), you do not have to share your exact cancer diagnosis with your direct supervisor. You only need to provide HR or your designated leave administrator with medical documentation confirming that you have a qualifying medical condition and explaining the functional limitations and specific workplace accommodations your oncology team recommends.',
    expert_name: 'Elena Rostova, JD',
    expert_title: 'Employment Law Attorney',
    asker_name: 'Anonymous Survivor',
    helpful_count: 24,
  },
  {
    id: 'seed-fmla-intermittent',
    topic: 'rights',
    status: 'featured',
    question: 'Can I use FMLA leave a few hours at a time for oncology appointments and post-treatment fatigue?',
    question_details: 'I am returning to work full-time next month but still have lab work, scans, and days where treatment fatigue flares up.',
    answer: 'Yes. Eligible employees can take intermittent FMLA leave in blocks of hours or single days for ongoing cancer treatment, follow-up scans, oncology appointments, or severe side effects like treatment-related fatigue. Ask your oncologist to specify the expected frequency and duration of appointments and flare-ups on your FMLA medical certification form.',
    expert_name: 'Marcus Vance, MSW, LCSW',
    expert_title: 'Oncology Social Worker',
    asker_name: 'Anonymous Survivor',
    helpful_count: 19,
  },
  {
    id: 'seed-chemo-brain-accommodations',
    topic: 'accommodations',
    status: 'answered',
    question: 'What workplace accommodations help most with post-chemotherapy cognitive fog ("chemo brain")?',
    question_details: 'My job involves project management and multi-hour meetings, and I notice my short-term memory and focus drop in the afternoon.',
    answer: 'Effective ADA accommodations for post-treatment cognitive changes include receiving written agendas and action items for meetings, recording or transcribing complex briefings, blocking uninterrupted focus hours in the morning, reducing simultaneous task switching, and taking short 10-minute cognitive rest breaks in the afternoon.',
    expert_name: 'Dr. Priya Nair, PhD',
    expert_title: 'Clinical Health Psychologist',
    asker_name: 'Anonymous Survivor',
    helpful_count: 31,
  },
];