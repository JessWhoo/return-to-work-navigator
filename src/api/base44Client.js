import { createClient } from '@base44/sdk';
import { appParams } from '@/lib/app-params';

const { appId, serverUrl, token, functionsVersion } = appParams;

// The API origin is fixed at build time (see app-params.js) and is never read
// from the URL query string or localStorage, so a crafted ?server_url= link
// cannot redirect authenticated traffic — or the session token — elsewhere.
//Create a client with authentication required
export const base44 = createClient({
  appId,
  serverUrl: serverUrl || '',
  token,
  functionsVersion,
  requiresAuth: false
});