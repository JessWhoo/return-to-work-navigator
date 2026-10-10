import React from 'react';
import { BRAND_LOGO, BRAND_NAME } from './BrandIcon';

/**
 * The compass mark + wordmark lockup used in the header and the hero.
 */
export default function BrandMark({ size = 'md', showTagline = false, className = '' }) {
  const dims = size === 'lg' ? 'h-20 w-20' : size === 'sm' ? 'h-10 w-10' : 'h-12 w-12';
  const word = size === 'lg' ? 'text-3xl' : 'text-xl';

  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <img
        src={BRAND_LOGO}
        alt={`${BRAND_NAME} compass mark`}
        className={`${dims} flex-shrink-0 rounded-full border border-brand-border bg-brand-surface object-contain p-0.5 shadow-brand-sm`}
      />
      <span className="leading-tight">
        <span className={`block font-heading ${word} font-bold text-brand-primary`}>{BRAND_NAME}</span>
        {showTagline && (
          <span className="block text-xs text-brand-muted-foreground">Back to life, back to work</span>
        )}
      </span>
    </span>
  );
}