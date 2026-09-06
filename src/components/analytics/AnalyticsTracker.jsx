import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { track } from '@/lib/analytics';

// Report page load performance once per full page load (not per route change).
let perfReported = false;
function reportPagePerformance(page) {
  if (perfReported || typeof PerformanceObserver === 'undefined') return;
  perfReported = true;

  let lcpMs = null;
  let longTaskCount = 0;
  try {
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      if (entries.length) lcpMs = Math.round(entries[entries.length - 1].startTime);
    }).observe({ type: 'largest-contentful-paint', buffered: true });
  } catch { /* unsupported */ }
  try {
    // Long tasks block scrolling/interaction — a proxy for scroll responsiveness.
    new PerformanceObserver((list) => {
      longTaskCount += list.getEntries().length;
    }).observe({ type: 'longtask', buffered: true });
  } catch { /* unsupported */ }

  setTimeout(() => {
    const nav = performance.getEntriesByType?.('navigation')?.[0];
    track('page_performance', {
      page,
      load_time_ms: nav ? Math.round(nav.loadEventEnd - nav.startTime) : null,
      dom_ready_ms: nav ? Math.round(nav.domContentLoadedEventEnd - nav.startTime) : null,
      lcp_ms: lcpMs,
      long_tasks_first_10s: longTaskCount,
    });
  }, 10000);
}

export default function AnalyticsTracker() {
  const { pathname } = useLocation();

  useEffect(() => {
    reportPagePerformance(pathname);

    // ---- Clicks: which content users interact with most ----
    const onClick = (e) => {
      const el = e.target?.closest?.('a, button, [role="button"]');
      if (!el) return;
      const label = (el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 60);
      if (!label) return;
      track('section_click', { page: pathname, label });
    };
    document.addEventListener('click', onClick, true);

    // ---- Rapid input bursts: autofill, paste, or key-repeat storms ----
    // Reported once per page view so we can spot UX friction in production.
    let inputTimes = [];
    let burstReported = false;
    const onInput = (e) => {
      if (burstReported) return;
      const now = Date.now();
      inputTimes = inputTimes.filter((t) => now - t < 300);
      inputTimes.push(now);
      if (inputTimes.length < 8) return;
      burstReported = true;
      const el = e.target;
      track('rapid_input_burst', {
        page: pathname,
        field: el?.getAttribute?.('aria-label') || el?.name || el?.id || el?.tagName || 'unknown',
        input_type: e.inputType || 'unknown', // e.g. insertFromPaste, insertReplacementText (autofill)
        events_in_300ms: inputTimes.length,
        since_load_ms: Math.round(performance.now()),
      });
    };
    document.addEventListener('input', onInput, true);

    // ---- Section views: which sections users scroll to ----
    const seenSections = new Set();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const section = (entry.target.textContent || '').trim().slice(0, 80);
        if (!section || seenSections.has(section)) return;
        seenSections.add(section);
        track('section_view', { page: pathname, section });
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.5 });
    // Observe headings after the page has rendered.
    const scanId = setTimeout(() => {
      document.querySelectorAll('main h1, main h2, main h3').forEach((h) => observer.observe(h));
    }, 500);

    // ---- Scroll depth milestones (once each per page view) ----
    const hit = new Set();
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        if (max <= 0) return;
        const pct = Math.round((window.scrollY / max) * 100);
        [25, 50, 75, 100].forEach((m) => {
          if (pct >= m && !hit.has(m)) {
            hit.add(m);
            track('scroll_depth', { page: pathname, percent: m });
          }
        });
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      document.removeEventListener('click', onClick, true);
      document.removeEventListener('input', onInput, true);
      window.removeEventListener('scroll', onScroll);
      clearTimeout(scanId);
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}