import { createClientFromRequest } from 'npm:@base44/sdk';
import { hasManagerGuideAccess } from '../../shared/premiumAccess.ts';
import { getManagerGuideContent } from '../../shared/managerGuideContent.ts';

// Returns the full premium Manager & HR Guide content (English + Spanish)
// ONLY to authenticated users with a paid Base44Purchase entitlement.
// The content lives entirely server-side (base44/shared/managerGuideContent.ts)
// and is never compiled into the client JS bundle, so non-paying visitors
// cannot read the guide body from the page source or network tab.
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
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = base44.asServiceRole;
    const hasAccess = await hasManagerGuideAccess(db, user);
    if (!hasAccess) {
      return Response.json({ error: 'Premium access required' }, { status: 403 });
    }

    return Response.json(getManagerGuideContent());
  } catch (error) {
    console.error('get-manager-guide: unhandled error', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}