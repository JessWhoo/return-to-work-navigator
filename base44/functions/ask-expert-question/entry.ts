import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';

// Sanitized question submission for the Expert Q&A feature.
//
// SECURITY: ExpertQA has admin-only create RLS, so clients can no longer
// insert records directly. This function is the ONLY user-facing write path,
// and it exclusively sets the user-controllable fields — question, topic,
// question_details, is_anonymous, asker_name — always forcing status to
// "pending" and never accepting answer / expert_name / expert_title / view_count
// / helpful_count / helpful_by. Those are admin-managed fields that must
// never originate from a client payload, since a crafted direct API call
// could otherwise impersonate an expert and publish fake legal/medical advice.

const ALLOWED_TOPICS = new Set([
  'fatigue', 'rights', 'accommodations', 'disclosure',
  'communication', 'career_return', 'emotional_support',
  'insurance_benefits', 'general',
]);

export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const question = typeof body?.question === 'string' ? body.question.trim() : '';
    const topic = typeof body?.topic === 'string' ? body.topic : '';
    const details = typeof body?.question_details === 'string' ? body.question_details.trim() : '';
    const isAnonymous = body?.is_anonymous !== false; // default true

    if (!question) {
      return Response.json({ error: 'Question is required' }, { status: 400 });
    }
    if (question.length > 500) {
      return Response.json({ error: 'Question is too long' }, { status: 400 });
    }
    if (!ALLOWED_TOPICS.has(topic)) {
      return Response.json({ error: 'Invalid topic' }, { status: 400 });
    }
    if (details.length > 2000) {
      return Response.json({ error: 'Details are too long' }, { status: 400 });
    }

    const askerName = isAnonymous ? 'Anonymous' : (user.full_name || 'Anonymous');

    const record = await base44.asServiceRole.entities.ExpertQA.create({
      question,
      topic,
      is_anonymous: isAnonymous,
      asker_name: askerName,
      status: 'pending',
      ...(details ? { question_details: details } : {}),
    });

    return Response.json({ ok: true, question: record });
  } catch (error) {
    console.error('ask-expert-question: unhandled error', error);
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}