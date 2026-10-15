import { createClientFromRequest } from "npm:@base44/sdk";

const CANCEL_URL = (id) =>
  `https://www.wixapis.com/payments/base44/v1/subscriptions/${id}/cancel`;

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    let user = null;
    try {
      user = await base44.auth.me();
    } catch (_) {
      user = null;
    }

    if (!user) {
      return Response.json({ error: "Authentication required" }, { status: 401 });
    }

    const db = base44.asServiceRole;
    const productId = "manager-guide-premium";

    // Find the user's active subscription purchase. check-premium-access claims
    // email-based purchases on sign-in, so appUserId is set by the time the user
    // reaches this cancel flow.
    const purchases = await db.entities.Base44Purchase.filter({
      productId,
      status: "paid",
      appUserId: user.id,
    });
    const purchase = purchases?.[0];
    if (!purchase) {
      return Response.json({ error: "No active subscription found" }, { status: 404 });
    }
    if (!purchase.subscriptionId) {
      return Response.json(
        { error: "Subscription is still being confirmed. Please try again in a moment." },
        { status: 409 },
      );
    }

    const WIX_API_KEY = Deno.env.get("WIX_CHECKOUT_API_KEY");
    const WIX_SITE_ID = Deno.env.get("WIX_CHECKOUT_SITE_ID");
    if (!WIX_API_KEY || !WIX_SITE_ID) {
      console.error("cancel-subscription: Wix payment config not set");
      return Response.json({ error: "Payments not configured" }, { status: 500 });
    }

    const headers = {
      Authorization: WIX_API_KEY,
      "wix-site-id": WIX_SITE_ID,
      "Content-Type": "application/json",
    };

    // Soft cancel first: turns off auto-renewal so the subscriber keeps access
    // until the end of the billing cycle they already paid for.
    let wixRes = await fetch(CANCEL_URL(purchase.subscriptionId), {
      method: "POST",
      headers,
      body: JSON.stringify({
        subscription_id: purchase.subscriptionId,
        immediate: false,
      }),
    });

    if (!wixRes.ok) {
      const errText = await wixRes.text();
      console.error("cancel-subscription: soft cancel failed", {
        status: wixRes.status,
        errText,
      });
      // Soft cancel can fail if auto-renew is already off — fall back to immediate.
      wixRes = await fetch(CANCEL_URL(purchase.subscriptionId), {
        method: "POST",
        headers,
        body: JSON.stringify({
          subscription_id: purchase.subscriptionId,
          immediate: true,
        }),
      });
      if (!wixRes.ok) {
        const errText2 = await wixRes.text();
        console.error("cancel-subscription: immediate cancel failed", {
          status: wixRes.status,
          errText2,
        });
        return Response.json({ error: "Could not cancel subscription" }, { status: 502 });
      }
    }

    const data = await wixRes.json();
    console.log("cancel-subscription: canceled", {
      purchaseId: purchase.id,
      subscriptionId: purchase.subscriptionId,
      status: data?.subscription?.status,
    });
    return Response.json({
      success: true,
      status: data?.subscription?.status || "CANCELED",
    });
  } catch (error) {
    console.error("cancel-subscription: unhandled error", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}