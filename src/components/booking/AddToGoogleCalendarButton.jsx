import React from 'react';
import { Button } from '@/components/ui/button';
import { CalendarPlus } from 'lucide-react';

const TOPIC_LABELS = {
  return_to_work_planning: 'Return-to-work planning',
  accommodations: 'Requesting accommodations',
  workplace_disclosure: 'Disclosing to my employer',
  energy_and_fatigue: 'Energy & fatigue management',
  career_transition: 'Career transition',
  communication_and_boundaries: 'Communication & boundaries',
  emotional_support: 'Emotional support',
  other: 'Coaching session',
};

// Builds a Google Calendar "add event" template URL from a booking.
function buildGoogleCalendarUrl(booking) {
  const m = String(booking.requested_time || '').match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!booking.requested_date || !m) return null;

  let h = parseInt(m[1], 10);
  const min = parseInt(m[2], 10);
  const period = m[3].toUpperCase();
  if (period === 'PM' && h !== 12) h += 12;
  if (period === 'AM' && h === 12) h = 0;

  const datePart = booking.requested_date.replace(/-/g, '');
  const pad = (n) => String(n).padStart(2, '0');
  const start = `${datePart}T${pad(h)}${pad(min)}00`;
  const endTotal = h * 60 + min + Number(booking.duration_minutes || 30);
  const end = `${datePart}T${pad(Math.floor(endTotal / 60))}${pad(endTotal % 60)}00`;

  const topicLabel = TOPIC_LABELS[booking.topic] || 'Coaching session';
  const details = [
    `Topic: ${topicLabel}`,
    `Format: ${booking.session_format === 'phone' ? 'Phone call' : 'Video call'}`,
    booking.calendar_meet_link ? `Join: ${booking.calendar_meet_link}` : '',
    'Booked via Back to Life, Back to Work Navigator.',
  ].filter(Boolean).join('\n');

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `Coaching session — ${topicLabel}`,
    dates: `${start}/${end}`,
    details,
    ctz: booking.timezone || 'UTC',
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export default function AddToGoogleCalendarButton({ booking }) {
  const url = buildGoogleCalendarUrl(booking);
  if (!url) return null;

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => window.open(url, '_blank', 'noopener,noreferrer')}
      className="border-2 border-sky-300 text-sky-800 hover:bg-sky-50 font-bold"
    >
      <CalendarPlus className="h-4 w-4 mr-1" /> Add to Google Calendar
    </Button>
  );
}