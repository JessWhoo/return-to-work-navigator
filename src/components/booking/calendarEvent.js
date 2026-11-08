// Builds calendar links for a confirmed coaching booking.
// Google's event template only renders when the visitor already has a Google
// session — signed out, Google sends them to its marketing page. The .ics file
// is the reliable path: every calendar app (Google, Apple, Outlook) imports it.

export const TOPIC_LABELS = {
  return_to_work_planning: 'Return-to-work planning',
  accommodations: 'Requesting accommodations',
  workplace_disclosure: 'Disclosing to my employer',
  energy_and_fatigue: 'Energy & fatigue management',
  career_transition: 'Career transition',
  communication_and_boundaries: 'Communication & boundaries',
  emotional_support: 'Emotional support',
  other: 'Coaching session',
};

const pad = (n) => String(n).padStart(2, '0');

// requested_date (YYYY-MM-DD) + requested_time ("11:00 AM") -> event parts.
export function readSlot(booking) {
  const m = String(booking?.requested_time || '').match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!booking?.requested_date || !m) return null;

  let hours = parseInt(m[1], 10);
  const minutes = parseInt(m[2], 10);
  const period = m[3].toUpperCase();
  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;

  const datePart = booking.requested_date.replace(/-/g, '');
  const endTotal = hours * 60 + minutes + Number(booking.duration_minutes || 30);
  const topicLabel = TOPIC_LABELS[booking.topic] || 'Coaching session';
  return {
    datePart,
    topicLabel,
    title: `Coaching session — ${topicLabel}`,
    startStamp: `${datePart}T${pad(hours)}${pad(minutes)}00`,
    endStamp: `${datePart}T${pad(Math.floor(endTotal / 60) % 24)}${pad(endTotal % 60)}00`,
    details: [
      `Topic: ${topicLabel}`,
      `Format: ${booking.session_format === 'phone' ? 'Phone call' : 'Video call'}`,
      booking.calendar_meet_link ? `Join: ${booking.calendar_meet_link}` : '',
      'Booked via Back to Life, Back to Work Navigator.',
    ].filter(Boolean).join('\n'),
  };
}

export function buildGoogleCalendarUrl(booking) {
  const slot = readSlot(booking);
  if (!slot) return null;
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: slot.title,
    dates: `${slot.startStamp}/${slot.endStamp}`,
    details: slot.details,
    ctz: booking.timezone || 'UTC',
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

const escapeIcs = (text) =>
  String(text).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');

export function buildIcsFile(booking) {
  const slot = readSlot(booking);
  if (!slot) return null;
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Navigator//Coaching session//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${booking.id || slot.startStamp}@navigator`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
    // Floating local time: the time the user picked, in their own calendar.
    `DTSTART:${slot.startStamp}`,
    `DTEND:${slot.endStamp}`,
    `SUMMARY:${escapeIcs(slot.title)}`,
    `DESCRIPTION:${escapeIcs(slot.details)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return { fileName: `coaching-session-${booking.requested_date}.ics`, content: lines.join('\r\n') };
}