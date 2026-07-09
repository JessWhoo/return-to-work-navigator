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

export function logError(type, error, extra = {}) {
  const entry = {
    type,
    time: new Date().toISOString(),
    url: window.location.pathname + window.location.search,
    message: error?.message || String(error),
    stack: error?.stack || null,
    ...extra,
  };

  // Detailed console output with grouped stack trace
  console.groupCollapsed(`%c[${type}] ${entry.message}`, 'color:#dc2626;font-weight:bold');
  console.error('Time:', entry.time);
  console.error('Page:', entry.url);
  if (entry.stack) console.error('Stack:\n' + entry.stack);
  if (extra.componentStack) console.error('Component stack:\n' + extra.componentStack);
  if (extra.source) console.error('Source:', extra.source, `line ${extra.line}:${extra.col}`);
  console.groupEnd();

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