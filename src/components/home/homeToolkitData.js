import { StepCompleteIcon, ScheduleIcon, MessageIcon, AddStepIcon, CompassIcon, WellbeingIcon, ProfileIcon, NeedsAttentionIcon, JourneyIcon } from '@/components/brand/BrandIcon';

export const sectionGroups = [
  { groupTitle: 'Plan & Track', groupDescription: 'Map out your return and stay on top of it.', items: [
    { title: 'My Journey Checklist', description: 'Track your progress through each phase of returning to work', icon: StepCompleteIcon, page: 'Checklist' },
    { title: 'Return Planning', description: 'Create a phased return-to-work schedule', icon: ScheduleIcon, page: 'ReturnPlanning' },
  ] },
  { groupTitle: 'Work & Career', groupDescription: 'Conversations, requests, and next opportunities.', items: [
    { title: 'Communication Tools', description: 'Templates, scripts, and guidance for workplace conversations', icon: MessageIcon, page: 'Communication' },
    { title: 'Request Accommodations', description: 'Learn about your rights and generate accommodation requests', icon: AddStepIcon, page: 'Accommodations' },
    { title: 'Job Boards', description: 'Cancer-friendly job boards, returnship programs, and remote opportunities', icon: CompassIcon, page: 'JobBoards' },
  ] },
  { groupTitle: 'Health & Support', groupDescription: 'Care for your energy and your emotional well-being.', items: [
    { title: 'Energy & Fatigue', description: 'Manage fatigue with pacing strategies and energy tracking', icon: WellbeingIcon, page: 'EnergyManagement' },
    { title: 'Emotional Support', description: 'Resources for managing anxiety and building confidence', icon: ProfileIcon, page: 'EmotionalSupport' },
  ] },
  { groupTitle: 'Rights & Legal', groupDescription: 'Know the protections that stand behind you.', items: [
    { title: 'Legal Rights', description: 'Understand ADA, FMLA, and your workplace protections', icon: NeedsAttentionIcon, page: 'LegalRights' },
  ] },
  { groupTitle: 'Learn & Connect', groupDescription: 'Guides, coaching, and stories to walk alongside you.', items: [
    { title: 'Resource Library', description: 'Access curated guides, organizations, and support services', icon: JourneyIcon, page: 'Resources' },
    { title: 'Book a Coach', description: 'Schedule a one-on-one session with a return-to-work coach at a time that works for you', icon: ScheduleIcon, page: 'CoachBooking' },
    { title: 'From the Founder', description: 'Blog posts from Jess — reflections, inspiration, and hope for the road back to work', icon: MessageIcon, page: 'Blog' },
  ] },
];