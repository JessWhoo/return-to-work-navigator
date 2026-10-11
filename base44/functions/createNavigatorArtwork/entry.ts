import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';
import OpenAI from 'npm:openai@6.45.0';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });
    const { asset } = await req.json();
    const prompts = {
      botanical: 'A delicate botanical watercolor illustration for a calm cancer-survivor support website. An airy cluster of gently curved sage-green leaves and fine stems, a few rounded eucalyptus leaves and soft fern sprigs. Palette sage #A6B39B with muted olive watercolor washes and pale lavender #D9CEDF accents. Organic hand-painted watercolor texture, graceful asymmetrical composition in a square, leaf details concentrated toward the lower right with airy negative space. No pots, no people, no lettering, no frame, no backdrop. Isolated artwork with transparent alpha background, not a white or checkerboard background.',
      books: 'A small elegant hand-painted watercolor stack of three closed books in muted mauve #80677E, lavender #D9CEDF and dawn pink #EACBD0, cream #F8F5F0 page edges. A graceful delicate sprig of sage-green #A6B39B botanical leaves curls beside the stack. Calm sophisticated editorial watercolor, gentle paper texture in the painted objects, soft organic outlines. Square composition with the stack occupying the middle and lower right and generous airy spacing around it. No titles or lettering on the books, no logo, no frame, no backdrop. Isolated illustration with transparent alpha background, not a white or checkerboard background.'
    };
    if (asset !== 'botanical' && asset !== 'books') return Response.json({ error: 'Unknown artwork' }, { status: 400 });
    const { baseURL, token, headers } = base44.asServiceRole.aiGateway.connection();
    const client = new OpenAI({ baseURL, apiKey: token, defaultHeaders: headers, maxRetries: 0 });
    const result = await client.images.generate({ model: 'automatic', prompt: prompts[asset], n: 1, aspect_ratio: '1:1', resolution: '1K', quality: 'medium', output_format: 'webp', background: 'transparent', response_format: 'url' });
    return Response.json({ url: result.data[0].url });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}