import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

// Centralized, auth-gated gateway for outgoing app emails (SendEmail).
// SendEmail spends integration credits, so it must not be callable by
// anonymous visitors or with arbitrary recipient/subject/body combos.
// Each `operation` below is a fixed, app-specific email; the server builds
// the message from the provided data (and the authenticated user where
// relevant) and sends via the service role.
//
// Contract: { operation, data } -> { ok: true }

const HANDLERS = {
  // Booking confirmation to the user who just requested a coach session.
  coach_booking_confirmation: async (base44, user, data) => {
    const lines = [
      `Hi ${data.contactName || 'there'},`,
      '',
      'Thanks for requesting a session with a return-to-work coach. Here are the details we received:',
      '',
      `Date: ${data.dateStr}`,
      `Time: ${data.time} (${data.timezone})`,
      `Length: ${data.duration} minutes`,
      `Format: ${data.formatLabel}`,
      `Topic: ${data.topicLabel}`,
      data.notes ? `Notes: ${data.notes}` : '',
      '',
      'A coach will reach out shortly to confirm the time and share meeting details.',
      '',
      '— Back to Life, Back to Work Navigator',
    ].filter(Boolean);
    return {
      to: user.email, // always the authenticated user's own address
      subject: 'Your coaching session request',
      body: lines.join('\n'),
    };
  },

  // Share a generated progress report with a healthcare provider.
  share_report: async (base44, user, data) => {
    data = { ...data, reportText: cap(data.reportText, 8000), dateStr: cap(data.dateStr, 40) };
    const name = user?.full_name || 'A Navigator user';
    return {
      to: user.email, // sent to the signed-in user only; they forward it themselves
      subject: `Return-to-Work Progress Report - ${data.dateStr}`,
      body: `Your report is below. Forward this email to your healthcare provider${data.to ? ` (${cap(data.to, 100)})` : ''} when you are ready.
----------------------------------------
Dear Healthcare Provider,

Please find attached the return-to-work progress report for ${name}.

${data.reportText}

If you have any questions or need additional information, please feel free to reach out.

Best regards,
${name}
Generated via Back to Life, Back to Work Toolkit`,
    };
  },

  // Share a curated kit of saved resources + notes. The body is built
  // client-side from the user's own bookmarks/notes (legitimate user content).
  share_kit: async (base44, user, data) => ({
    to: user.email, // sent to the signed-in user only; they forward it themselves
    subject: `Your shared kit: ${cap(data.subject || 'saved resources & notes', 120).replace(/[\r\n]+/g, ' ')}`,
    body: `Your kit is below. Forward this email to ${data.to ? cap(data.to, 100) : 'the person you want to share it with'} when you are ready.\n----------------------------------------\n${cap(data.body, 8000)}`,
  }),

  // Contact form — always to the fixed app inbox, never a caller-chosen recipient.
  contact_message: async (base44, user, data) => ({
    to: 'jess@artisanhrai.com',
    subject: `Contact Form: ${cap(data.name, 100)}`,
    body: `From: ${cap(data.name, 100)} <${cap(data.email, 150)}>\n\n${cap(data.message, 4000)}`,
  }),

  // 15-minute Clinic & Nurse Navigator demo booking — always to the fixed app owner inbox.
  clinic_demo_booking: async (base44, user, data) => ({
    to: 'jess@artisanhrai.com',
    subject: `15-Min Clinic Demo Request: ${cap(data.organization || data.name, 100)}`,
    body: [
      'New 15-Minute Clinic & Nurse Navigator Demo Request:',
      '',
      `Name: ${cap(data.name, 100)}`,
      `Role: ${cap(data.role, 100)}`,
      `Clinic / Organization: ${cap(data.organization, 150)}`,
      `Email: ${cap(data.email, 150)}`,
      `Requested Date: ${cap(data.dateStr, 80)}`,
      `Requested Time: ${cap(data.time, 40)} (${cap(data.timezone, 60)})`,
      `Duration: 15 minutes`,
      `Format: ${cap(data.formatLabel, 40)}`,
      data.notes ? `Questions / Notes: ${cap(data.notes, 2000)}` : '',
    ].filter(Boolean).join('\n'),
  }),
};

// Operations that send exclusively to the fixed owner inbox (jess@artisanhrai.com)
// and may be submitted by public visitors (e.g., nurse navigators booking a demo).
const PUBLIC_FIXED_INBOX_OPS = new Set(['contact_message', 'clinic_demo_booking']);

const cap = (v, n) => String(v ?? '').slice(0, n);
const EMAIL_RE = /^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]+$/;

// Best-effort rate limit (per user or client IP).
const SENDS = new Map();
const LIMIT = 10;
const WINDOW_MS = 60 * 60 * 1000;
function rateLimited(key) {
  const now = Date.now();
  const recent = (SENDS.get(key) || []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= LIMIT) { SENDS.set(key, recent); return true; }
  recent.push(now);
  SENDS.set(key, recent);
  return false;
}

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { operation, data } = body || {};
    const handler = HANDLERS[operation];
    if (!handler) return Response.json({ error: 'Unknown operation' }, { status: 400 });

    let user = null;
    try {
      user = await base44.auth.me();
    } catch {
      user = null;
    }

    if (!user && !PUBLIC_FIXED_INBOX_OPS.has(operation)) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const rateKey = user?.id || req.headers.get('x-forwarded-for') || 'anon';
    if (rateLimited(rateKey)) return Response.json({ error: 'Too many emails. Please try again later.' }, { status: 429 });

    const email = await handler(base44, user, data || {});
    if (!email?.to || !email?.subject || typeof email?.body !== 'string') {
      return Response.json({ error: 'Invalid email payload' }, { status: 400 });
    }

    const to = String(email.to).trim();
    if (to.length > 254 || !EMAIL_RE.test(to)) {
      return Response.json({ error: 'Invalid recipient' }, { status: 400 });
    }

    await base44.asServiceRole.integrations.Core.SendEmail({
      to,
      subject: cap(email.subject, 200).replace(/[\r\n]+/g, ' '),
      body: email.body.slice(0, 10000),
    });
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}