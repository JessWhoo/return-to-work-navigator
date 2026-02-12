import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { text, visibility } = await req.json();

    if (!text) {
      return Response.json({ error: 'Text is required' }, { status: 400 });
    }

    // Get LinkedIn access token
    const accessToken = await base44.asServiceRole.connectors.getAccessToken('linkedin');

    // First, get the user's LinkedIn ID
    const profileResponse = await fetch('https://api.linkedin.com/v2/userinfo', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!profileResponse.ok) {
      throw new Error('Failed to get LinkedIn profile');
    }

    const profile = await profileResponse.json();

    // Create the post
    const postData = {
      author: `urn:li:person:${profile.sub}`,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: {
            text: text
          },
          shareMediaCategory: 'NONE'
        }
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': visibility || 'PUBLIC'
      }
    };

    const postResponse = await fetch('https://api.linkedin.com/v2/ugcPosts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0'
      },
      body: JSON.stringify(postData)
    });

    if (!postResponse.ok) {
      const errorText = await postResponse.text();
      throw new Error(`Failed to create post: ${errorText}`);
    }

    const result = await postResponse.json();

    return Response.json({
      success: true,
      postId: result.id
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});