import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { createPageUrl } from './utils';
import {
  Home, CheckSquare, Zap, MessageSquare, FileText,
  Shield, Heart, Calendar, BookOpen, Menu, X, Volume2,
  Sparkles, TrendingUp, User, Activity, Users,
  FileDown, Mail, ChevronLeft, BarChart2, Search, Globe
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

function BottomNav({ currentPageName }) {
  const items = [
    { name: 'Home', icon: Home, page: 'Home', path: '/' },
    { name: 'Coach', icon: MessageSquare, page: 'Coach', path: '/Coach' },
    { name: 'Journey', icon: BarChart2, page: 'MyJourney', path: '/MyJourney' },
    { name: 'Community', icon: BookOpen, page: 'CommunityHub', path: '/CommunityHub' },
    { name: 'Help', icon: Heart, page: 'HelpSupport', path: '/HelpSupport' },
  ];
  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-purple-900 to-indigo-900 border-t border-purple-600 flex"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = currentPageName === item.page;
        return (
          <Link
            key={item.name}
            to={item.path}
            className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-all ${
              isActive ? 'text-cyan-300' : 'text-purple-300 hover:text-cyan-200'
            }`}
          >
            <Icon className={`h-5 w-5 ${isActive ? 'text-cyan-300' : ''}`} />
            <span className="text-[10px] font-medium">{item.name}</span>
            {isActive && <div className="absolute top-0 w-6 h-0.5 bg-cyan-400 rounded-full" />}
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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
      <OfflineIndicator />
      <NotificationManager />
      {/* Header */}
      <header
        className="bg-gradient-to-r from-purple-900 to-indigo-900 backdrop-blur-md border-b border-purple-500 sticky top-0 z-50"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              {!isHomePage && (
                <button
                  onClick={() => navigate(-1)}
                  className="p-1.5 rounded-lg text-cyan-300 hover:bg-purple-700 transition-colors lg:hidden"
                  aria-label="Go back"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
              )}
            <Link to={createPageUrl('Home')} className="flex items-center space-x-3">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69406c752de234aafebf891d/433da2071_IMG_1196.png"
                alt="Back to Life, Back to Work Navigator"
                className="h-12 w-12 sm:h-14 sm:w-14 object-contain drop-shadow-lg"
              />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                  Navigator
                </h1>
                <p className="text-xs text-cyan-300 hidden sm:block">Your return-to-work compass</p>
              </div>
            </Link>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={toggleSpeech}
                className={`p-2 rounded-lg transition-all ${
                  speechEnabled 
                    ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/50' 
                    : 'bg-purple-700 text-cyan-300 hover:bg-purple-600'
                }`}
                title="Toggle text-to-speech"
              >
                <Volume2 className="h-5 w-5" />
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-purple-700 text-cyan-300"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-purple-500 bg-gradient-to-br from-purple-900 to-indigo-900">
            <nav className="px-4 py-3 space-y-1">
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
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/50'
                        : item.highlight
                        ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white hover:from-pink-500 hover:to-purple-500'
                        : 'text-cyan-300 hover:bg-purple-800'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.name}</span>
                    {item.highlight && !isActive && (
                      <span className="ml-auto text-xs bg-pink-500 text-white px-2 py-0.5 rounded-full shadow-lg shadow-pink-500/50">New</span>
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
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/50'
                      : item.highlight
                      ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white hover:from-pink-500 hover:to-purple-500'
                      : 'text-cyan-300 hover:bg-purple-800/50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium text-sm">{item.name}</span>
                  {item.highlight && !isActive && (
                    <span className="ml-auto text-xs bg-pink-500 text-white px-2 py-0.5 rounded-full shadow-lg shadow-pink-500/50">New</span>
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
      <footer className="bg-gradient-to-r from-purple-950 to-indigo-950 text-cyan-300 mt-16 border-t border-purple-600 mb-16 lg:mb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center space-y-2">
            <p className="text-sm">© 2025 Back to Life, Back to Work for Cancer Survivors</p>
            <p className="text-xs text-cyan-400">Information is for educational purposes only</p>
            <p className="text-xs text-cyan-500 italic">Not meant to be legal advice. Please consult with legal counsel.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}