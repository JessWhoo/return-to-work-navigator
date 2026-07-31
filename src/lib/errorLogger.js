// Detailed runtime error logger.
// Captures full stack traces + context for every uncaught error, keeps a
// rolling log in sessionStorage, and exposes window.__errorLog for inspection.

const LOG_KEY = '__appErrorLog__';
const MAX_ENTRIES = 50;

function readLog() {
  try { return JSON.parse(sessionStorage.getItem(LOG_KEY) || '[]'); }
  catch { return []; }
}

function writeLog(entries) {
  try { sessionStorage.setItem(LOG_KEY, JSON.stringify(entries.slice(-MAX_ENTRIES))); } catch { /* ignore */ }
}

// Storm suppression: the same error repeating rapidly (e.g. thrown every
// animation frame) must not flood the console with hundreds of entries.
// Log the first few occurrences in full, then only a periodic summary.
const recentErrors = new Map(); // key -> { count, firstSeen }
const DEDUPE_WINDOW_MS = 5000;
const MAX_FULL_LOGS = 3;
const SUMMARY_EVERY = 25;

export function logError(type, error, extra = {}) {
  const entry = {
    type,
    time: new Date().toISOString(),
    url: window.location.pathname + window.location.search,
    message: error?.message || String(error),
    stack: error?.stack || null,
    ...extra,
  };

  const key = `${type}|${entry.message}|${extra.source || ''}|${extra.line || ''}`;
  const now = Date.now();
  const seen = recentErrors.get(key);
  if (seen && now - seen.firstSeen < DEDUPE_WINDOW_MS) {
    seen.count += 1;
    if (seen.count % SUMMARY_EVERY === 0) {
      console.warn(`[${type}] "${entry.message}" repeated ${seen.count}x in the last ${Math.round((now - seen.firstSeen) / 1000)}s — suppressing duplicates.`);
    }
    if (seen.count > MAX_FULL_LOGS) return entry; // suppressed: no console spam, no log-file growth
  } else {
    recentErrors.set(key, { count: 1, firstSeen: now });
    // Keep the map small
    if (recentErrors.size > 50) {
      for (const [k, v] of recentErrors) {
        if (now - v.firstSeen > DEDUPE_WINDOW_MS) recentErrors.delete(k);
      }
    }
  }

  // Single structured console entry with all context (stack, component tree,
  // source location) — one console.error per error, never a multi-line burst.
  console.error(`[${type}] ${entry.message}`, {
    time: entry.time,
    page: entry.url,
    stack: entry.stack || '(no stack — likely a cross-origin script; details unavailable to the page)',
    ...(extra.componentStack ? { componentStack: extra.componentStack } : {}),
    ...(extra.source ? { source: `${extra.source} line ${extra.line}:${extra.col}` } : {}),
  });

  const log = readLog();
  log.push(entry);
  writeLog(log);
  return entry;
}

export function installGlobalErrorLogging() {
  window.addEventListener('error', (event) => {
    // "Script error." with no detail = cross-origin script; note it explicitly.
    const isOpaque = event.message === 'Script error.' && !event.error;
    logError('GlobalError', event.error || new Error(event.message), {
      source: event.filename || (isOpaque ? '(cross-origin script — no details available)' : null),
      line: event.lineno,
      col: event.colno,
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    logError('UnhandledRejection', event.reason);
  });

  // Inspect collected errors anytime from the console: window.__errorLog()
  window.__errorLog = () => readLog();
}