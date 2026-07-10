import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const STAGE_LABELS: Record<string, string> = {
  planning: "Planning your return",
  first_week: "First week back",
  ongoing: "Ongoing adjustment",
  completed: "Return complete",
};

// Escape HTML entities so user-controlled values can't inject markup into emails.
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildEmailBody(name: string, stageLabel: string, daysSinceLog: number | null) {
  const greeting = name ? `Hi ${escapeHtml(name)},` : "Hi there,";
  const energyLine = daysSinceLog === null
    ? "We noticed you haven't logged any energy check-ins yet. Even a quick note about how you're feeling can help you spot patterns over time."
    : daysSinceLog >= 7
      ? `It's been ${daysSinceLog} days since your last energy check-in. A quick log today keeps your trends accurate.`
      : `Nice work — you logged energy ${daysSinceLog} day${daysSinceLog === 1 ? '' : 's'} ago. Keep the momentum going with another check-in this week.`;

  return `
    <div style="font-family: -apple-system, Segoe UI, Roboto, sans-serif; max-width: 560px; margin: 0 auto; color: #0f172a; line-height: 1.55;">
      <h2 style="color: #be123c; margin-bottom: 4px;">Your weekly check-in reminder</h2>
      <p style="color: #475569; margin-top: 0;">Back to Life, Back to Work Navigator</p>

      <p>${greeting}</p>
      <p>${energyLine}</p>

      <div style="background: #f8fafc; border-left: 4px solid #0284c7; padding: 14px 18px; border-radius: 6px; margin: 18px 0;">
        <p style="margin: 0; font-weight: 600;">Current phase</p>
        <p style="margin: 4px 0 0 0;">${stageLabel}</p>
        <p style="margin: 8px 0 0 0; color: #475569; font-size: 14px;">
          Take a moment to review your milestones for this phase and check off anything you've completed.
        </p>
      </div>

      <p style="margin: 22px 0;">
        <a href="https://app.base44.com" style="background: linear-gradient(90deg, #e11d48, #7c3aed); color: white; padding: 12px 22px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">
          Open Navigator
        </a>
      </p>

      <p style="color: #475569; font-size: 13px;">You're receiving this because weekly reminders are on in your notification preferences. You can turn them off any time in your profile.</p>
    </div>
  `;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Require an authenticated admin to trigger this bulk email operation.
    const caller = await base44.auth.me().catch(() => null);
    if (!caller) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (caller.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    // List all users, then load each one's progress via service role.
    const users = await base44.asServiceRole.entities.User.list();

    let sent = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const u of users) {
      try {
        if (!u.email) { skipped++; continue; }

        // Find this user's progress record (service-role read).
        const progressList = await base44.asServiceRole.entities.UserProgress.filter({ created_by_id: u.id });
        const progress = progressList?.[0];

        // Respect notification preferences (default true if unset).
        const wantsReminders = progress?.notification_preferences?.email_reminders !== false;
        if (!wantsReminders) { skipped++; continue; }

        const stageLabel = STAGE_LABELS[progress?.journey_stage] || STAGE_LABELS.planning;

        // Days since most recent energy log.
        let daysSinceLog: number | null = null;
        const logs = progress?.energy_logs || [];
        if (logs.length > 0) {
          const latestDate = logs
            .map((l: { date: string }) => l.date)
            .filter(Boolean)
            .sort()
            .pop();
          if (latestDate) {
            const diffMs = Date.now() - new Date(latestDate).getTime();
            daysSinceLog = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
          }
        }

        const body = buildEmailBody(u.full_name || "", stageLabel, daysSinceLog);

        await base44.asServiceRole.integrations.Core.SendEmail({
          from_name: "Navigator",
          to: u.email,
          subject: "Your weekly check-in reminder",
          body,
        });
        sent++;
      } catch (err) {
        // Do not leak user emails/IDs in the response.
        errors.push(err.message);
      }
    }

    return Response.json({ success: true, sent, skipped, errors });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});