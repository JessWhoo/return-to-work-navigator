import { format, parseISO, isValid } from 'date-fns';
import { CONDITION_PHRASES, DOCUMENTATION_OPTIONS } from './accommodationOptions';

const fmtDate = (iso) => {
  if (!iso) return null;
  const d = parseISO(iso);
  return isValid(d) ? format(d, 'MMMM d, yyyy') : null;
};

// Turns the user's selections and details into a complete, professionally
// worded accommodation request letter (plain text, blank-line paragraphs).
export function buildLetter(selected, d) {
  const name = d.name.trim() || '[Your Name]';
  const recipient = d.recipientName.trim() || '[Recipient Name]';
  const company = d.company.trim();
  const role = d.jobTitle.trim();
  const condition = CONDITION_PHRASES[d.condition]?.phrase || CONDITION_PHRASES.medical.phrase;
  const start = fmtDate(d.startDate);

  const header = [
    format(new Date(), 'MMMM d, yyyy'),
    '',
    recipient,
    d.recipientTitle.trim(),
    company,
  ]
    .filter((line, i) => i === 1 || line)
    .join('\n');

  const intro = `I am writing to formally request reasonable workplace accommodations${role ? ` in my role as ${role}` : ''}${company ? ` at ${company}` : ''}. Due to ${condition}, I am currently experiencing limitations that affect certain aspects of my work. With the adjustments outlined below, I am confident I can continue to perform the essential functions of my position effectively and contribute fully to the team.`;

  const list = selected
    .map((a, i) => `${i + 1}. ${a.label}${a.rationale ? ` — this ${a.rationale}.` : '.'}`)
    .join('\n');

  const durationText =
    d.durationType === 'ongoing'
      ? 'on an ongoing basis'
      : `for approximately ${d.durationDetail.trim() || '[duration]'}`;
  const timing = `I anticipate needing these accommodations ${start ? `beginning ${start} and continuing ` : ''}${durationText}. I would welcome a scheduled check-in to review how the arrangement is working and to adjust it as my recovery progresses.`;

  const documentation = DOCUMENTATION_OPTIONS[d.documentation] || '';

  const closing = `I value my role and am committed to doing my job well. I would appreciate the opportunity to discuss this request with you, and I am open to exploring alternative solutions that meet both my needs and the organization's operational requirements. Please let me know a convenient time to meet.`;

  const signature = [name, role, company].filter(Boolean).join('\n');

  return [
    header,
    'Re: Request for Reasonable Workplace Accommodation',
    `Dear ${recipient},`,
    intro,
    'Specifically, I am requesting the following accommodations:',
    list,
    d.extraContext.trim(),
    timing,
    documentation,
    closing,
    'Thank you for your time and consideration.',
    `Sincerely,\n\n${signature}`,
  ]
    .filter((p) => p && p.trim())
    .join('\n\n');
}