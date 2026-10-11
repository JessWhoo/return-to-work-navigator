import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, ClipboardList, Users, Heart, Briefcase, MessagesSquare } from 'lucide-react';
import { JourneyIcon, CompassIcon } from '@/components/brand/BrandIcon';

const items = [
  { label: 'Get Started', path: '/Checklist', icon: JourneyIcon, tone: 'bg-brand-muted' },
  { label: 'Learn', path: '/ResourceLibrary', icon: BookOpen, tone: 'bg-accent/50' },
  { label: 'Plan', path: '/ReturnPlanning', icon: ClipboardList, tone: 'bg-secondary/30' },
  { label: 'Support', path: '/HelpSupport', icon: Users, tone: 'bg-brand-muted' },
  { label: 'Wellbeing', path: '/WellbeingHub', icon: Heart, tone: 'bg-accent/50' },
  { label: 'Return to Work', path: '/CareerHub', icon: Briefcase, tone: 'bg-secondary/30' },
  { label: 'Tools', path: '/CommunicationToolkit', icon: CompassIcon, tone: 'bg-brand-muted' },
  { label: 'Community', path: '/CommunityHub', icon: MessagesSquare, tone: 'bg-accent/50' },
];

export default function HomeQuickNav() {
  const { pathname } = useLocation();
  return (
    <nav aria-label="Explore Navigator" className="grid grid-cols-4 gap-x-2 gap-y-4 py-6 sm:gap-4 lg:grid-cols-8 lg:py-8">
      {items.map(({ label, path, icon: Icon, tone }) => <Link key={label} to={path} aria-current={pathname === path ? 'page' : undefined} className="nv-quick-link flex flex-col items-center gap-3 px-1 py-2 text-center text-xs font-semibold text-brand-text sm:text-sm">
        <span className={`nv-home-nav-icon flex h-14 w-14 items-center justify-center rounded-pill sm:h-16 sm:w-16 ${tone}`}><Icon className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" /></span>
        <span>{label}</span>
      </Link>)}
    </nav>
  );
}