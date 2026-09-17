import { base44 } from '@/api/base44Client';

// ---------------------------------------------------------------------------
// Client-side analytics queue with exponential backoff.
//
// Each `track()` call enqueues an event instead of firing a request
// immediately. Events flush on a periodic timer (coalescing bursts into a
// single window) and on page-hide so nothing is lost on navigation/close.
// If a flush fails — most commonly endpoint throttling or a blocked network
// — the retry interval doubles up to a cap, so a rate-limited service isn't
// hammered with retries. Analytics is non-fatal: every failure is silent.
//
// Note: the platform's own quota, rate-limit thresholds, and throttling
// policies are managed from the Analytics dashboard page, not in app code.
// ---------------------------------------------------------------------------

// Burst filter: autofill/script storms fire many events in a few ms. Drop
// anything beyond this rate so automated bursts never reach the queue.
const BURST_WINDOW_MS = 200;
const BURST_MAX_EVENTS = 8;
let recent = [];

function isBurst() {
  const now = Date.now();
  recent = recent.filter((t) => now - t < BURST_WINDOW_MS);
  recent.push(now);
  return recent.length > BURST_MAX_EVENTS;
}

const FLUSH_INTERVAL_MS = 5000;   // normal cadence between flushes
const BACKOFF_MAX_MS = 60000;     // cap retry interval after repeated failures
const FLUSH_BATCH = 25;           // max events sent per flush window
const MAX_QUEUE = 200;            // bound memory if the endpoint stays down

let queue = [];
let flushTimer = null;
let flushing = false;
let currentInterval = FLUSH_INTERVAL_MS;

function scheduleFlush() {
  if (flushTimer) return;
  flushTimer = setTimeout(flush, currentInterval);
}

async function flush() {
  if (flushing) return;
  flushTimer = null;
  flushing = true;
  try {
    if (queue.length === 0) return;

    const batch = queue.splice(0, Math.min(queue.length, FLUSH_BATCH));
    let failed = false;
    for (const evt of batch) {
      try {
        const result = base44.analytics.track(evt);
        if (result && typeof result.then === 'function') {
          await result.catch(() => { failed = true; });
        }
      } catch {
        failed = true;
      }
    }

    if (failed) {
      // Endpoint rejected (likely throttled): back off and requeue the batch
      // so events aren't dropped, while easing pressure on the service.
      currentInterval = Math.min(currentInterval * 2, BACKOFF_MAX_MS);
      queue = [...batch, ...queue].slice(0, MAX_QUEUE);
    } else {
      currentInterval = FLUSH_INTERVAL_MS;
    }
  } finally {
    flushing = false;
    if (queue.length > 0) scheduleFlush();
  }
}

// Best-effort flush when the user navigates away or hides the tab so queued
// events aren't dropped. Fire-and-forget — the page may unload mid-flush.
if (typeof window !== 'undefined') {
  const onHidden = () => { flush(); };
  window.addEventListener('pagehide', onHidden);
  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') onHidden();
    });
  }
}

export function track(eventName, properties = {}) {
  if (isBurst()) return;
  // Drop the oldest event if the queue is saturated under sustained pressure,
  // keeping the newest (most relevant) signals.
  if (queue.length >= MAX_QUEUE) queue.shift();
  queue.push({ eventName, properties });
  scheduleFlush();
}

export default track;