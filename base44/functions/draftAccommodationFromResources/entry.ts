import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

/**
 * Generates a CommunicationDraft for an accommodation email, informed by the
 * user's saved resource list. The frontend resolves bookmarked resource IDs
 * against the static resource catalog and posts the resolved list here.
 *
 * Payload:
 *   {
 *     savedResources: [{ name, org, description, topics?: string[] }],
 *     recipient?: string,   // "supervisor" | "HR" | free text
 *     tone?: string,        // "professional" | "assertive" | "collaborative" | "formal" | "friendly"
 *     accommodationsNeeded?: string,  // optional user note
 *   }
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const savedResources = Array.isArray(body.savedResources) ? body.savedResources : [];
    const recipient = (body.recipient || 'supervisor').toString();
    const requestedTone = (body.tone || 'professional').toString();
    const allowedTones = ['professional', 'assertive', 'collaborative', 'formal', 'friendly'];
    const tone = allowedTones.includes(requestedTone) ? requestedTone : 'professional';
    const accommodationsNeeded = (body.accommodationsNeeded || '').toString().trim();

    if (savedResources.length === 0) {
      return Response.json({
        error: 'No saved resources found. Save some resources in your Resource Library first.',
      }, { status: 400 });
    }

    // Build a compact, LLM-friendly summary of the user's saved resources.
    const resourceList = savedResources
      .slice(0, 25)
      .map((r: any, i: number) => {
        const topics = Array.isArray(r.topics) && r.topics.length
          ? ` [topics: ${r.topics.join(', ')}]`
          : '';
        return `${i + 1}. ${r.name || 'Untitled'} — ${r.org || 'Unknown source'}: ${r.description || ''}${topics}`;
      })
      .join('\n');

    const userName = user.full_name || '';
    const firstName = userName.split(' ')[0] || '';

    const prompt = `You are the accommodation_email_assistant — a supportive, professional writing assistant for people managing serious health conditions (including cancer survivors) who need to communicate with their employers about workplace accommodations.

The user has bookmarked the following resources, which reflect the workplace accommodation topics they care about most:

${resourceList}

${accommodationsNeeded ? `Additional context from the user about accommodations they need:\n${accommodationsNeeded}\n\n` : ''}Write a single professional email from the user to their ${recipient} requesting workplace accommodations. Base the tone and specific accommodations mentioned on the themes of the saved resources above (e.g. flexibility, fatigue management, medical appointments, remote work, gradual return, ADA rights, FMLA).

Requirements:
- Tone: ${tone}
- Do NOT invent medical diagnosis details. Keep the email focused on business impact and requested accommodations, not personal medical detail.
- Do NOT include legal threats or cite specific legal claims — you can mention "under the ADA" once, generally, if relevant.
- Keep it concise (150-280 words).
- Include a clear subject line.
- Reference 2-4 concrete accommodations that align with the saved resources' themes.
- End with a collaborative closing that invites a conversation.
- Sign off as "${firstName || '[Your name]'}".

Return JSON with:
  subject: string (the email subject line)
  body: string (the full email body, ready to send)
  suggestions: array of 2-3 short strings — tips the user could tweak before sending`;

    const llmResult = await base44.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: 'object',
        properties: {
          subject: { type: 'string' },
          body: { type: 'string' },
          suggestions: {
            type: 'array',
            items: { type: 'string' },
          },
        },
        required: ['subject', 'body'],
      },
    });

    const subject = (llmResult?.subject || 'Requesting workplace accommodations').toString();
    const bodyText = (llmResult?.body || '').toString();
    const suggestions = Array.isArray(llmResult?.suggestions) ? llmResult.suggestions : [];

    if (!bodyText.trim()) {
      return Response.json({ error: 'Failed to generate draft content' }, { status: 500 });
    }

    // Persist as a CommunicationDraft owned by the current user.
    const draft = await base44.entities.CommunicationDraft.create({
      title: `Accommodation request — ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
      scenario_type: 'accommodation_request',
      recipient,
      subject,
      content: bodyText,
      tone,
      ai_suggestions: suggestions.map((s: string) => ({ type: 'improvement', suggestion: s })),
      is_finalized: false,
    });

    return Response.json({ draft });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
});