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
      to: data.to,
      subject: `Return-to-Work Progress Report - ${data.dateStr}`,
      body: `Dear Healthcare Provider,

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
    to: data.to,
    subject: `Shared with you by ${user.full_name || user.email}: ${cap(data.subject || 'saved resources & notes', 120)}`,
    body: cap(data.body, 8000),
  }),

  // Contact form — always to the fixed app inbox, never a caller-chosen recipient.
  contact_message: async (base44, user, data) => ({
    to: 'jess@artisanhrai.com',
    subject: `Contact Form: ${data.name}`,
    body: `From: ${data.name} <${data.email}>\n\n${data.message}`,
  }),
};

const cap = (v, n) => String(v ?? '').slice(0, n);
const EMAIL_RE = /^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]+$/;

// Best-effort per-user rate limit (per function instance).
const SENDS = new Map();
const LIMIT = 10;
const WINDOW_MS = 60 * 60 * 1000;
function rateLimited(userId) {
  const now = Date.now();
  const recent = (SENDS.get(userId) || []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= LIMIT) { SENDS.set(userId, recent); return true; }
  recent.push(now);
  SENDS.set(userId, recent);
  return false;
}

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { operation, data } = body || {};
    const handler = HANDLERS[operation];
    if (!handler) return Response.json({ error: 'Unknown operation' }, { status: 400 });

    if (rateLimited(user.id)) return Response.json({ error: 'Too many emails. Please try again later.' }, { status: 429 });

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