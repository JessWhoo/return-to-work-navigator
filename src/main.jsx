import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import ErrorBoundary from '@/components/ErrorBoundary'
import '@/index.css'
import { installGlobalErrorLogging } from '@/lib/errorLogger'

// Detailed logging for uncaught errors and promise rejections — full stack
// traces, source location, page URL, plus a session log via window.__errorLog()
installGlobalErrorLogging();

// The service-worker.js file was removed, but browsers may still have an
// older worker installed from a prior deployment. That stale worker serves
// outdated cached assets and is a common cause of the app failing to load
// after an update. Unregister any existing workers and clear their caches
// once on load so the page always runs the current bundle.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.getRegistrations()
      .then((regs) => Promise.all(regs.map((r) => r.unregister())))
      .then(() => {
        if (typeof caches !== 'undefined') {
          return caches.keys().then((keys) => Promise.all(keys.map((k) => caches.delete(k))));
        }
      })
      .catch(() => { /* best-effort cleanup */ });
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
  // </React.StrictMode>,
)

if (import.meta.hot) {
  import.meta.hot.on('vite:beforeUpdate', () => {
    window.parent?.postMessage({ type: 'sandbox:beforeUpdate' }, '*');
  });
  import.meta.hot.on('vite:afterUpdate', () => {
    window.parent?.postMessage({ type: 'sandbox:afterUpdate' }, '*');
  });
}