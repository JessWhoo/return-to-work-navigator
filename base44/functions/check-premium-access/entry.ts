import { createClientFromRequest } from 'npm:@base44/sdk';
import { hasManagerGuideAccess } from '../../shared/premiumAccess.ts';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    let user = null;
    try {
      user = await base44.auth.me();
    } catch (_) {
      user = null;
    }

    if (!user) {
      return Response.json({ hasAccess: false, isAuthenticated: false });
    }

    const db = base44.asServiceRole;
    const hasAccess = await hasManagerGuideAccess(db, user);

    return Response.json({ hasAccess, isAuthenticated: true });
  } catch (error) {
    console.error('check-premium-access: unhandled error', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}