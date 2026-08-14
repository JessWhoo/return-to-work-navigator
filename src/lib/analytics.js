import { base44 } from '@/api/base44Client';

// Safe wrapper — analytics must never break the app (blocked trackers,
// offline, etc. all fail silently).
export function track(eventName, properties = {}) {
  try {
    base44.analytics.track({ eventName, properties });
  } catch {
    /* ignore */
  }
}