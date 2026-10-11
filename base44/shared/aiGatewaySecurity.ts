// Instruction text stays on the server; callers select only known IDs.
export const EMAIL_TEMPLATES = {
  accommodation_request: 'Draft a professional email requesting workplace accommodations. Include a brief mention of medical treatment (without excessive detail), specific accommodations needed (flexible schedule, remote work options, ergonomic adjustments), and express willingness to provide medical documentation. Maintain a confident yet collaborative tone.',
  return_plan: 'Draft a professional email to discuss a phased return-to-work plan. Mention readiness to return, propose a gradual schedule (e.g., part-time to full-time over several weeks), express commitment to the role, and request a meeting to discuss details. Be positive and solution-oriented.',
  accommodation_update: 'Draft a professional email providing an update on current accommodations. Thank the employer for existing support, report on progress, suggest modifications if needed (more/less support), and maintain open communication. Be appreciative and factual.',
  medical_documentation: 'Draft a brief professional email transmitting medical documentation to support accommodation requests. Reference attached documentation, reiterate key accommodations requested, offer to discuss further, and maintain privacy. Be concise and professional.',
  first_day_logistics: 'Draft a friendly yet professional email to confirm first day logistics. Ask about start time, parking, who to report to, any pre-arrival tasks, and express enthusiasm about returning. Be organized and positive.',
};
export const EMPLOYER_SCENARIOS = {
  return_to_work: 'Draft a professional email to an employer announcing a return to work after medical leave. Propose a phased return plan (e.g. part-time first two weeks, then full time), express enthusiasm, and request a meeting to align on expectations. Tone: confident, positive, solution-focused.',
  accommodation_request: 'Draft a professional email formally requesting reasonable workplace accommodations under the ADA. Include placeholders for specific accommodations (flexible schedule, remote work, ergonomic equipment). Reference willingness to provide medical documentation. Tone: assertive yet collaborative.',
  health_status_update: 'Draft a professional email updating an employer on current health status during ongoing treatment. Keep medical detail minimal, focus on work capacity and any temporary schedule impacts. Reassure them of continued commitment. Tone: professional, factual, not oversharing.',
  schedule_modification: 'Draft a professional email requesting a modified work schedule due to medical treatment appointments. Propose specific alternatives to maintain productivity (adjusted hours, remote options, swap days). Tone: practical, cooperative, solutions-oriented.',
  disclosure: 'Draft a professional email disclosing a cancer diagnosis to an employer or HR. Keep medical details minimal (do not name the cancer type unless the user specifies). Focus on upcoming treatment needs, desired privacy, and commitment to work. Tone: calm, professional, boundaried.',
  follow_up: 'Draft a professional follow-up email regarding an accommodation request that has not yet received a response. Reference the original request, express readiness to discuss, and request a meeting or written confirmation. Tone: persistent but polite.',
};

export function validEmailData(operation, data) {
  const catalog = operation === 'draft_email' ? EMAIL_TEMPLATES : EMPLOYER_SCENARIOS;
  const id = operation === 'draft_email' ? data.templateId : data.scenarioId;
  if (typeof id !== 'string' || !Object.hasOwn(catalog, id)) return false;
  const fields = operation === 'draft_email'
    ? { templateId: 80, contextInfo: 2000, recipientName: 200 }
    : { scenarioId: 80, progressContext: 2000, coachContext: 6000, extraInfo: 2000, recipientInfo: 500 };
  return Object.entries(data).every(([key, value]) => Object.hasOwn(fields, key)
    && typeof value === 'string' && value.length <= fields[key]);
}

// Best-effort sliding windows per warm instance, shared across all operations.
// Reserve synchronously before awaiting the integration, including failed calls.
const CALLS = new Map();
const HOUR = 60 * 60 * 1000;
export function retryAfter(userId) {
  const now = Date.now();
  for (const [id, times] of CALLS) {
    if (!times.length || times[times.length - 1] <= now - HOUR) CALLS.delete(id);
  }
  const recent = (CALLS.get(userId) || []).filter(t => t > now - HOUR);
  const minute = recent.filter(t => t > now - 60000);
  if (minute.length >= 20) return Math.max(1, Math.ceil((minute[0] + 60000 - now) / 1000));
  if (recent.length >= 100) return Math.max(1, Math.ceil((recent[0] + HOUR - now) / 1000));
  if (!CALLS.has(userId) && CALLS.size >= 10000) return 60;
  recent.push(now);
  CALLS.set(userId, recent);
  return 0;
}