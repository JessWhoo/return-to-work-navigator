import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { createPageUrl } from './utils';
import {
  Home, Zap, MessageSquare, FileText,
  Shield, Heart, Calendar, BookOpen, Menu, X, Volume2,
  TrendingUp, ChevronLeft, BarChart2
} from 'lucide-react';
import OfflineIndicator from './components/OfflineIndicator';
import NotificationManager from './components/NotificationManager';

// Apply dark mode based on system preference
if (typeof window !== 'undefined') {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (prefersDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

// Per-tab scroll-position memory so switching tabs preserves where you were.
// Tab "stack" key = the bottom-nav root path. Sub-pages reached from a tab keep
// their own scroll under that same root key.
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
  const items = [
    { name: 'Home', icon: Home, page: 'Home', path: '/' },
    { name: 'Coach', icon: MessageSquare, page: 'Coach', path: '/Coach' },
    { name: 'Journey', icon: BarChart2, page: 'MyJourney', path: '/MyJourney' },
    { name: 'Community', icon: BookOpen, page: 'CommunityHub', path: '/CommunityHub' },
    { name: 'Help', icon: Heart, page: 'HelpSupport', path: '/HelpSupport' },
  ];

  const handleTabClick = () => {
    // Save current scroll for the path being left, so it can be restored on return.
    const map = readScrollMap();
    map[location.pathname] = window.scrollY || document.documentElement.scrollTop || 0;
    writeScrollMap(map);
  };

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-slate-300 shadow-lg flex"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = currentPageName === item.page;
        return (
          <Link
            key={item.name}
            to={item.path}
            onClick={handleTabClick}
            className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-all relative ${
              isActive ? 'text-violet-700' : 'text-slate-700 hover:text-violet-700'
            }`}
          >
            <Icon className={`h-5 w-5 ${isActive ? 'text-violet-700' : ''}`} />
            <span className="text-[10px] font-bold">{item.name}</span>
            {isActive && <div className="absolute top-0 w-8 h-1 bg-violet-600 rounded-full" />}
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

  // Keep dark mode in sync with system preference
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e) => {
      document.documentElement.classList.toggle('dark', e.matches);
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Restore previous scroll position for this path (if any) on navigation,
  // otherwise scroll to top. Save current scroll before leaving.
  useEffect(() => {
    const map = readScrollMap();
    const saved = map[location.pathname];
    // Defer one frame so the new page has rendered.
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

  const navigation = [
    { name: 'Home', icon: Home, page: 'Home' },
    { name: 'AI Coach', icon: MessageSquare, page: 'Coach', highlight: true },
    { name: 'My Journey', icon: TrendingUp, page: 'MyJourney' },
    { name: 'Health & Well-Being', icon: Zap, page: 'WellbeingHub' },
    { name: 'Communication Toolkit', icon: FileText, page: 'CommunicationToolkit' },
    { name: 'Legal & Policy', icon: Shield, page: 'LegalPolicyHub' },
    { name: 'Career & Return', icon: Calendar, page: 'CareerHub' },
    { name: 'Community & Resources', icon: BookOpen, page: 'CommunityHub' },
    { name: 'Help & Support', icon: Heart, page: 'HelpSupport' },
  ];

  const toggleSpeech = () => {
    if (!speechEnabled) {
      const utterance = new SpeechSynthesisUtterance("Text-to-speech enabled. Click on any text to hear it read aloud.");
      window.speechSynthesis.speak(utterance);
    } else {
      window.speechSynthesis.cancel();
    }
    setSpeechEnabled(!speechEnabled);
  };

  const speakText = (text) => {
    if (speechEnabled && text) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-50 overflow-hidden">
      <OfflineIndicator />
      <NotificationManager />
      {/* Header */}
      <header
        className="relative z-50 bg-white border-b-2 border-slate-300 shadow-sm sticky top-0"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              {!isHomePage && (
                <button
                  onClick={() => navigate(-1)}
                  className="p-1.5 rounded-lg text-slate-800 hover:bg-slate-100 transition-colors lg:hidden"
                  aria-label="Go back"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
              )}
            <Link to={createPageUrl('Home')} className="flex items-center space-x-3">
              <img 
                src="https://media.base44.com/images/public/69406c752de234aafebf891d/accf1a360_Gemini_Generated_Image_judm8cjudm8cjudm.png"
                alt="Back to Life, Back to Work Navigator"
                className="h-12 w-12 sm:h-14 sm:w-14 object-contain rounded-full drop-shadow-lg"
              />
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-violet-600 via-purple-500 to-emerald-600 bg-clip-text text-transparent">
                  Navigator
                </h1>
                <p className="text-xs text-slate-700 font-semibold hidden sm:block">Your return-to-work compass</p>
              </div>
            </Link>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={toggleSpeech}
                className={`p-2 rounded-lg transition-all ${
                  speechEnabled 
                    ? 'bg-gradient-to-br from-violet-500 to-emerald-600 text-white shadow-md' 
                    : 'bg-white text-slate-800 hover:bg-slate-100 border-2 border-slate-300'
                }`}
                title="Toggle text-to-speech"
              >
                <Volume2 className="h-5 w-5" />
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-800"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t-2 border-slate-300 bg-white shadow-lg max-h-[calc(100vh-5rem)] overflow-y-auto">
            <nav className="px-4 py-3 pb-6 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = currentPageName === item.page;
                return (
                  <Link
                    key={item.name}
                    to={createPageUrl(item.page)}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-violet-600 to-emerald-600 text-white shadow-md font-bold'
                        : item.highlight
                        ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white hover:from-violet-600 hover:to-purple-600 font-bold'
                        : 'text-slate-800 hover:bg-slate-100 font-semibold'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                    {item.highlight && !isActive && (
                      <span className="ml-auto text-xs bg-emerald-500 text-white px-2 py-0.5 rounded-full shadow-lg shadow-emerald-500/50">New</span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </header>

      <div className="flex max-w-7xl mx-auto">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 p-6">
          <nav className="space-y-2 sticky top-24 overflow-y-auto max-h-[calc(100vh-7rem)] scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = currentPageName === item.page;
              return (
                <Link
                  key={item.name}
                  to={createPageUrl(item.page)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-violet-600 to-emerald-600 text-white shadow-md font-bold'
                      : item.highlight
                      ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white hover:from-violet-600 hover:to-purple-600 font-bold'
                      : 'text-slate-800 hover:bg-slate-100 font-semibold'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-sm">{item.name}</span>
                  {item.highlight && !isActive && (
                    <span className="ml-auto text-xs bg-emerald-500 text-white px-2 py-0.5 rounded-full shadow-lg shadow-emerald-500/50">New</span>
                  )}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8" onClick={(e) => {
          const target = /** @type {HTMLElement} */ (e.target);
          if (speechEnabled && target?.textContent) {
            speakText(target.textContent);
          }
        }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Bottom Nav (mobile only) */}
      <BottomNav currentPageName={currentPageName} />

      {/* Footer */}
      <footer className="relative bg-white text-slate-900 mt-16 border-t-2 border-slate-300 mb-16 lg:mb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center space-y-2">
            <p className="text-sm font-semibold">© 2025 Back to Life, Back to Work for Cancer Survivors</p>
            <p className="text-xs text-slate-700 font-medium">Information is for educational purposes only</p>
            <p className="text-xs text-slate-700 italic font-medium">Not meant to be legal advice. Please consult with legal counsel.</p>
            <div className="flex justify-center gap-4 pt-1">
              <Link to="/About" className="text-xs text-violet-700 hover:text-violet-800 font-bold underline transition-colors">About</Link>
              <Link to="/Contact" className="text-xs text-violet-700 hover:text-violet-800 font-bold underline transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
      </div>
  );
}