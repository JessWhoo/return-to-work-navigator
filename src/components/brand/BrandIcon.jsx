import React from 'react';

/**
 * Navigator icons — 1:1 from the design system's Icons section.
 * Line icons, 1.75 stroke, currentColor.
 */
const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
};

const make = (paths) => function BrandIcon({ className = 'h-6 w-6' }) {
  return <svg {...base} className={className}>{paths}</svg>;
};

export const CompassIcon = make([
  <circle key="a" cx="12" cy="12" r="9" />,
  <path key="b" d="M15.5 8.5l-2 5-5 2 2-5z" />,
]);

export const HomeIcon = make([
  <path key="a" d="M4 11l8-6.5 8 6.5" />,
  <path key="b" d="M6 10v9h12v-9" />,
  <path key="c" d="M10 19v-5h4v5" />,
]);

export const JourneyIcon = make([
  <path key="a" d="M12 21s-6-5.5-6-10a6 6 0 0112 0c0 4.5-6 10-6 10z" />,
  <circle key="b" cx="12" cy="11" r="2.2" />,
]);

export const ProfileIcon = make([
  <circle key="a" cx="12" cy="8.5" r="3.5" />,
  <path key="b" d="M5 20c1-3.5 3.8-5 7-5s6 1.5 7 5" />,
]);

export const ScheduleIcon = make([
  <rect key="a" x="4" y="5.5" width="16" height="14" rx="3" />,
  <path key="b" d="M8 3.5v4M16 3.5v4M4 10h16" />,
]);

export const MessageIcon = make([
  <path key="a" d="M5 5.5h14a1.5 1.5 0 011.5 1.5v8.5A1.5 1.5 0 0119 17h-8l-4.5 3.5V17H5a1.5 1.5 0 01-1.5-1.5V7A1.5 1.5 0 015 5.5z" />,
]);

export const AddStepIcon = make([
  <circle key="a" cx="12" cy="12" r="9" />,
  <path key="b" d="M12 8v8M8 12h8" />,
]);

export const StepCompleteIcon = make([
  <circle key="a" cx="12" cy="12" r="9" />,
  <path key="b" d="M8 12.5l2.7 2.7L16 9.8" />,
]);

export const NeedsAttentionIcon = make([
  <path key="a" d="M12 4l9 15.5H3z" />,
  <path key="b" d="M12 10v4" />,
  <circle key="c" cx="12" cy="16.8" r=".6" fill="currentColor" />,
]);

export const WellbeingIcon = make([
  <path key="a" d="M3 18l5-6 4 4 3-3 6 5" />,
  <circle key="b" cx="16" cy="7" r="2.2" />,
]);

export const BRAND_LOGO = 'https://media.base44.com/images/public/workspaces/69236cd11ccdb53e7faadc87/brands/6032724af_brand_upload_logo.png';
export const BRAND_NAME = 'Navigator';