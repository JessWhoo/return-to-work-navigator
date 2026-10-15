import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';

const SITE_URL = 'https://return-to-work-navigator.org/';
const SITEMAP_URL = 'https://return-to-work-navigator.org/sitemap.xml';
const INSPECT_URLS = [
  'https://return-to-work-navigator.org/',
  'https://return-to-work-navigator.org/FAQ',
  'https://return-to-work-navigator.org/Accommodations',
];

const enc = (s) => encodeURIComponent(s);

function isoDaysAgo(n) {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString().slice(0, 10);
}

async function gsc(token, url, init = {}) {
  const res = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
    signal: AbortSignal.timeout(15000),
  });
  const text = await res.text();
  let body = null;
  try { body = text ? JSON.parse(text) : null; } catch { body = { raw: text }; }
  return { status: res.status, body };
}

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('google_search_console');
    const siteEnc = enc(SITE_URL);

    // 1. List existing sitemaps (also confirms the site is verified)
    const listRes = await gsc(accessToken, `https://www.googleapis.com/webmasters/v3/sites/${siteEnc}/sitemaps`);
    const sitemaps = (listRes.body && listRes.body.sitemap) || [];
    const alreadySubmitted = sitemaps.some((s) => s.path === SITEMAP_URL);

    // 2. Submit the sitemap if not already present (and site is verified)
    let submitResult = null;
    if (!alreadySubmitted && listRes.status === 200) {
      const subRes = await gsc(accessToken, `https://www.googleapis.com/webmasters/v3/sites/${siteEnc}/sitemaps/${enc(SITEMAP_URL)}`, { method: 'PUT' });
      submitResult = { status: subRes.status, body: subRes.body };
    }

    // 3. Inspect the target URLs (parallel)
    const inspections = await Promise.all(INSPECT_URLS.map(async (url) => {
      const r = await gsc(accessToken, 'https://searchconsole.googleapis.com/v1/urlInspect:inspect', {
        method: 'POST',
        body: JSON.stringify({ inspectionUrl: url, siteUrl: SITE_URL, languageCode: 'en-US' }),
      });
      const ir = r.body && r.body.inspectionResult;
      const isd = ir && ir.indexStatusData;
      return {
        url,
        status: r.status,
        error: r.body && r.body.error ? r.body.error.message : null,
        verdict: isd ? isd.verdict : null,
        coverageState: isd ? isd.coverageState : null,
        indexingState: isd ? isd.indexingState : null,
        lastCrawlTime: isd ? isd.lastCrawlTime : null,
        googleCanonical: isd ? isd.googleCanonical : null,
        userCanonical: isd ? isd.userCanonical : null,
      };
    }));

    // 4. Search analytics — which queries bring traffic (last 28 days)
    const searchRes = await gsc(accessToken, `https://www.googleapis.com/webmasters/v3/sites/${siteEnc}/searchAnalytics/query`, {
      method: 'POST',
      body: JSON.stringify({
        startDate: isoDaysAgo(28),
        endDate: isoDaysAgo(1),
        dimensions: ['query'],
        rowLimit: 25,
      }),
    });
    const rows = (searchRes.body && searchRes.body.rows) || [];
    const queries = rows.map((r) => ({
      query: r.keys[0],
      clicks: r.clicks,
      impressions: r.impressions,
      ctr: r.ctr,
      position: r.position,
    }));

    return Response.json({
      siteUrl: SITE_URL,
      verified: listRes.status === 200,
      verificationError: listRes.status !== 200 && listRes.body && listRes.body.error ? listRes.body.error.message : null,
      sitemaps: {
        alreadySubmitted,
        submitResult,
        list: sitemaps.map((s) => ({
          path: s.path,
          status: s.status,
          lastDownloaded: s.lastDownloaded,
          submitted: s.submitted,
          errors: s.errors,
          warnings: s.warnings,
          indexed: s.indexed,
        })),
      },
      inspections,
      searchAnalytics: {
        status: searchRes.status,
        error: searchRes.body && searchRes.body.error ? searchRes.body.error.message : null,
        queries,
        totalQueries: queries.length,
      },
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}