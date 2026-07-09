import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// Toggles the calling user's "helpful" vote on an ExpertQA record.
//
// Security model: ExpertQA update RLS is admin-only, so clients can no longer
// write answer/expert/status/vote fields directly. This function is the ONLY
// non-admin write path, and it exclusively touches helpful_by/helpful_count,
// always derived from the server-verified caller id.
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const user = await base44.auth.me().catch(() => null);
    if (!user || !user.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const qaId = typeof body?.qaId === 'string' ? body.qaId : '';
    if (!qaId) {
      return Response.json({ error: 'Missing qaId' }, { status: 400 });
    }

    const qa = await base44.asServiceRole.entities.ExpertQA.get(qaId).catch(() => null);
    if (!qa) {
      return Response.json({ error: 'Question not found' }, { status: 404 });
    }

    const current: string[] = Array.isArray(qa.helpful_by) ? qa.helpful_by : [];
    const already = current.includes(user.id);
    const helpful_by = already
      ? current.filter((id) => id !== user.id)
      : [...current, user.id];

    await base44.asServiceRole.entities.ExpertQA.update(qaId, {
      helpful_by,
      helpful_count: helpful_by.length,
    });

    return Response.json({ success: true, marked: !already, helpful_count: helpful_by.length });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
});