import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// Returns which of the fixed time slots on a given date are already busy on
// the coach's Google Calendar. Frontend sends { date: 'YYYY-MM-DD', timezone,
// slots: ['09:00 AM', ...], durationMinutes }.
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Require a signed-in user: this endpoint exposes the coach's private
    // calendar free/busy data via a service-role connector, so anonymous
    // callers must never reach it. (Booking itself already requires login.)
    const caller = await base44.auth.me().catch(() => null);
    if (!caller) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { date, timezone, slots, durationMinutes } = await req.json();

    if (!date || !Array.isArray(slots) || slots.length === 0 || slots.length > 50) {
      return Response.json({ error: 'Missing or invalid date/slots' }, { status: 400 });
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(date))) {
      return Response.json({ error: 'Invalid date format' }, { status: 400 });
    }
    const tz = timezone || 'UTC';
    const duration = Number(durationMinutes) || 30;

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlecalendar');

    // Day boundaries in the caller's timezone → converted to UTC ISO strings.
    // Using Date parsing on 'YYYY-MM-DDTHH:mm:ss' + toLocaleString is unreliable,
    // so we ask Google to interpret timeMin/timeMax with the timeZone param.
    const timeMin = new Date(`${date}T00:00:00`).toISOString();
    const timeMax = new Date(`${date}T23:59:59`).toISOString();

    const fbRes = await fetch('https://www.googleapis.com/calendar/v3/freeBusy', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        timeMin,
        timeMax,
        timeZone: tz,
        items: [{ id: 'primary' }],
      }),
    });

    if (!fbRes.ok) {
      const txt = await fbRes.text();
      return Response.json({ error: 'Calendar lookup failed', details: txt }, { status: 502 });
    }

    const fb = await fbRes.json();
    const busy = (fb.calendars?.primary?.busy || []).map((b: any) => ({
      start: new Date(b.start).getTime(),
      end: new Date(b.end).getTime(),
    }));

    // Parse "09:00 AM" → hours/minutes.
    const parseSlot = (label: string) => {
      const m = label.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
      if (!m) return null;
      let h = parseInt(m[1], 10);
      const min = parseInt(m[2], 10);
      const period = m[3].toUpperCase();
      if (period === 'PM' && h !== 12) h += 12;
      if (period === 'AM' && h === 12) h = 0;
      return { h, min };
    };

    // Build the slot start as a moment in `tz`. Trick: format a UTC date to that
    // timezone, then adjust. Simpler: use the fact that Google will accept an
    // ISO with an offset — compute the tz offset for that date via Intl.
    const tzOffsetMinutes = (isoDate: string, timeZone: string) => {
      // Get the offset by comparing the same instant formatted in tz vs UTC.
      const d = new Date(isoDate);
      const dtf = new Intl.DateTimeFormat('en-US', {
        timeZone,
        hour12: false,
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
      });
      const parts = dtf.formatToParts(d).reduce((acc: any, p) => {
        if (p.type !== 'literal') acc[p.type] = p.value;
        return acc;
      }, {});
      const asUTC = Date.UTC(
        Number(parts.year), Number(parts.month) - 1, Number(parts.day),
        Number(parts.hour), Number(parts.minute), Number(parts.second)
      );
      return (asUTC - d.getTime()) / 60000; // minutes east of UTC
    };

    const results: Record<string, boolean> = {};
    for (const label of slots) {
      const p = parseSlot(label);
      if (!p) { results[label] = false; continue; }
      // Midday of the target date in UTC as a starting point to compute tz offset.
      const noonUTC = new Date(`${date}T12:00:00Z`).toISOString();
      const offsetMin = tzOffsetMinutes(noonUTC, tz);
      // Slot start expressed as UTC ms: local wall time minus offset.
      const localMidnightUTC = Date.UTC(
        Number(date.slice(0, 4)),
        Number(date.slice(5, 7)) - 1,
        Number(date.slice(8, 10)),
      );
      const slotStart = localMidnightUTC + (p.h * 60 + p.min - offsetMin) * 60000;
      const slotEnd = slotStart + duration * 60000;
      const conflict = busy.some((b: any) => slotStart < b.end && slotEnd > b.start);
      results[label] = conflict;
    }

    return Response.json({ busy: results });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
});