import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// Creates a Google Calendar event on the coach's calendar for a confirmed booking.
// Frontend sends { bookingId, date, time, durationMinutes, timezone, topicLabel,
// sessionFormat, contactName, contactEmail, notes }.
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const {
      bookingId, date, time, durationMinutes, timezone,
      topicLabel, sessionFormat, contactName, contactEmail, notes,
    } = body;

    if (!date || !time || !contactEmail) {
      return Response.json({ error: 'Missing required booking fields' }, { status: 400 });
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlecalendar');

    // Parse "09:00 AM" → 24h
    const m = String(time).match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!m) return Response.json({ error: 'Bad time format' }, { status: 400 });
    let h = parseInt(m[1], 10);
    const min = parseInt(m[2], 10);
    const period = m[3].toUpperCase();
    if (period === 'PM' && h !== 12) h += 12;
    if (period === 'AM' && h === 12) h = 0;

    const startLocal = `${date}T${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}:00`;
    const endH = h;
    const endMinTotal = min + Number(durationMinutes || 30);
    const endHours = endH + Math.floor(endMinTotal / 60);
    const endMins = endMinTotal % 60;
    const endLocal = `${date}T${String(endHours).padStart(2, '0')}:${String(endMins).padStart(2, '0')}:00`;

    const event = {
      summary: `Coaching session — ${contactName || 'Client'} (${topicLabel || 'Return-to-work'})`,
      description: [
        `Topic: ${topicLabel || 'Return-to-work'}`,
        `Format: ${sessionFormat === 'phone' ? 'Phone call' : 'Video call'}`,
        `Client: ${contactName || ''} <${contactEmail}>`,
        notes ? `\nNotes from client:\n${notes}` : '',
        bookingId ? `\nBooking ID: ${bookingId}` : '',
      ].filter(Boolean).join('\n'),
      start: { dateTime: startLocal, timeZone: timezone || 'UTC' },
      end:   { dateTime: endLocal,   timeZone: timezone || 'UTC' },
      attendees: [{ email: contactEmail, displayName: contactName || undefined }],
      conferenceData: sessionFormat === 'video'
        ? { createRequest: { requestId: `coach-${bookingId || Date.now()}` } }
        : undefined,
    };

    const url = 'https://www.googleapis.com/calendar/v3/calendars/primary/events'
      + '?conferenceDataVersion=1&sendUpdates=all';

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    });

    if (!res.ok) {
      const txt = await res.text();
      return Response.json({ error: 'Calendar event creation failed', details: txt }, { status: 502 });
    }

    const created = await res.json();
    return Response.json({
      eventId: created.id,
      htmlLink: created.htmlLink,
      meetLink: created.hangoutLink || null,
    });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
});