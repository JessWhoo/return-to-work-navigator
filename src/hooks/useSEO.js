import { useEffect } from 'react';

/**
 * Updates document title, meta description, and canonical URL per page.
 * Also updates Open Graph and Twitter card tags for social sharing.
 */
function setMeta(selector, attr, value) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement('meta');
    const [, name] = selector.match(/\[(.+?)="(.+?)"\]/) || [];
    if (name) {
      const key = selector.includes('property=') ? 'property' : 'name';
      el.setAttribute(key, selector.match(/="(.+?)"/)[1]);
    }
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
}

export default function useSEO({ title, description, path } = {}) {
  useEffect(() => {
    const baseTitle = 'Navigator — Back to Life, Back to Work';
    const fullTitle = title ? `${title} | ${baseTitle}` : `${baseTitle} for Cancer Survivors`;

    document.title = fullTitle;

    if (description) {
      setMeta('meta[name="description"]', 'content', description);
      setMeta('meta[property="og:description"]', 'content', description);
      setMeta('meta[name="twitter:description"]', 'content', description);
    }

    setMeta('meta[property="og:title"]', 'content', fullTitle);
    setMeta('meta[name="twitter:title"]', 'content', fullTitle);

    // Canonical
    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', path || window.location.pathname);
  }, [title, description, path]);
}