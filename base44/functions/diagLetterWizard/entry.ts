import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';
import { Stagehand } from 'npm:@browserbasehq/stagehand@3.7.3';

const TARGET = 'https://return-to-work-navigator-febf891d.base44.app/AccommodationLetterGenerator';

export default async function (req) {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me().catch((e) => (e.status === 401 ? null : Promise.reject(e)));
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

  const session = await base44.asServiceRole.browser.getSession();
  let stagehand;
  const debug_screenshots = [];
  try {
    const { baseURL, token, headers } = base44.asServiceRole.aiGateway.connection();
    stagehand = new Stagehand({
      env: 'LOCAL',
      localBrowserLaunchOptions: { cdpUrl: session.connectionUrl },
      model: { modelName: 'openai/gpt_6_luna', apiKey: token, baseURL, headers, openaiEndpointFormat: 'chat' },
      disablePino: true,
    });
    await stagehand.init();
    const page = stagehand.context.pages()[0];

    const consoleErrors = [];
    page.on('pageerror', (err) => consoleErrors.push(String(err && err.message ? err.message : err)));

    await page.goto(TARGET, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(6000);

    const shot = await page.screenshot({ type: 'png' });
    const file = new File([shot], 'wizard.png', { type: 'image/png' });
    const uploaded = await base44.asServiceRole.integrations.Core.UploadPrivateFile({ file });
    debug_screenshots.push({ label: 'Letter generator page', file_uri: uploaded.file_uri });

    const snapshot = await page.evaluate(() => {
      const root = document.getElementById('root');
      const buttons = Array.from(document.querySelectorAll('button')).map((b) => (b.textContent || '').trim()).filter(Boolean);
      return {
        rootChildCount: root ? root.children.length : -1,
        h1: document.querySelector('h1') ? document.querySelector('h1').textContent.trim() : null,
        buttonCount: buttons.length,
        buttons: buttons.slice(0, 25),
        textSample: (document.body.innerText || '').slice(0, 500),
      };
    });

    return Response.json({ target: TARGET, snapshot, consoleErrors: consoleErrors.slice(0, 5), debug_screenshots });
  } catch (error) {
    return Response.json({ error: error.message, debug_screenshots }, { status: 500 });
  } finally {
    await stagehand?.close().catch(() => {});
    await session.end();
  }
}