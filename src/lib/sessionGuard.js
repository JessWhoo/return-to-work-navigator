// Session-guard helpers shared by the auth context, the React Query client,
// and the pages that load data.
//
// This app is browsable without an account, so a missing or expired session
// must never break a page. Instead every 401 is funnelled into ONE "your
// session expired, sign in again" signal (see SessionExpiredNotice) rather
// than a broken screen or a console full of failed requests.

// The SDK persists the session token under these keys (see @base44/sdk auth).
const TOKEN_STORAGE_KEYS = ['base44_access_token', 'token'];
// Survives a reload, so the notice also appears after the SDK's logout redirect
// has round-tripped an expired session.
const EXPIRED_FLAG_KEY = 'base44_session_expired';

/** HTTP status of a failed request: SDK Base44Error uses .status, a raw axios error .response.status. */
export function errorStatus(error) {
  return error?.response?.status ?? error?.status ?? null;
}

/**
 * True only when the failure is the SESSION being missing/expired. A plain 403
 * is a per-record permission error, not an expired session.
 */
export function isUnauthorizedError(error) {
  const status = errorStatus(error);
  if (status === 401) return true;
  return status === 403 && error?.data?.extra_data?.reason === 'auth_required';
}

/** Cheap local check that a session token is present — lets a caller skip an API call it knows would 401. */
export function hasSessionToken() {
  try {
    return TOKEN_STORAGE_KEYS.some((key) => Boolean(window.localStorage.getItem(key)));
  } catch {
    return false;
  }
}

/** Drop a dead token locally. The SDK's own sign-out still handles HTTP-only cookies. */
function clearStoredToken() {
  try {
    for (const key of TOKEN_STORAGE_KEYS) window.localStorage.removeItem(key);
  } catch {
    // Storage unavailable (private browsing) — nothing to clear.
  }
}

export function markSessionExpired() {
  try { window.sessionStorage.setItem(EXPIRED_FLAG_KEY, '1'); } catch { /* ignore */ }
}

export function isSessionExpiredFlag() {
  try { return window.sessionStorage.getItem(EXPIRED_FLAG_KEY) === '1'; } catch { return false; }
}

export function clearSessionExpiredFlag() {
  try { window.sessionStorage.removeItem(EXPIRED_FLAG_KEY); } catch { /* ignore */ }
}

const listeners = new Set();

/** Subscribe to "the session is no longer valid". Returns an unsubscribe function. */
export function onUnauthorized(listener) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

/**
 * Report a failed request. The expired flag doubles as the de-duplicator, so a
 * page firing several calls with the same dead token notifies listeners once.
 */
export function reportUnauthorized(error) {
  if (error && !isUnauthorizedError(error)) return;
  if (isSessionExpiredFlag()) return;
  markSessionExpired();
  clearStoredToken();
  for (const listener of listeners) {
    try { listener(); } catch { /* a broken listener must not break the page */ }
  }
}

/**
 * Catch 401s that no caller handled — a page-load fetch awaited inside a
 * component effect that only swallows its failure. React Query reports its own
 * errors; this covers the direct-SDK calls.
 */
let monitorInstalled = false;
export function installUnauthorizedMonitor() {
  if (monitorInstalled || typeof window === 'undefined') return;
  monitorInstalled = true;
  window.addEventListener('unhandledrejection', (event) => {
    reportUnauthorized(event?.reason);
  });
}