import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from './utils';
import { 
  Home, CheckSquare, Zap, MessageSquare, FileText, 
  Shield, Heart, Calendar, BookOpen, Menu, X, Volume2, Sparkles, TrendingUp, User, Trophy, Activity, Users, FileDown
} from 'lucide-react';
import OfflineIndicator from './components/OfflineIndicator';
import NotificationManager from './components/NotificationManager';

export default function Layout({ children, currentPageName }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(false);

  const navigation = [
    { name: 'Home', icon: Home, page: 'Home' },
    { name: 'My Profile', icon: User, page: 'Profile' },
    { name: 'AI Coach', icon: MessageSquare, page: 'Coach', highlight: true },
    { name: 'Achievements', icon: Trophy, page: 'Gamification' },
    { name: 'Progress Dashboard', icon: TrendingUp, page: 'ProgressDashboard' },
    { name: 'My Checklist', icon: CheckSquare, page: 'Checklist' },
    { name: 'Energy & Fatigue', icon: Zap, page: 'EnergyManagement' },
    { name: 'Symptom Analysis', icon: Activity, page: 'SymptomAnalysis' },
    { name: 'Communication', icon: FileText, page: 'Communication' },
    { name: 'Accommodations', icon: FileText, page: 'Accommodations' },
    { name: 'Legal Rights', icon: Shield, page: 'LegalRights' },
    { name: 'Emotional Support', icon: Heart, page: 'EmotionalSupport' },
    { name: 'Wellness Resources', icon: Sparkles, page: 'WellnessResources' },
    { name: 'Return Planning', icon: Calendar, page: 'ReturnPlanning' },
    { name: 'Resources', icon: BookOpen, page: 'Resources' },
    { name: 'Meeting Prep', icon: Users, page: 'MeetingPrep' },
    { name: 'LinkedIn Network', icon: Users, page: 'LinkedInNetworking' },
    { name: 'Record Keeping', icon: FileText, page: 'RecordKeeping' },
    { name: 'FAQ', icon: MessageSquare, page: 'FAQ' },
    { name: 'Export Reports', icon: FileDown, page: 'ExportReports', highlight: false }
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
      <header className="bg-gradient-to-r from-purple-900 to-indigo-900 backdrop-blur-md border-b border-purple-500 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
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
        <main className="flex-1 p-4 sm:p-6 lg:p-8" onClick={(e) => {
          if (speechEnabled && e.target.textContent) {
            speakText(e.target.textContent);
          }
        }}>
          {children}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-purple-950 to-indigo-950 text-cyan-300 mt-16 border-t border-purple-600">
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