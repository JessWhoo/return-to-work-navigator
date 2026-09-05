import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    if (!user?.id) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const resourceId = typeof body?.resource_id === 'string' ? body.resource_id : '';
    const rating = Number(body?.rating);
    if (!resourceId || !Number.isInteger(rating) || rating < 1 || rating > 5) {
      return Response.json({ error: 'A resource_id and rating from 1 to 5 are required' }, { status: 400 });
    }
    const resource = await base44.asServiceRole.entities.WellnessResource.get(resourceId).catch(() => null);
    if (!resource) return Response.json({ error: 'Resource not found' }, { status: 404 });

    let mine = await base44.entities.WellnessResourceRating.filter(
      { resource_id: resourceId, created_by_id: user.id },
      '-created_date',
      25,
    );
    if (mine.length > 0) {
      await base44.entities.WellnessResourceRating.update(mine[0].id, { rating });
    } else {
      await base44.entities.WellnessResourceRating.create({ resource_id: resourceId, rating });
      mine = await base44.entities.WellnessResourceRating.filter(
        { resource_id: resourceId, created_by_id: user.id },
        '-created_date',
        25,
      );
      if (mine[0]) {
        await base44.entities.WellnessResourceRating.update(mine[0].id, { rating });
      }
    }
    if (mine.length > 1) {
      await Promise.all(
        mine.slice(1).map((row) => base44.entities.WellnessResourceRating.delete(row.id).catch(() => null)),
      );
    }

    return Response.json({ resource_id: resourceId, my_rating: rating });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
});
