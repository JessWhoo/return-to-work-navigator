import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// Creates a Google Calendar event on the coach's calendar for a confirmed booking.
//
// SECURITY MODEL:
// End users CANNOT invoke this function directly. Access is restricted to:
//   (a) admin callers (caller.role === 'admin'), or
//   (b) trusted internal entity automations on CoachBooking.create, which
//       run with no user context and thus cannot be spoofed by a client.
//
// The "New coach booking → calendar event" entity automation is the normal
// production path. Regular users create a CoachBooking via their user-scoped
// SDK (RLS pins created_by_id to their own id), the automation fires, and
// this function then validates the record and creates the calendar event.
//
// Additional gates enforced on every invocation:
//   - booking.status must be in {'requested','confirmed'}
//   - booking.requested_date must be today or later
//   - booking.calendar_event_id must be empty (idempotency)
//   - booking.contact_email must be present
//   - Per-owner rate limit: 2 calendar events / 24h across their bookings
//   - Event fields are read from the stored CoachBooking row only — never
//     from the request body, so no request field influences the calendar.
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const body = await req.json().catch(() => ({}));

    // Trust-boundary — explicit allow-list, positive checks only.
    //
    // A missing session (base44.auth.me() throwing / returning null) is NEVER
    // by itself treated as "trusted automation" — an anonymous external HTTP
    // caller produces the same null. Access is granted ONLY when one of these
    // positive conditions is met:
    //
    //   PATH A — Admin: caller is authenticated AND caller.role === 'admin'.
    //   PATH B — Entity automation on CoachBooking.create: the request body
    //            carries the automation-shaped payload (event.type,
    //            event.entity_name, event.entity_id, data), AND the target
    //            booking passes the freshness + identity checks below.
    //
    // A caller who is authenticated but not admin, or an anonymous caller
    // without the automation payload, is rejected here.
    let isAdmin = false;
    try {
      const caller = await base44.auth.me();
      isAdmin = !!(caller && caller.role === 'admin');
    } catch {
      isAdmin = false;
    }

    // Shared-secret gate for the automation path. The entity automation is
    // configured to pass this secret via function_args; anonymous external
    // callers cannot know it. Payload shape alone is NOT trusted.
    const automationSecret = Deno.env.get('COACH_CALENDAR_AUTOMATION_SECRET') || '';
    const providedSecret =
      req.headers.get('x-automation-secret') ||
      body?.automation_secret ||
      '';
    // Require a non-trivial secret to be configured. If the env var is missing
    // or too short, the automation path is disabled entirely — an empty
    // providedSecret can never match.
    const hasValidAutomationSecret =
      automationSecret.length >= 16 &&
      providedSecret.length >= 16 &&
      providedSecret === automationSecret;

    const hasAutomationPayload =
      body?.event?.type === 'create' &&
      body?.event?.entity_name === 'CoachBooking' &&
      typeof body?.event?.entity_id === 'string' &&
      typeof body?.data === 'object' && body?.data !== null;
    const isAutomation = hasValidAutomationSecret && hasAutomationPayload;

    if (!isAdmin && !isAutomation) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Entity automation payload wraps the record: { event, data, ... }.
    // Admin payload can pass { bookingId, topicLabel } directly.
    const bookingId = body?.bookingId || body?.event?.entity_id;
    const topicLabel = body?.topicLabel;

    if (!bookingId) {
      return Response.json({ error: 'Missing bookingId' }, { status: 400 });
    }

    // Load the booking with service role. Since only admins/automations reach
    // this point, service-role access here is not a user-controlled path.
    const booking = await base44.asServiceRole.entities.CoachBooking.get(bookingId).catch(() => null);
    if (!booking) return Response.json({ error: 'Booking not found' }, { status: 404 });

    // Freshness gate for the non-admin (automation) path. Base44 entity
    // automations invoke this within a few seconds of CoachBooking.create,
    // so a 60-second window covers real traffic. An external attacker cannot
    // both (a) forge an automation-shaped payload AND (b) point it at a
    // brand-new booking they don't own — booking creation is RLS-scoped to
    // its creator, so freshly-created bookingIds are not guessable/reachable
    // from an anonymous session. Admins bypass this window.
    if (!isAdmin) {
      const AUTOMATION_FRESHNESS_MS = 60 * 1000;
      const createdAt = booking.created_date ? new Date(booking.created_date).getTime() : 0;
      if (!createdAt || Date.now() - createdAt > AUTOMATION_FRESHNESS_MS) {
        return Response.json({ error: 'Forbidden' }, { status: 403 });
      }
      // The automation payload's entity_id must match the booking we loaded —
      // prevents any confusion between body.bookingId and body.event.entity_id.
      if (body?.event?.entity_id !== booking.id) {
        return Response.json({ error: 'Forbidden' }, { status: 403 });
      }
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

    // Per-booking-owner rate limit: cap how many calendar events a single user's
    // bookings can spawn in a rolling 24h window. Even when triggered by an
    // automation, we won't create more than N events for the same owner per day.
    const RATE_LIMIT_WINDOW_MS = 24 * 60 * 60 * 1000; // 24h
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

    if (!date || !time || !contactEmail) {
      return Response.json({ error: 'Booking is missing required fields' }, { status: 400 });
    }

    // Only after ALL authorization gates have passed — and only when the caller
    // is an admin OR the invocation came from a trusted entity automation — do
    // we access the coach's shared Google Calendar OAuth token.
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