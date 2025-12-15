import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from './utils';
import { 
  Home, CheckSquare, Zap, MessageSquare, FileText, 
  Shield, Heart, Calendar, BookOpen, Menu, X, Volume2
} from 'lucide-react';

export default function Layout({ children, currentPageName }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(false);

  const navigation = [
    { name: 'Home', icon: Home, page: 'Home' },
    { name: 'AI Coach', icon: MessageSquare, page: 'Coach', highlight: true },
    { name: 'My Checklist', icon: CheckSquare, page: 'Checklist' },
    { name: 'Energy & Fatigue', icon: Zap, page: 'EnergyManagement' },
    { name: 'Communication', icon: FileText, page: 'Communication' },
    { name: 'Accommodations', icon: FileText, page: 'Accommodations' },
    { name: 'Legal Rights', icon: Shield, page: 'LegalRights' },
    { name: 'Emotional Support', icon: Heart, page: 'EmotionalSupport' },
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-teal-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-rose-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to={createPageUrl('Home')} className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-rose-400 to-teal-400 flex items-center justify-center">
                <Heart className="h-6 w-6 text-white" fill="white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-rose-600 to-teal-600 bg-clip-text text-transparent">
                  Back to Life, Back to Work
                </h1>
                <p className="text-xs text-gray-500 hidden sm:block">Your journey, your pace</p>
              </div>
            </Link>

            <div className="flex items-center space-x-2">
              <button
                onClick={toggleSpeech}
                className={`p-2 rounded-lg transition-all ${
                  speechEnabled 
                    ? 'bg-teal-100 text-teal-700' 
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
                title="Toggle text-to-speech"
              >
                <Volume2 className="h-5 w-5" />
              </button>
              
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-rose-100 bg-white">
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
                        ? 'bg-gradient-to-r from-rose-100 to-teal-100 text-rose-700'
                        : item.highlight
                        ? 'bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 hover:from-purple-100 hover:to-pink-100'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.name}</span>
                    {item.highlight && !isActive && (
                      <span className="ml-auto text-xs bg-purple-200 text-purple-700 px-2 py-0.5 rounded-full">New</span>
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
                      ? 'bg-gradient-to-r from-rose-100 to-teal-100 text-rose-700 shadow-sm'
                      : item.highlight
                      ? 'bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 hover:from-purple-100 hover:to-pink-100'
                      : 'text-gray-700 hover:bg-white/50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium text-sm">{item.name}</span>
                  {item.highlight && !isActive && (
                    <span className="ml-auto text-xs bg-purple-200 text-purple-700 px-2 py-0.5 rounded-full">New</span>
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
      <footer className="bg-gray-900 text-gray-300 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center space-y-2">
            <p className="text-sm">© 2025 Back to Life, Back to Work for Cancer Survivors</p>
            <p className="text-xs text-gray-400">Information is for educational purposes only</p>
            <p className="text-xs text-gray-500 italic">Not meant to be legal advice. Please consult with legal counsel.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}