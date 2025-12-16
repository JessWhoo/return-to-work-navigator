import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from './utils';
import { 
  Home, CheckSquare, Zap, MessageSquare, FileText, 
  Shield, Heart, Calendar, BookOpen, Menu, X, Volume2, Sparkles, TrendingUp
} from 'lucide-react';
import OfflineIndicator from './components/OfflineIndicator';

export default function Layout({ children, currentPageName }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(false);

  const navigation = [
    { name: 'Home', icon: Home, page: 'Home' },
    { name: 'Progress Dashboard', icon: TrendingUp, page: 'ProgressDashboard' },
    { name: 'AI Coach', icon: MessageSquare, page: 'Coach', highlight: true },
    { name: 'My Checklist', icon: CheckSquare, page: 'Checklist' },
    { name: 'Energy & Fatigue', icon: Zap, page: 'EnergyManagement' },
    { name: 'Communication', icon: FileText, page: 'Communication' },
    { name: 'Accommodations', icon: FileText, page: 'Accommodations' },
    { name: 'Legal Rights', icon: Shield, page: 'LegalRights' },
    { name: 'Emotional Support', icon: Heart, page: 'EmotionalSupport' },
    { name: 'Wellness Resources', icon: Sparkles, page: 'WellnessResources' },
    { name: 'Return Planning', icon: Calendar, page: 'ReturnPlanning' },
    { name: 'Resources', icon: BookOpen, page: 'Resources' }
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <OfflineIndicator />
      {/* Header */}
      <header className="bg-slate-900/95 backdrop-blur-md border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to={createPageUrl('Home')} className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-lg">
                <Heart className="h-6 w-6 text-white" fill="white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                  Back to Life, Back to Work
                </h1>
                <p className="text-xs text-slate-400 hidden sm:block">Your journey, your pace</p>
              </div>
            </Link>

            <div className="flex items-center space-x-2">
              <button
                onClick={toggleSpeech}
                className={`p-2 rounded-lg transition-all ${
                  speechEnabled 
                    ? 'bg-teal-600 text-white' 
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
                title="Toggle text-to-speech"
              >
                <Volume2 className="h-5 w-5" />
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-slate-700 text-slate-300"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-700 bg-slate-900">
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
                        ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white'
                        : item.highlight
                        ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-purple-300 hover:from-purple-600/30 hover:to-pink-600/30'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.name}</span>
                    {item.highlight && !isActive && (
                      <span className="ml-auto text-xs bg-purple-500 text-white px-2 py-0.5 rounded-full">New</span>
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
          <nav className="space-y-2 sticky top-24">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = currentPageName === item.page;
              return (
                <Link
                  key={item.name}
                  to={createPageUrl(item.page)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg'
                      : item.highlight
                      ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-purple-300 hover:from-purple-600/30 hover:to-pink-600/30'
                      : 'text-slate-300 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium text-sm">{item.name}</span>
                  {item.highlight && !isActive && (
                    <span className="ml-auto text-xs bg-purple-500 text-white px-2 py-0.5 rounded-full">New</span>
                  )}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8" onClick={(e) => {
          if (speechEnabled && e.target.textContent) {
            speakText(e.target.textContent);
          }
        }}>
          {children}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 mt-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center space-y-2">
            <p className="text-sm">© 2025 Back to Life, Back to Work for Cancer Survivors</p>
            <p className="text-xs text-slate-500">Information is for educational purposes only</p>
            <p className="text-xs text-slate-600 italic">Not meant to be legal advice. Please consult with legal counsel.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}