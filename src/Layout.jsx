import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { createPageUrl } from './utils';
import { BookOpen, ChevronLeft, FileText, Heart, Menu, X, Volume2 } from 'lucide-react';
import OfflineIndicator from './components/OfflineIndicator';
import NotificationManager from './components/NotificationManager';
import ErrorBoundary from './components/ErrorBoundary';
import GlobalSearch from './components/search/GlobalSearch';
import AnalyticsTracker from './components/analytics/AnalyticsTracker';
import { applyAccessibilityMode, isAccessibilityModeOn } from '@/lib/accessibilityMode';
import ListenButton from './components/a11y/ListenButton';
import StructuredData from './components/seo/StructuredData';
import BrandMark from '@/components/brand/BrandMark';
import {
  CompassIcon, HomeIcon, JourneyIcon, MessageIcon, ScheduleIcon,
  WellbeingIcon, NeedsAttentionIcon, ProfileIcon, StepCompleteIcon,
} from '@/components/brand/BrandIcon';

// Resource / article style pages where listening to the content is useful.
const READABLE_PAGES = new Set([
  'Resources', 'ResourceLibrary', 'WellnessResources', 'WellnessLibrary',
  'Blog', 'ExpertAdvice', 'ExpertQA', 'FAQ', 'LegalRights', 'LegalPolicyHub',
  'StateByStateLaws', 'InternationalLaws', 'DisclosureGuide', 'Accommodations',
  'About', 'PrivacySecurity', 'Roadmap', 'ManagerGuide',
]);

// Primary destinations — pill nav items in the header.
const PRIMARY_NAV = [
  { name: 'Home', icon: HomeIcon, page: 'Home', path: '/' },
  { name: 'AI Coach', icon: MessageIcon, page: 'Coach', path: '/Coach', isNew: true },
  { name: 'My Journey', icon: JourneyIcon, page: 'MyJourney', path: '/MyJourney' },
  { name: 'Community', icon: CompassIcon, page: 'CommunityHub', path: '/CommunityHub' },
  { name: 'Help', icon: WellbeingIcon, page: 'HelpSupport', path: '/HelpSupport' },
];

// Grouped tool links — pill nav items in the sidebar and the mobile panel.
const NAV_GROUPS = [
  {
    label: 'Your Return Journey',
    items: [
      { name: 'My Journey', icon: JourneyIcon, page: 'MyJourney' },
      { name: 'Career & Return', icon: ScheduleIcon, page: 'CareerHub' },
      { name: 'Health & Well-Being', icon: WellbeingIcon, page: 'WellbeingHub' },
      { name: 'Wellness Library', icon: BookOpen, page: 'WellnessLibrary' },
    ],
  },
  {
    label: 'Tools & Rights',
    items: [
      { name: 'Communication Toolkit', icon: FileText, page: 'CommunicationToolkit' },
      { name: 'Legal & Policy', icon: NeedsAttentionIcon, page: 'LegalPolicyHub' },
      { name: 'For Managers & HR', icon: ProfileIcon, page: 'ManagerGuide' },
    ],
  },
  {
    label: 'Community & Help',
    items: [
      { name: 'Community & Resources', icon: CompassIcon, page: 'CommunityHub' },
      { name: 'Help & Support', icon: Heart, page: 'HelpSupport' },
      { name: 'My Feedback', icon: StepCompleteIcon, page: 'MyFeedback' },
    ],
  },
];

// Per-tab scroll-position memory so switching tabs preserves where you were.
const TAB_SCROLL_KEY = '__tabScrollPositions__';
function readScrollMap() {
  try { return JSON.parse(sessionStorage.getItem(TAB_SCROLL_KEY) || '{}'); }
  catch { return {}; }
}
function writeScrollMap(map) {
  try { sessionStorage.setItem(TAB_SCROLL_KEY, JSON.stringify(map)); } catch {}
}

function BottomNav({ currentPageName }) {
  const location = useLocation();

  const handleTabClick = () => {
    const map = readScrollMap();
    map[location.pathname] = window.scrollY || document.documentElement.scrollTop || 0;
    writeScrollMap(map);
  };

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-brand-background border-t border-brand-border shadow-brand-sm flex"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {PRIMARY_NAV.map((item) => {
        const Icon = item.icon;
        const isActive = currentPageName === item.page;
        return (
          <Link
            key={item.name}
            to={item.path}
            onClick={handleTabClick}
            aria-current={isActive ? 'page' : undefined}
            className="nv-navitem nv-navitem--stack flex-1 justify-center"
          >
            <Icon className="h-6 w-6" />
            <span>{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export default function Layout({ children, currentPageName }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(false);

  // Restore the saved accessibility mode preference on every load.
  useEffect(() => {
    applyAccessibilityMode(isAccessibilityModeOn());
  }, []);

  // Restore previous scroll position for this path (if any) on navigation,
  // otherwise scroll to top. Save current scroll before leaving.
  useEffect(() => {
    const map = readScrollMap();
    const saved = map[location.pathname];
    const id = requestAnimationFrame(() => {
      window.scrollTo({ top: typeof saved === 'number' ? saved : 0, behavior: 'auto' });
    });

    const saveCurrent = () => {
      const m = readScrollMap();
      m[location.pathname] = window.scrollY || document.documentElement.scrollTop || 0;
      writeScrollMap(m);
    };
    window.addEventListener('pagehide', saveCurrent);

    return () => {
      cancelAnimationFrame(id);
      saveCurrent();
      window.removeEventListener('pagehide', saveCurrent);
    };
  }, [location.pathname]);

  const isHomePage = currentPageName === 'Home' || location.pathname === '/';

  const toggleSpeech = () => {
    // speechSynthesis is unavailable or throws in some browsers/webviews —
    // never let the toggle click crash the page.
    try {
      if (!window.speechSynthesis) return;
      if (!speechEnabled) {
        const utterance = new SpeechSynthesisUtterance("Text-to-speech enabled. Click on any text to hear it read aloud.");
        window.speechSynthesis.speak(utterance);
      } else {
        window.speechSynthesis.cancel();
      }
      setSpeechEnabled(!speechEnabled);
    } catch (err) {
      console.error('[Layout] toggleSpeech failed:', err);
    }
  };

  const speakText = (text) => {
    if (!speechEnabled || !text) return;
    // This runs from a click handler attached to ALL page clicks — a throw
    // here would error on every single click, causing a cascading error loop.
    try {
      if (!window.speechSynthesis) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error('[Layout] speakText failed:', err);
    }
  };

  return (
    <div className="relative min-h-screen bg-brand-background text-brand-text">
      <StructuredData />
      <OfflineIndicator />
      <NotificationManager />
      <AnalyticsTracker />

      {/* Header — light cream bar, compass mark at the left, pill nav items */}
      <header
        className="relative z-50 bg-brand-background border-b border-brand-border sticky top-0"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center gap-4 py-3">
            <div className="flex items-center gap-2">
              {!isHomePage && (
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="nv-btn nv-btn--outline nv-btn--icon lg:hidden"
                  aria-label="Go back"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
              )}
              <Link to={createPageUrl('Home')} aria-label="Navigator home">
                <BrandMark showTagline className="hidden sm:inline-flex" />
                <BrandMark className="sm:hidden" />
              </Link>
            </div>

            {/* Primary pill nav (desktop) */}
            <nav className="hidden xl:flex items-center gap-1">
              {PRIMARY_NAV.map((item) => {
                const Icon = item.icon;
                const isActive = currentPageName === item.page;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    aria-current={isActive ? 'page' : undefined}
                    className="nv-navitem"
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                    {item.isNew && !isActive && <span className="nv-chip !px-2 !py-0.5">New</span>}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-2">
              <div className="hidden md:block w-56 lg:w-72">
                <GlobalSearch />
              </div>
              <button
                type="button"
                onClick={toggleSpeech}
                aria-pressed={speechEnabled}
                aria-label="Toggle read aloud"
                className={`nv-btn nv-btn--icon ${speechEnabled ? 'nv-btn--secondary' : 'nv-btn--outline'}`}
              >
                <Volume2 className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-expanded={mobileMenuOpen}
                aria-label="Menu"
                className="nv-btn nv-btn--icon nv-btn--outline xl:hidden"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div className="md:hidden pb-3">
            <GlobalSearch />
          </div>
        </div>

        {/* Mobile / tablet panel */}
        {mobileMenuOpen && (
          <div className="xl:hidden border-t border-brand-border bg-brand-background max-h-[calc(100vh-5rem)] overflow-y-auto">
            <nav className="px-4 py-4 pb-8 space-y-5">
              <div className="space-y-1">
                {PRIMARY_NAV.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPageName === item.page;
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      aria-current={isActive ? 'page' : undefined}
                      className="nv-navitem"
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.name}</span>
                      {item.isNew && !isActive && <span className="nv-chip ml-auto !px-2 !py-0.5">New</span>}
                    </Link>
                  );
                })}
              </div>
              {NAV_GROUPS.map((group) => (
                <div key={group.label} className="space-y-1">
                  <div className="nv-eyebrow px-4 pt-2 pb-1">{group.label}</div>
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentPageName === item.page;
                    return (
                      <Link
                        key={item.name}
                        to={createPageUrl(item.page)}
                        onClick={() => setMobileMenuOpen(false)}
                        aria-current={isActive ? 'page' : undefined}
                        className="nv-navitem"
                      >
                        <Icon className="h-5 w-5" />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              ))}
            </nav>
          </div>
        )}
      </header>

      <div className="flex max-w-7xl mx-auto">
        {/* Desktop sidebar — grouped tool links as pill items */}
        <aside className="hidden lg:block w-72 p-6">
          <nav className="space-y-5">
            {NAV_GROUPS.map((group) => (
              <div key={group.label} className="space-y-1">
                <div className="nv-eyebrow px-4 pb-1">{group.label}</div>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPageName === item.page;
                  return (
                    <Link
                      key={item.name}
                      to={createPageUrl(item.page)}
                      aria-current={isActive ? 'page' : undefined}
                      className="nv-navitem"
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-28 lg:pb-8" onClick={(e) => {
          try {
            const target = /** @type {HTMLElement} */ (e.target);
            if (speechEnabled && target?.textContent) {
              speakText(target.textContent);
            }
          } catch (err) {
            console.error('[Layout] click-to-speak handler failed:', err);
          }
        }}>
          {/* Plain entrance animation only — a wait-mode exit could leave the
              main area empty when a navigation interrupted the outgoing page. */}
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.12, ease: 'easeOut' }}
          >
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </motion.div>
        </main>
      </div>

      {READABLE_PAGES.has(currentPageName) && <ListenButton />}

      <BottomNav currentPageName={currentPageName} />

      {/* Footer — quiet muted band */}
      <footer className="nv-footer mt-16 mb-20 lg:mb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center space-y-2">
            <p className="text-sm font-semibold text-brand-text">© 2026 Back to Life, Back to Work for Cancer Survivors</p>
            <p className="text-xs">Information is for educational purposes only</p>
            <p className="text-xs italic">Not meant to be legal advice. Please consult with legal counsel.</p>
            <div className="flex justify-center gap-4 pt-1 flex-wrap">
              <Link to="/About" className="text-xs font-semibold text-brand-primary underline transition-colors hover:text-brand-text">About</Link>
              <Link to="/Contact" className="text-xs font-semibold text-brand-primary underline transition-colors hover:text-brand-text">Contact</Link>
              <Link to="/PrivacySecurity" className="text-xs font-semibold text-brand-primary underline transition-colors hover:text-brand-text">Privacy & Security</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}