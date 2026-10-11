import React from 'react';
import { Link } from 'react-router-dom';
import BrandMark from '@/components/brand/BrandMark';

export default function NavigatorFooter({ navigation }) {
  return (
    <footer className="nv-footer mt-12 mb-20 lg:mb-0">
      <div className="mx-auto max-w-7xl space-y-7 px-5 py-10 sm:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-3"><BrandMark size="sm" showName={false} /><div><p className="font-heading text-base font-semibold text-brand-text">The Return to Work Navigator</p><p className="mt-1 text-sm text-brand-muted-foreground">Guidance Today. A Brighter Tomorrow.</p></div></div>
          <nav aria-label="Footer navigation" className="flex flex-wrap justify-center gap-1">{navigation.map(item => <Link key={item.path} to={item.path} className="nv-navitem">{item.name}</Link>)}</nav>
        </div>
        <div className="border-t border-brand-border pt-5 text-center">
          <nav aria-label="Legal and accessibility" className="flex flex-wrap justify-center gap-2">
            <Link to="/About" className="nv-btn nv-btn--text nv-btn--sm">About</Link><Link to="/Contact" className="nv-btn nv-btn--text nv-btn--sm">Contact</Link><Link to="/PrivacySecurity" className="nv-btn nv-btn--text nv-btn--sm">Privacy & Security</Link><Link to="/Profile" className="nv-btn nv-btn--text nv-btn--sm">Accessibility preferences</Link>
          </nav>
          <p className="mt-4 text-xs">© 2026 Back to Life, Back to Work for Cancer Survivors</p><p className="mt-2 text-xs">Information is for educational purposes only</p><p className="mt-1 text-xs italic">Not meant to be legal advice. Please consult with legal counsel.</p>
        </div>
      </div>
    </footer>
  );
}