import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

const MAX_PAGE = 48;
const RATING_BATCH = 500;

// Returns one page of wellness resources plus per-resource rating aggregates.
// Ratings are aggregated server-side so the browser only ever receives
// { resource_id, average, count, my_rating, my_rating_id } — never other
// raters' identities.
export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));

    const skip = Math.max(0, Number(body.skip) || 0);
    const limit = Math.min(MAX_PAGE, Math.max(1, Number(body.limit) || 24));
    const topic = typeof body.topic === 'string' && body.topic !== 'all' ? body.topic : null;

    let userId = null;
    try {
      const user = await base44.auth.me();
      userId = user?.id || null;
    } catch {
      userId = null; // public page — anonymous visitors still get aggregates
    }

    const query = topic ? { topic } : {};
    // Fetch one extra record to know whether another page exists.
    const rows = await base44.asServiceRole.entities.WellnessResource.filter(
      query, '-created_date', limit + 1, skip,
    );
    const has_more = rows.length > limit;
    const resources = rows.slice(0, limit);
    const ids = resources.map((r) => r.id);

    const stats = {};
    for (const id of ids) stats[id] = { resource_id: id, sum: 0, count: 0, my_rating: 0, my_rating_id: null };

    if (ids.length > 0) {
      let rSkip = 0;
      while (true) {
        const batch = await base44.asServiceRole.entities.WellnessResourceRating.filter(
          { resource_id: { $in: ids } }, null, RATING_BATCH, rSkip,
        );
        for (const r of batch) {
          const s = stats[r.resource_id];
          if (!s) continue;
          s.sum += Number(r.rating) || 0;
          s.count += 1;
          if (userId && r.created_by_id === userId) {
            s.my_rating = r.rating;
            s.my_rating_id = r.id;
          }
        }
        if (batch.length < RATING_BATCH) break;
        rSkip += RATING_BATCH;
      }
    }

    const ratings = Object.values(stats).map(({ sum, count, ...rest }) => ({
      ...rest,
      count,
      average: count ? sum / count : 0,
    }));

    return Response.json({ resources, ratings, has_more, next_skip: skip + resources.length });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}