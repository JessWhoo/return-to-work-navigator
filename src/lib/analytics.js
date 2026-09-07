import { base44 } from '@/api/base44Client';

// Burst filter: autofill and script-driven inputs fire many events in a few
// milliseconds. Anything beyond this rate inside the window is dropped, so
// automated bursts never reach analytics.
const BURST_WINDOW_MS = 200;
const BURST_MAX_EVENTS = 8;
let recent = [];

function isBurst() {
  const now = Date.now();
  recent = recent.filter((t) => now - t < BURST_WINDOW_MS);
  recent.push(now);
  return recent.length > BURST_MAX_EVENTS;
}

// Run off the interaction path so a tap is never delayed by a tracking call.
const defer =
  typeof requestIdleCallback === 'function'
    ? (fn) => requestIdleCallback(fn, { timeout: 2000 })
    : (fn) => setTimeout(fn, 0);

// Safe wrapper — analytics must never break the app (blocked trackers,
// offline, etc. all fail silently).
export function track(eventName, properties = {}) {
  if (isBurst()) return;
  defer(() => {
    try {
      // base44.analytics.track() returns a Promise that may reject on network
      // failure or a blocked endpoint (e.g. status 0). Catching it here keeps
      // those failures silent instead of surfacing as unhandled rejections.
      const result = base44.analytics.track({ eventName, properties });
      if (result && typeof result.catch === 'function') {
        result.catch(() => { /* analytics is non-fatal */ });
      }
    } catch {
      /* ignore */
    }
  });
}