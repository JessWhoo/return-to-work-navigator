import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get LinkedIn access token
    const accessToken = await base44.asServiceRole.connectors.getAccessToken('linkedin');

    // Fetch user's LinkedIn profile
    const profileResponse = await fetch('https://api.linkedin.com/v2/userinfo', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!profileResponse.ok) {
      throw new Error(`LinkedIn API error: ${profileResponse.statusText}`);
    }

    const profile = await profileResponse.json();

    return Response.json({
      success: true,
      profile: {
        name: profile.name,
        email: profile.email,
        picture: profile.picture,
        sub: profile.sub
      }
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});