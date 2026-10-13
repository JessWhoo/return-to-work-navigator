import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';
import { retryAfter } from '../../shared/aiGatewaySecurity.ts';

// Strict allow-list — the only field we accept. Anything else is rejected so
// the endpoint can't be used to write arbitrary rows.
const ALLOWED_TOOLS = new Set([
  'accommodation_letter_generator',
  'employer_email_generator',
  'legal_rights_advisor',
  'ai_coach',
]);

// This endpoint writes a row to the admin-only ToolEngagement entity on every
// call. Without a caller check, its public URL let anyone on the internet
// spam the table at unlimited volume. The app stays browsable without sign-in,
// but writing to this entity now requires an authenticated session — the
// platform's built-in caller verification (mirrors aiGateway). Anonymous tool
// usage is still counted for the marketing KPI via base44.analytics.track on
// the client; only the admin-dashboard entity records authenticated usage.
// A per-user rate limit caps volume even for a valid session.
export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const tool = typeof body?.tool === 'string' ? body.tool : '';
    if (!ALLOWED_TOOLS.has(tool)) {
      return Response.json({ error: 'Invalid tool' }, { status: 400 });
    }
    const wait = retryAfter(user.id);
    if (wait) {
      return Response.json({ error: 'Too many requests. Please try again later.' }, {
        status: 429, headers: { 'Retry-After': String(wait) },
      });
    }
    await base44.asServiceRole.entities.ToolEngagement.create({ tool });
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}