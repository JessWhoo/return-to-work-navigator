import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const PAGE_SIZE = 24;
const RATING_BATCH_SIZE = 500;

// Returns one resource page plus privacy-safe rating summaries. Raw ratings and
// their creator ids never cross the server boundary.
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    const body = await req.json().catch(() => ({}));
    const offset = Number.isInteger(body?.offset) && body.offset >= 0 ? body.offset : 0;

    // Fetch one extra record so the client gets an unambiguous next-page signal.
    const rows = await base44.asServiceRole.entities.WellnessResource.list(
      '-created_date',
      PAGE_SIZE + 1,
      offset,
    );
    const resources = rows.slice(0, PAGE_SIZE);
    const resourceIds = resources.map((resource) => resource.id);
    const ratings: Array<{ resource_id: string; rating: number; created_by_id?: string }> = [];

    // Increment through every matching rating instead of silently truncating at
    // a fixed ceiling. Only the fields needed to aggregate are read.
    for (let skip = 0; resourceIds.length > 0;) {
      const batch = await base44.asServiceRole.entities.WellnessResourceRating.filter(
        { resource_id: { $in: resourceIds } },
        'created_date',
        RATING_BATCH_SIZE,
        skip,
        ['resource_id', 'rating', 'created_by_id'],
      );
      ratings.push(...batch);
      if (batch.length < RATING_BATCH_SIZE) break;
      skip += batch.length;
    }

    const totals = new Map<string, { sum: number; count: number; my_rating: number }>();
    resourceIds.forEach((id) => totals.set(id, { sum: 0, count: 0, my_rating: 0 }));
    ratings.forEach((rating) => {
      const total = totals.get(rating.resource_id);
      if (!total) return;
      total.sum += rating.rating;
      total.count += 1;
      if (user?.id && rating.created_by_id === user.id) total.my_rating = rating.rating;
    });

    const rating_summaries = resourceIds.map((resource_id) => {
      const total = totals.get(resource_id)!;
      return {
        resource_id,
        average: total.count ? total.sum / total.count : 0,
        count: total.count,
        my_rating: total.my_rating,
      };
    });

    return Response.json({
      resources,
      rating_summaries,
      next_offset: rows.length > PAGE_SIZE ? offset + PAGE_SIZE : null,
    });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
});
