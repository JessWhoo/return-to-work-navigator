// Shared entitlement check for the Manager & HR Guide premium product.
// Used by both `check-premium-access` (client-facing gate) and
// `get-manager-guide` (server-side content delivery) so the logic
// that grants access is never duplicated.

/**
 * Returns true when the authenticated user has a paid Base44Purchase
 * for the manager-guide-premium product, either by direct appUserId
 * match or by claiming an anonymous buyer-email purchase.
 *
 * @param db        — base44.asServiceRole (service-role SDK client)
 * @param user      — the authenticated user object from base44.auth.me()
 */
export async function hasManagerGuideAccess(db, user) {
  const productId = 'manager-guide-premium';

  // Direct match: a paid purchase already linked to this user.
  const ownPurchases = await db.entities.Base44Purchase.filter({
    productId,
    status: 'paid',
    appUserId: user.id,
  });
  if (ownPurchases?.length > 0) {
    return true;
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
        return true;
      }
    }
  }

  return false;
}