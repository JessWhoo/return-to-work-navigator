import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// Deletes all data owned by the CURRENTLY AUTHENTICATED user.
//
// Security model:
// - The user id is read exclusively from the server-verified session
//   (base44.auth.me()) — never from the request body. A client cannot
//   pass another user's id to have their data deleted.
// - All deletes are scoped with { created_by_id: <session user id> } so
//   even a service-role delete cannot reach another user's rows.
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    let user;
    try {
      user = await base44.auth.me();
    } catch {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!user || !user.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Defensive: ignore any body — this function acts only on the caller.
    await req.json().catch(() => ({}));

    const userId: string = user.id;

    // Static, direct references to each entity client — no dynamic key lookup,
    // so nothing outside this hardcoded list can ever be resolved.
    const svc = base44.asServiceRole.entities;
    const entityClients = [
      ['UserProgress', svc.UserProgress],
      ['Record', svc.Record],
      ['CommunicationDraft', svc.CommunicationDraft],
      ['MeetingPrep', svc.MeetingPrep],
      ['DailyAffirmation', svc.DailyAffirmation],
      ['CoachFeedback', svc.CoachFeedback],
      ['ResourceReview', svc.ResourceReview],
      ['ResourceSuggestion', svc.ResourceSuggestion],
      ['NetworkingContact', svc.NetworkingContact],
      ['PeerConnection', svc.PeerConnection],
      ['DirectMessage', svc.DirectMessage],
      ['ForumPost', svc.ForumPost],
      ['ForumReply', svc.ForumReply],
      ['CoachBooking', svc.CoachBooking],
    ];

    const results: Record<string, number> = {};
    const errors: string[] = [];

    for (const [name, entities] of entityClients) {
      try {
        if (!entities) continue;
        const items = await entities.filter({ created_by_id: userId }).catch(() => []);
        let deleted = 0;
        for (const item of (items || [])) {
          // Belt-and-suspenders: verify ownership before deleting each row.
          if (item?.created_by_id !== userId) continue;
          try {
            await entities.delete(item.id);
            deleted++;
          } catch (err) {
            errors.push(`${name}:${item.id}:${(err as Error).message}`);
          }
        }
        results[name] = deleted;
      } catch (err) {
        errors.push(`${name}:${(err as Error).message}`);
      }
    }

    return Response.json({ success: true, userId, results, errors });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
});