import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

/**
 * Triggered by an entity automation on Resource "create".
 * Emails every user (respecting UserProgress.notification_preferences.new_resources)
 * to announce a newly published article / legal resource in the library.
 *
 * Payload from the automation:
 *   { event: { type, entity_name, entity_id }, data: <Resource>, payload_too_large?: boolean }
 */

const CATEGORY_LABELS: Record<string, string> = {
  career_advice: "Career advice",
  legal_rights: "Legal rights",
  workplace_policies: "Workplace policies",
};

const TYPE_LABELS: Record<string, string> = {
  article: "Article",
  guide: "Guide",
  video: "Video",
  checklist: "Checklist",
  template: "Template",
  website: "Website",
  policy_document: "Policy document",
  other: "Resource",
};

function buildEmailBody(name: string, resource: any) {
  const greeting = name ? `Hi ${name},` : "Hi there,";
  const categoryLabel = CATEGORY_LABELS[resource.category] || "New resource";
  const typeLabel = TYPE_LABELS[resource.type] || "Resource";
  const summary = resource.summary || "A new resource has been added to your library.";
  const source = resource.source ? `<p style="margin: 4px 0 0 0; color: #475569; font-size: 14px;">Source: ${resource.source}</p>` : "";
  const externalLink = resource.url
    ? `<p style="margin: 12px 0 0 0;"><a href="${resource.url}" style="color: #7c3aed; font-weight: 600;">Open the resource →</a></p>`
    : "";

  return `
    <div style="font-family: -apple-system, Segoe UI, Roboto, sans-serif; max-width: 560px; margin: 0 auto; color: #0f172a; line-height: 1.55;">
      <h2 style="color: #7c3aed; margin-bottom: 4px;">New in your Resource Library</h2>
      <p style="color: #475569; margin-top: 0;">Back to Life, Back to Work Navigator</p>

      <p>${greeting}</p>
      <p>We just added a new ${typeLabel.toLowerCase()} to the ${categoryLabel} section of your library:</p>

      <div style="background: #f8fafc; border-left: 4px solid #7c3aed; padding: 16px 20px; border-radius: 6px; margin: 18px 0;">
        <p style="margin: 0; font-weight: 700; font-size: 17px; color: #0f172a;">${resource.title}</p>
        <p style="margin: 8px 0 0 0; color: #334155;">${summary}</p>
        ${source}
        ${externalLink}
      </div>

      <p style="margin: 22px 0;">
        <a href="https://app.base44.com/ResourceLibrary" style="background: linear-gradient(90deg, #7c3aed, #059669); color: white; padding: 12px 22px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">
          Browse the library
        </a>
      </p>

      <p style="color: #475569; font-size: 13px;">You're receiving this because new-resource notifications are on in your profile. You can turn them off any time in your notification preferences.</p>
    </div>
  `;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const payload = await req.json().catch(() => ({}));
    const event = payload?.event || {};

    // Trust-boundary — explicit allow-list, positive checks only.
    //
    // A missing session (base44.auth.me() throwing / returning null) is NEVER
    // by itself treated as "trusted automation" — an anonymous external HTTP
    // caller produces the same null. Access is granted ONLY when:
    //
    //   PATH A — Admin: caller is authenticated AND caller.role === 'admin'.
    //   PATH B — Entity automation on Resource.create: request body carries
    //            the automation-shaped payload AND the target Resource passes
    //            the freshness check below. Resource.create RLS already
    //            restricts creation to admins, so an anonymous attacker can't
    //            spawn a fresh Resource to slip through this window.
    let isAdmin = false;
    try {
      const caller = await base44.auth.me();
      isAdmin = !!(caller && caller.role === 'admin');
    } catch {
      isAdmin = false;
    }

    // Shared-secret gate for the automation path. The entity automation is
    // configured to pass this secret via function_args; anonymous external
    // callers cannot know it. Accept via header OR body for flexibility.
    const automationSecret = Deno.env.get('NOTIFY_NEW_RESOURCE_AUTOMATION_SECRET') || '';
    const providedSecret =
      req.headers.get('x-automation-secret') ||
      payload?.automation_secret ||
      '';
    // Require a non-trivial secret to be configured. If the env var is missing
    // or too short, the automation path is disabled entirely — an empty
    // providedSecret can never match.
    const hasValidAutomationSecret =
      automationSecret.length >= 16 &&
      providedSecret.length >= 16 &&
      providedSecret === automationSecret;

    const hasAutomationPayload =
      event?.type === 'create' &&
      event?.entity_name === 'Resource' &&
      typeof event?.entity_id === 'string';
    const isAutomation = hasValidAutomationSecret && hasAutomationPayload;

    if (!isAdmin && !isAutomation) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Always load the resource fresh from the DB using the event's entity_id.
    // Ignore any resource fields in the request body so attacker-controlled
    // title / summary / url can never appear in outbound emails.
    const entityId = event?.entity_id || payload?.resourceId;
    if (!entityId) {
      return Response.json({ error: 'Missing resource id' }, { status: 400 });
    }
    const resource = await base44.asServiceRole.entities.Resource.get(entityId).catch(() => null);
    if (!resource || !resource.title) {
      return Response.json({ error: 'Resource not found' }, { status: 404 });
    }

    // Freshness gate for the non-admin (automation) path. Base44 entity
    // automations invoke this within a few seconds of Resource.create, so a
    // 60-second window covers real traffic. Resource creation is RLS-gated
    // to admins, so an anonymous attacker cannot produce a fresh entity_id
    // that satisfies this check.
    if (!isAdmin) {
      const AUTOMATION_FRESHNESS_MS = 60 * 1000;
      const createdAt = resource.created_date ? new Date(resource.created_date).getTime() : 0;
      if (!createdAt || Date.now() - createdAt > AUTOMATION_FRESHNESS_MS) {
        return Response.json({ error: 'Forbidden' }, { status: 403 });
      }
      if (event?.entity_id !== resource.id) {
        return Response.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    const users = await base44.asServiceRole.entities.User.list();

    let sent = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const u of users) {
      try {
        if (!u.email) { skipped++; continue; }

        const progressList = await base44.asServiceRole.entities.UserProgress.filter({ created_by_id: u.id });
        const progress = progressList?.[0];

        // Respect the user's "new_resources" preference (default true if unset).
        const wantsNewResources = progress?.notification_preferences?.new_resources !== false;
        if (!wantsNewResources) { skipped++; continue; }

        const body = buildEmailBody(u.full_name || "", resource);

        await base44.asServiceRole.integrations.Core.SendEmail({
          from_name: "Navigator",
          to: u.email,
          subject: `New in your library: ${resource.title}`,
          body,
        });
        sent++;
      } catch (err) {
        errors.push((err as Error).message);
      }
    }

    return Response.json({ success: true, sent, skipped, errors });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
});