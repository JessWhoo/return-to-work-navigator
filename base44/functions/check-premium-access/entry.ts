import { createClientFromRequest } from 'npm:@base44/sdk';

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
    const productId = 'manager-guide-premium';

    // Direct match: a paid purchase already linked to this user.
    const ownPurchases = await db.entities.Base44Purchase.filter({
      productId,
      status: 'paid',
      appUserId: user.id,
    });
    if (ownPurchases?.length > 0) {
      return Response.json({ hasAccess: true, isAuthenticated: true });
    }

    // Claim: an anonymous buyer paid with their email, then signed in.
    if (user.email) {
      const emailPurchases = await db.entities.Base44Purchase.filter({
        productId,
        status: 'paid',
        buyerEmail: user.email,
      });
      if (emailPurchases?.length > 0) {
        const purchase = emailPurchases[0];
        if (!purchase.appUserId || purchase.appUserId === user.id) {
          if (!purchase.appUserId) {
            await db.entities.Base44Purchase.update(purchase.id, { appUserId: user.id });
          }
          return Response.json({ hasAccess: true, isAuthenticated: true });
        }
      }
    }

    return Response.json({ hasAccess: false, isAuthenticated: true });
  } catch (error) {
    console.error('check-premium-access: unhandled error', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}