import { useEffect } from 'react';

const SITE = 'https://return-to-work-navigator-febf891d.base44.app';

// Injects site-level JSON-LD so search engines can identify the organization,
// the site (with a search action), and the app itself.
const GRAPH = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE}/#organization`,
      name: 'Back to Life, Back to Work',
      url: SITE,
      description:
        'Guidance, tools and resources helping cancer survivors return to work with confidence.',
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE}/#website`,
      url: SITE,
      name: 'Navigator — Back to Life, Back to Work',
      publisher: { '@id': `${SITE}/#organization` },
      inLanguage: 'en-US',
    },
    {
      '@type': 'WebApplication',
      name: 'Return to Work Navigator',
      url: SITE,
      applicationCategory: 'HealthApplication',
      operatingSystem: 'Web, iOS, Android',
      description:
        'A return-to-work toolkit for cancer survivors: fatigue management, workplace accommodations, legal rights, communication templates and an AI coach.',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    },
  ],
};

export default function StructuredData() {
  useEffect(() => {
    const id = 'site-structured-data';
    if (document.getElementById(id)) return;
    const script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(GRAPH);
    document.head.appendChild(script);
  }, []);

  return null;
}