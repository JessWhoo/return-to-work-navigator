import { Clock, Home, Armchair, ListChecks, Coffee, MessageCircle } from 'lucide-react';

// Standard accommodations grouped by category. Each option carries a
// plain-language rationale that is woven into the generated letter.
export const ACCOMMODATION_CATEGORIES = [
  {
    id: 'schedule',
    name: 'Schedule & Hours',
    icon: Clock,
    options: [
      { id: 'flex_hours', label: 'Flexible start and end times', rationale: 'allows me to schedule around medical appointments and periods of fatigue' },
      { id: 'phased_return', label: 'Gradual (phased) return to full-time hours', rationale: 'lets me rebuild stamina steadily while maintaining consistent performance' },
      { id: 'compressed_week', label: 'Compressed work week', rationale: 'provides a built-in recovery day while preserving my total hours' },
      { id: 'intermittent_leave', label: 'Intermittent leave for treatment or follow-up care', rationale: 'ensures I can attend ongoing medical care without disrupting my role' },
      { id: 'no_early_meetings', label: 'No early-morning or late-day meetings', rationale: 'aligns demanding work with the hours when my energy is highest' },
    ],
  },
  {
    id: 'location',
    name: 'Where You Work',
    icon: Home,
    options: [
      { id: 'remote_partial', label: 'Remote work several days per week', rationale: 'reduces commuting fatigue and infection exposure' },
      { id: 'remote_full', label: 'Fully remote work for a defined period', rationale: 'supports recovery while I remain fully productive' },
      { id: 'parking', label: 'Reserved parking close to the entrance', rationale: 'minimizes physical strain at the start and end of the day' },
      { id: 'workspace_location', label: 'Workspace near a restroom or exit', rationale: 'addresses treatment-related side effects with minimal disruption' },
    ],
  },
  {
    id: 'workspace',
    name: 'Physical Workspace',
    icon: Armchair,
    options: [
      { id: 'ergonomic', label: 'Ergonomic chair or sit-stand desk', rationale: 'reduces pain and discomfort during extended desk work' },
      { id: 'quiet_space', label: 'Quieter or private workspace', rationale: 'helps me manage concentration difficulties and sensory sensitivity' },
      { id: 'temperature', label: 'Temperature control (fan, heater, or seating away from vents)', rationale: 'helps manage temperature sensitivity related to treatment' },
      { id: 'medication_storage', label: 'Access to refrigeration for medication', rationale: 'allows me to safely take medication on schedule' },
    ],
  },
  {
    id: 'duties',
    name: 'Duties & Workload',
    icon: ListChecks,
    options: [
      { id: 'reduced_physical', label: 'Temporary reduction of physically demanding tasks', rationale: 'protects my recovery while I continue my core responsibilities' },
      { id: 'reduced_travel', label: 'Reduced or no business travel for a defined period', rationale: 'limits fatigue and keeps me close to my care team' },
      { id: 'workload_review', label: 'Temporary workload adjustment with regular check-ins', rationale: 'ensures priorities stay realistic as my stamina returns' },
      { id: 'written_instructions', label: 'Written follow-up of verbal instructions', rationale: 'supports memory and focus that can be affected by treatment' },
      { id: 'deadline_flex', label: 'Flexibility on non-critical deadlines', rationale: 'accommodates unpredictable side effects without affecting key deliverables' },
    ],
  },
  {
    id: 'breaks',
    name: 'Breaks & Rest',
    icon: Coffee,
    options: [
      { id: 'extra_breaks', label: 'Additional short rest breaks', rationale: 'helps me manage fatigue and sustain focus through the day' },
      { id: 'rest_area', label: 'Access to a quiet area to rest when needed', rationale: 'allows brief recovery during periods of acute fatigue' },
      { id: 'flexible_lunch', label: 'Flexible or extended lunch break', rationale: 'accommodates medication timing and nutrition needs' },
    ],
  },
  {
    id: 'support',
    name: 'Communication & Support',
    icon: MessageCircle,
    options: [
      { id: 'single_contact', label: 'A single point of contact for accommodation questions', rationale: 'keeps communication clear and reduces repeated disclosure' },
      { id: 'review_meeting', label: 'A scheduled review of the plan after 60–90 days', rationale: 'ensures the arrangement continues to work for both of us' },
      { id: 'privacy', label: 'Confidentiality regarding my medical information', rationale: 'protects my privacy while colleagues are informed only as needed' },
    ],
  },
];

export const ALL_OPTIONS = ACCOMMODATION_CATEGORIES.flatMap((c) => c.options);

export const CONDITION_PHRASES = {
  medical: { label: 'A medical condition (no diagnosis named)', phrase: 'a medical condition' },
  cancer: { label: 'My cancer diagnosis and recovery', phrase: 'my cancer diagnosis and ongoing recovery from treatment' },
  ada: { label: 'A disability under the ADA', phrase: 'a disability as defined under the Americans with Disabilities Act (ADA)' },
};

export const DOCUMENTATION_OPTIONS = {
  attached: 'I have attached supporting documentation from my healthcare provider.',
  on_request: 'I am able to provide supporting documentation from my healthcare provider upon request.',
  none: '',
};

export const EMPTY_DETAILS = {
  name: '',
  jobTitle: '',
  company: '',
  recipientName: '',
  recipientTitle: '',
  condition: 'medical',
  startDate: '',
  durationType: 'temporary',
  durationDetail: '',
  documentation: 'on_request',
  extraContext: '',
};