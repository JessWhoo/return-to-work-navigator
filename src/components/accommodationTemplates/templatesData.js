// Pre-written accommodation request templates. Placeholders use {{key}} and
// are replaced with the user's answers (or shown as [Label] when left blank).
// NOTE: strings are double-quoted on purpose (no template literals).

export const FIELDS = [
  { key: "name", label: "Your name" },
  { key: "job_title", label: "Your job title" },
  { key: "hr_name", label: "HR contact name" },
  { key: "company", label: "Company" },
  { key: "start_date", label: "Start date" },
  { key: "duration", label: "How long (e.g. 3 months)" },
];

const CLOSING = [
  "",
  "I am happy to provide supporting documentation from my healthcare provider and would welcome a conversation about how to make this work for both of us. I would appreciate a response within 10 business days.",
  "",
  "Thank you for your time and support.",
  "",
  "Sincerely,",
  "{{name}}",
  "{{job_title}}",
];

const build = (subject, paragraphs) =>
  ["Subject: " + subject, "", "Dear {{hr_name}},", ""].concat(paragraphs, CLOSING).join("\n");

export const TEMPLATE_CATEGORIES = ["Schedule", "Location", "Workspace", "Leave", "Follow-up"];

export const TEMPLATES = [
  {
    id: "flex-schedule",
    category: "Schedule",
    title: "Flexible start and end times",
    summary: "Shift hours around treatment, follow-ups, and your best energy window.",
    body: build("Request for flexible work hours", [
      "I am writing to request a reasonable accommodation under the Americans with Disabilities Act (ADA) as I return to my role as {{job_title}} at {{company}}.",
      "Because of ongoing effects from my cancer treatment, I am requesting flexible start and end times beginning {{start_date}} for {{duration}}. Fatigue and medical appointments make a fixed schedule difficult, but I can perform the essential functions of my job and meet my commitments with this adjustment. I would be glad to agree on core hours when I will always be available.",
    ]),
  },
  {
    id: "phased-return",
    category: "Schedule",
    title: "Phased return to full-time hours",
    summary: "Build back to a full schedule gradually.",
    body: build("Request for a phased return to work", [
      "Thank you for supporting my return to {{company}}. I am writing to request a gradual return to full-time hours as a reasonable accommodation.",
      "Starting {{start_date}}, I would like to begin with reduced hours and increase them step by step over {{duration}}, reviewing progress with you regularly. This approach lets me rebuild stamina while keeping my work in my role as {{job_title}} consistent and reliable. I am glad to propose a week-by-week plan for your review.",
    ]),
  },
  {
    id: "remote-work",
    category: "Location",
    title: "Remote or hybrid work",
    summary: "Work from home to reduce commuting fatigue and infection exposure.",
    body: build("Request to work remotely", [
      "I am writing to request a reasonable accommodation to work remotely as I continue my recovery.",
      "Commuting and a full day on site are currently draining, and my treatment has lowered my resistance to infection. I am requesting to work from home starting {{start_date}} for {{duration}}, with in-person attendance for key meetings as needed. I have the tools to stay fully productive and reachable in my role as {{job_title}}.",
    ]),
  },
  {
    id: "rest-breaks",
    category: "Workspace",
    title: "Rest breaks and energy management",
    summary: "Short scheduled breaks and a quiet place to rest.",
    body: build("Request for rest breaks", [
      "I am requesting a reasonable accommodation of short, scheduled rest breaks during the workday, along with access to a quiet space.",
      "Cancer-related fatigue affects my stamina and concentration during long stretches. Brief breaks allow me to sustain quality work throughout the day. I would like this arrangement to begin {{start_date}} and continue for {{duration}}, after which we can review whether it is still needed.",
    ]),
  },
  {
    id: "workspace-ergonomic",
    category: "Workspace",
    title: "Ergonomic or adjusted workspace",
    summary: "Seating, desk, parking, or temperature adjustments.",
    body: build("Request for workspace adjustments", [
      "I am writing to request adjustments to my workspace as a reasonable accommodation.",
      "Because of lingering physical effects of my treatment, I would benefit from: [list items, e.g. ergonomic chair, sit-stand desk, parking near the entrance, a workspace away from drafts or noise]. These changes will help me work comfortably and productively as {{job_title}}. I would like them in place by {{start_date}}.",
    ]),
  },
  {
    id: "cognitive-support",
    category: "Workspace",
    title: "Support for memory and focus",
    summary: "Written instructions, deadline flexibility, and fewer interruptions.",
    body: build("Request for support with focus and memory", [
      "I am requesting reasonable accommodations to help with concentration and memory difficulties related to my treatment, sometimes called chemo brain.",
      "Specifically, I would find it helpful to receive key instructions and meeting follow-ups in writing, to have advance notice of deadline changes, and to have some uninterrupted focus time each day. I would like these supports beginning {{start_date}} for {{duration}}, and I expect them to help me deliver consistent work as {{job_title}}.",
    ]),
  },
  {
    id: "intermittent-leave",
    category: "Leave",
    title: "Time off for appointments and treatment",
    summary: "Intermittent leave or schedule flexibility for medical care.",
    body: build("Request for intermittent leave for medical appointments", [
      "I am writing to request intermittent leave, under the Family and Medical Leave Act (FMLA) where I am eligible and as a reasonable accommodation under the ADA, for ongoing medical appointments and follow-up care.",
      "I expect to need time away for appointments beginning {{start_date}} and continuing for {{duration}}. I will give as much advance notice as possible and will coordinate with my team so my responsibilities as {{job_title}} are covered.",
    ]),
  },
  {
    id: "follow-up",
    category: "Follow-up",
    title: "Follow up on a pending request",
    summary: "A polite nudge when you have not heard back.",
    body: build("Following up on my accommodation request", [
      "I am following up on the accommodation request I submitted on [date of original request]. I want to make sure you have everything you need from me to move forward.",
      "Because the accommodation would support my work as {{job_title}}, a timely decision would be very helpful. Please let me know if any additional information, including documentation from my healthcare provider, would speed up the process.",
    ]),
  },
];

export function fillTemplate(body, values) {
  const labels = {};
  FIELDS.forEach((f) => { labels[f.key] = f.label; });
  return body.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    const v = (values[key] || "").trim();
    return v ? v : "[" + (labels[key] || key) + "]";
  });
}