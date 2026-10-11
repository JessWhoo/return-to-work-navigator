import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';

// Strict allow-list — the only field we accept. Anything else is rejected so
// the endpoint can't be used to write arbitrary rows.
const ALLOWED_TOOLS = new Set([
  'accommodation_letter_generator',
  'employer_email_generator',
  'legal_rights_advisor',
  'ai_coach',
]);

// Deliberately public logging endpoint: the app is browsable without sign-in,
// so anonymous survivors must be able to log a tool engagement. We never
// accept user-controlled fields beyond the validated tool name, and the
// entity is admin-read-only, so this cannot leak or be abused for data.
export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const tool = typeof body?.tool === 'string' ? body.tool : '';
    if (!ALLOWED_TOOLS.has(tool)) {
      return Response.json({ error: 'Invalid tool' }, { status: 400 });
    }
    await base44.asServiceRole.entities.ToolEngagement.create({ tool });
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}