import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getRouteSEO } from '@/hooks/useSEO';
import { GUIDE_FAQ_BY_PATH } from './guideFaqsData';

const SITE = 'https://return-to-work-navigator.org';

export default function StructuredData() {
  const { pathname } = useLocation();

  useEffect(() => {
    const routeSEO = getRouteSEO(pathname);
    const pageUrl = new URL(routeSEO.path || '/', SITE).href;
    const normalizedPath = (routeSEO.path || pathname || '/').toLowerCase();
    const guideFaqs = GUIDE_FAQ_BY_PATH[normalizedPath];

    const nodes = [
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
    ];

    if (routeSEO.isKnownRoute && !routeSEO.noindex) {
      const pageLang = routeSEO.lang || 'en-US';
      nodes.push({
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: `${routeSEO.title} | Navigator — Back to Life, Back to Work`,
        headline: routeSEO.h1,
        description: routeSEO.description,
        isPartOf: { '@id': `${SITE}/#website` },
        inLanguage: pageLang,
      });

      if (guideFaqs && guideFaqs.length > 0) {
        nodes.push({
          '@type': 'Article',
          '@id': `${pageUrl}#article`,
          headline: routeSEO.h1 || routeSEO.title,
          description: routeSEO.description,
          mainEntityOfPage: { '@id': `${pageUrl}#webpage` },
          author: {
            '@type': 'Person',
            name: 'Jess Whorton',
            jobTitle: 'Founder, Cancer Survivor & HR Leader',
          },
          publisher: { '@id': `${SITE}/#organization` },
          inLanguage: pageLang,
        });

        nodes.push({
          '@type': 'FAQPage',
          '@id': `${pageUrl}#faq`,
          url: pageUrl,
          isPartOf: { '@id': `${pageUrl}#webpage` },
          inLanguage: pageLang,
          mainEntity: guideFaqs.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: item.answer,
            },
          })),
        });
      }
    }

    const graph = {
      '@context': 'https://schema.org',
      '@graph': nodes,
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