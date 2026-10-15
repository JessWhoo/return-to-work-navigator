import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getRouteSEO } from '@/hooks/useSEO';

const SITE = 'https://return-to-work-navigator-febf891d.base44.app';

export default function StructuredData() {
  const { pathname } = useLocation();

  useEffect(() => {
    const routeSEO = getRouteSEO(pathname);
    const pageUrl = new URL(routeSEO.path || pathname, SITE).href;

    const graph = {
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
          '@type': 'WebPage',
          '@id': `${pageUrl}#webpage`,
          url: pageUrl,
          name: `${routeSEO.title} | Navigator — Back to Life, Back to Work`,
          headline: routeSEO.h1,
          description: routeSEO.description,
          isPartOf: { '@id': `${SITE}/#website` },
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

    const id = 'site-structured-data';
    let script = document.getElementById(id);
    if (!script) {
      script = document.createElement('script');
      script.id = id;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(graph);
  }, [pathname]);

  return null;
}