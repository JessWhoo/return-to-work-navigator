import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// Entity automation handler for CoachBooking.create.
//
// This function is invoked ONLY by the "New coach booking → calendar event"
// entity automation configured in Base44. It intentionally does not expose
// any client-usable authorization path:
//
//   - It performs NO shared-secret check against a request body.
//   - It refuses any request that arrives with an authenticated user session
//     attached — real entity automations run with no user context.
//   - It requires the entity-automation-shaped payload (event.type,
//     event.entity_name === 'CoachBooking', event.entity_id, data).
//   - It reloads the booking from the database and enforces the same
//     freshness + entity_id + rate-limit gates as before.
//
// End users and admins do NOT call this function — admins wanting to add
// a calendar event manually should use createCoachCalendarEvent (admin-gated).
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Hard requirement: automations run without a user session. If a session
    // is attached, this is not the automation runner and must be rejected.
    let hasSession = false;
    try {
      const caller = await base44.auth.me();
      hasSession = !!caller;
    } catch {
      hasSession = false;
    }
    if (hasSession) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));

    // Require the entity-automation payload shape.
    const isAutomationPayload =
      body?.event?.type === 'create' &&
      body?.event?.entity_name === 'CoachBooking' &&
      typeof body?.event?.entity_id === 'string' &&
      typeof body?.data === 'object' && body?.data !== null;
    if (!isAutomationPayload) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const bookingId = body.event.entity_id;

    const booking = await base44.asServiceRole.entities.CoachBooking.get(bookingId).catch(() => null);
    if (!booking) return Response.json({ error: 'Booking not found' }, { status: 404 });

    // Freshness: automation fires within seconds of creation.
    const AUTOMATION_FRESHNESS_MS = 60 * 1000;
    const createdAt = booking.created_date ? new Date(booking.created_date).getTime() : 0;
    if (!createdAt || Date.now() - createdAt > AUTOMATION_FRESHNESS_MS) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Only active bookings.
    if (booking.status && !['requested', 'confirmed'].includes(booking.status)) {
      return Response.json({ error: 'Booking is not in an active state' }, { status: 400 });
    }

    // Future date only.
    if (booking.requested_date && booking.requested_date < new Date().toISOString().slice(0, 10)) {
      return Response.json({ error: 'Booking date must be in the future' }, { status: 400 });
    }

    // Idempotency.
    if (booking.calendar_event_id) {
      return Response.json({
        eventId: booking.calendar_event_id,
        alreadyExists: true,
      });
    }

    // Per-booking-owner rate limit.
    const RATE_LIMIT_WINDOW_MS = 24 * 60 * 60 * 1000;
    const RATE_LIMIT_MAX = 2;
    const recentBookings = await base44.asServiceRole.entities.CoachBooking.filter({
      created_by_id: booking.created_by_id,
    });
    const recentEventCount = (recentBookings || []).filter((b: any) =>
      b.calendar_event_id &&
      b.created_date &&
      Date.now() - new Date(b.created_date).getTime() < RATE_LIMIT_WINDOW_MS
    ).length;
    if (recentEventCount >= RATE_LIMIT_MAX) {
      return Response.json({ error: 'Booking owner rate limit reached.' }, { status: 429 });
    }

    const date = booking.requested_date;
    const time = booking.requested_time;
    const durationMinutes = booking.duration_minutes;
    const timezone = booking.timezone;
    const sessionFormat = booking.session_format;
    const contactName = booking.contact_name;
    const contactEmail = booking.contact_email;
    const notes = booking.notes;
    const topicLabel = booking.topic || 'Return-to-work';

    if (!date || !time || !contactEmail) {
      return Response.json({ error: 'Booking is missing required fields' }, { status: 400 });
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
    const endMinTotal = min + Number(durationMinutes || 30);
    const endHours = h + Math.floor(endMinTotal / 60);
    const endMins = endMinTotal % 60;
    const endLocal = `${date}T${String(endHours).padStart(2, '0')}:${String(endMins).padStart(2, '0')}:00`;

    const event = {
      summary: `Coaching session — ${contactName || 'Client'} (${topicLabel})`,
      description: [
        `Topic: ${topicLabel}`,
        `Format: ${sessionFormat === 'phone' ? 'Phone call' : 'Video call'}`,
        `Client: ${contactName || ''} <${contactEmail}>`,
        notes ? `\nNotes from client:\n${notes}` : '',
        `\nBooking ID: ${bookingId}`,
      ].filter(Boolean).join('\n'),
      start: { dateTime: startLocal, timeZone: timezone || 'UTC' },
      end:   { dateTime: endLocal,   timeZone: timezone || 'UTC' },
      attendees: [{ email: contactEmail, displayName: contactName || undefined }],
      conferenceData: sessionFormat === 'video'
        ? { createRequest: { requestId: `coach-${bookingId}` } }
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

    await base44.asServiceRole.entities.CoachBooking.update(bookingId, {
      calendar_event_id: created.id,
      calendar_event_link: created.htmlLink || null,
      calendar_meet_link: created.hangoutLink || null,
    }).catch(() => { /* non-fatal */ });

    return Response.json({
      eventId: created.id,
      htmlLink: created.htmlLink,
      meetLink: created.hangoutLink || null,
    });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
});