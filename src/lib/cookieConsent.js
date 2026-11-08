export const CONSENT_KEY = 'navigator_cookie_consent_v1';
export const CONSENT_EVENT = 'navigator:cookie-consent';
let sessionChoice = null;

export function readCookieConsent() {
  if (typeof window === 'undefined') return null;
  if (sessionChoice) return sessionChoice;
  try {
    const value = localStorage.getItem(CONSENT_KEY);
    return value === 'granted' || value === 'denied' ? value : null;
  } catch { return null; }
}

function clearTrackingCookies() {
  const host = window.location.hostname.split('.');
  const domains = ['', ...host.map((_, index) => '.' + host.slice(index).join('.'))];
  const segments = window.location.pathname.split('/');
  const paths = ['/', ...segments.map((_, index) => segments.slice(0, index + 1).join('/') || '/')];
  document.cookie.split(';').forEach(cookie => {
    const name = cookie.split('=')[0].trim();
    if (!/^(_ga(?:_|$)|_gid$|_gat|_gcl_)/.test(name)) return;
    domains.forEach(domain => paths.forEach(path => {
      document.cookie = `${name}=; Max-Age=0; path=${path}${domain ? `; domain=${domain}` : ''}`;
    }));
  });
}

// Called by the banner's effects and user actions, never during module loading.
export function applyCookieConsent(choice, persist = false) {
  sessionChoice = choice;
  if (persist) {
    try { localStorage.setItem(CONSENT_KEY, choice); } catch { /* Keep the choice for this visit. */ }
  }
  window.dataLayer = window.dataLayer || [];
  const gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  gtag('consent', 'update', {
    analytics_storage: choice,
    ad_storage: choice,
    ad_user_data: choice,
    ad_personalization: choice,
  });
  if (choice === 'denied') clearTrackingCookies();
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: choice }));
}