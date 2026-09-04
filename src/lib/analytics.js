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

// Safe wrapper — analytics must never break the app (blocked trackers,
// offline, etc. all fail silently).
export function track(eventName, properties = {}) {
  if (isBurst()) return;
  try {
    base44.analytics.track({ eventName, properties });
  } catch {
    /* ignore */
  }
}