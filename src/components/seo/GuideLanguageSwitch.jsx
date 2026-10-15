import React from 'react';
import { Link } from 'react-router-dom';
import { Globe } from 'lucide-react';

/**
 * Pill language switcher linking the English and Spanish editions of a guide.
 */
export default function GuideLanguageSwitch({ englishPath, spanishPath, currentLang = 'en' }) {
  return (
    <div
      role="group"
      aria-label={currentLang === 'es' ? 'Selector de idioma de la guía' : 'Guide language selector'}
      className="inline-flex items-center gap-1 rounded-pill border border-brand-border bg-brand-surface p-1 text-xs font-bold"
    >
      <Globe className="h-3.5 w-3.5 text-brand-primary ml-2 mr-0.5 shrink-0" aria-hidden="true" />
      <Link
        to={englishPath}
        hrefLang="en"
        lang="en"
        aria-current={currentLang === 'en' ? 'page' : undefined}
        className={`px-3 py-1 rounded-pill transition-colors ${
          currentLang === 'en'
            ? 'bg-brand-primary text-white'
            : 'text-brand-text hover:bg-brand-muted'
        }`}
      >
        English
      </Link>
      <Link
        to={spanishPath}
        hrefLang="es"
        lang="es"
        aria-current={currentLang === 'es' ? 'page' : undefined}
        className={`px-3 py-1 rounded-pill transition-colors ${
          currentLang === 'es'
            ? 'bg-brand-primary text-white'
            : 'text-brand-text hover:bg-brand-muted'
        }`}
      >
        Español
      </Link>
    </div>
  );
}