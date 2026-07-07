import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// Creates a Google Calendar event on the coach's calendar for a confirmed booking.
// Frontend sends { bookingId, topicLabel }.
//
// SECURITY MODEL — service-role connector token is used because the coach's
// Google Calendar is a single shared resource (the app owner's), not the
// end user's. Compensating controls that must ALL pass before the token is
// ever requested:
//   1. Caller is authenticated (base44.auth.me()).
//   2. bookingId resolves to a real CoachBooking owned by the caller
//      (booking.created_by_id === user.id, enforced against the stored row —
//      not any request-body field).
//   3. booking.status is in {'requested','confirmed'} — cancelled/completed
//      bookings cannot spawn events.
//   4. booking.requested_date is today or later (no back-dated events).
//   5. booking.calendar_event_id is empty — idempotency prevents a single
//      booking from spawning multiple events on retry/abuse.
//   6. booking.contact_email matches the authenticated user's email.
//   7. Per-user rate limit: at most 2 calendar events in a rolling 24h window.
//   8. Event fields (date, time, invitee, notes) are ALL read from the stored
//      CoachBooking row — never from the request body. The client cannot
//      influence what lands on the coach's calendar beyond the topic label.
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { bookingId, topicLabel } = body;

    if (!bookingId) {
      return Response.json({ error: 'Missing bookingId' }, { status: 400 });
    }

    // Authorization: only create a calendar event from a real CoachBooking that
    // this caller owns. All event fields come from the stored booking, not the
    // request body, so the caller can't set an arbitrary invitee, time, or notes.
    const booking = await base44.asServiceRole.entities.CoachBooking.get(bookingId).catch(() => null);
    if (!booking) return Response.json({ error: 'Booking not found' }, { status: 404 });
    if (booking.created_by_id !== user.id) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Only active bookings can create calendar events — blocks cancelled/completed reuse.
    if (booking.status && !['requested', 'confirmed'].includes(booking.status)) {
      return Response.json({ error: 'Booking is not in an active state' }, { status: 400 });
    }

    // Booking must be for a future date — blocks backfilling the coach's past calendar.
    if (booking.requested_date && booking.requested_date < new Date().toISOString().slice(0, 10)) {
      return Response.json({ error: 'Booking date must be in the future' }, { status: 400 });
    }

    // Idempotency: if this booking already produced a calendar event, don't create another.
    if (booking.calendar_event_id) {
      return Response.json({
        eventId: booking.calendar_event_id,
        htmlLink: booking.calendar_event_link || null,
        meetLink: booking.calendar_meet_link || null,
        alreadyExists: true,
      });
    }

    // Per-user rate limit: cap how many calendar events a single user can spawn.
    // Prevents a malicious user from flooding the coach's calendar via many bookings.
    const RATE_LIMIT_WINDOW_MS = 24 * 60 * 60 * 1000; // 24h
    const RATE_LIMIT_MAX = 2;
    const recentBookings = await base44.asServiceRole.entities.CoachBooking.filter({
      created_by_id: user.id,
    });
    const recentEventCount = (recentBookings || []).filter((b: any) =>
      b.calendar_event_id &&
      b.created_date &&
      Date.now() - new Date(b.created_date).getTime() < RATE_LIMIT_WINDOW_MS
    ).length;
    if (recentEventCount >= RATE_LIMIT_MAX) {
      return Response.json({ error: 'Booking rate limit reached. Please try again later.' }, { status: 429 });
    }

    const date = booking.requested_date;
    const time = booking.requested_time;
    const durationMinutes = booking.duration_minutes;
    const timezone = booking.timezone;
    const sessionFormat = booking.session_format;
    const contactName = booking.contact_name;
    const contactEmail = booking.contact_email;
    const notes = booking.notes;

    if (!date || !time || !contactEmail) {
      return Response.json({ error: 'Booking is missing required fields' }, { status: 400 });
    }

    // Belt-and-suspenders: invitee must also match the authenticated caller's email.
    if (!user.email || String(contactEmail).trim().toLowerCase() !== String(user.email).trim().toLowerCase()) {
      return Response.json({ error: 'Booking contact email must match your account email' }, { status: 403 });
    }

    // Only after ALL authorization gates (1-8 above) have passed do we access
    // the coach's shared Google Calendar OAuth token. Access is scoped to a
    // single primary-calendar events.insert call whose event body is fully
    // derived from the validated, caller-owned CoachBooking row.
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

    // Persist the event reference on the booking so the same booking can't
    // spawn a second calendar event (idempotency guard above).
    await base44.asServiceRole.entities.CoachBooking.update(bookingId, {
      calendar_event_id: created.id,
      calendar_event_link: created.htmlLink || null,
      calendar_meet_link: created.hangoutLink || null,
    }).catch(() => { /* non-fatal — event is already created */ });

    return Response.json({
      eventId: created.id,
      htmlLink: created.htmlLink,
      meetLink: created.hangoutLink || null,
    });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
});