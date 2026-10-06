import { useEffect } from 'react';
import './App.css'
import { Toaster } from "@/components/ui/toaster"
import { Toaster as SonnerToaster } from "@/components/ui/sonner"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import VisualEditAgent from '@/lib/VisualEditAgent'
import NavigationTracker from '@/lib/NavigationTracker'
import { pagesConfig } from './pages.config'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import SessionExpiredNotice from '@/components/SessionExpiredNotice';
import { installUnauthorizedMonitor } from '@/lib/sessionGuard';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import Roadmap from './pages/Roadmap';
import LegalRightsChecklist from './pages/LegalRightsChecklist';
import DisclosureGuide from './pages/DisclosureGuide';
import ResourceLibrary from './pages/ResourceLibrary';
import ExpertQA from './pages/ExpertQA';
import ExpertAdvice from './pages/ExpertAdvice';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Blog from './pages/Blog';
import MyFeedback from './pages/MyFeedback';
import EmergencyContacts from './pages/EmergencyContacts';
import PrivacySecurity from './pages/PrivacySecurity';
import AccommodationWorksheet from './pages/AccommodationWorksheet';
import LegalDirectory from './pages/LegalDirectory';
import WellnessLibrary from './pages/WellnessLibrary';
import LegalRightsAdvisor from './pages/LegalRightsAdvisor';
import AccommodationLetterGenerator from './pages/AccommodationLetterGenerator';
import ManagerGuide from './pages/ManagerGuide';
import AccommodationTemplates from './pages/AccommodationTemplates';
import GoogleAdsSignupTracking from '@/components/analytics/GoogleAdsSignupTracking';

if (typeof document !== 'undefined' && !window.__gads_loaded) {
    window.__gads_loaded = true;
    window.dataLayer = window.dataLayer || [];
    const inIframe = (() => { try { return window.self !== window.top; } catch { return true; } })();
    window.gtag = function gtag() {
        window.dataLayer.push(arguments);
        if (inIframe) {
            try {
                const args = Array.prototype.slice.call(arguments);
                const cmd = args[0];
                window.parent.postMessage({
                    type: 'base44_gtag_event',
                    event: {
                        source: 'gtag',
                        timestamp: new Date().toLocaleTimeString(),
                        command: cmd,
                        params: args.slice(1),
                        type: cmd === 'event' ? (args[1] || 'event') : cmd,
                    },
                }, '*');
            } catch (_e) { /* relay must not break gtag */ }
        }
    };
    const s = document.createElement('script');
    s.src = 'https://www.googletagmanager.com/gtag/js?id=AW-18498327009';
    s.async = true;
    document.head.appendChild(s);
    window.gtag('js', new Date());
    window.gtag('config', 'AW-18498327009', { send_page_view: false });
}

const { Pages, Layout, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = mainPageKey ? Pages[mainPageKey] : <></>;

const LayoutWrapper = ({ children, currentPageName }) => Layout ?
  <Layout currentPageName={currentPageName}>{children}</Layout>
  : <>{children}</>;

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors — only the "not registered" case shows a
  // dedicated screen. Missing auth is ignored so the app is fully browsable
  // without signing in.
  if (authError && authError.type === 'user_not_registered') {
    return <UserNotRegisteredError />;
  }

  // Render the main app
  return (
    <Routes>
      {/* ------- Public routes (no auth required) ------- */}
      <Route path="/" element={
        <LayoutWrapper currentPageName={mainPageKey}>
          <MainPage />
        </LayoutWrapper>
      } />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route
        path="/PrivacySecurity"
        element={
          <LayoutWrapper currentPageName="PrivacySecurity">
            <PrivacySecurity />
          </LayoutWrapper>
        }
      />
      <Route
        path="/Blog"
        element={
          <LayoutWrapper currentPageName="Blog">
            <Blog />
          </LayoutWrapper>
        }
      />
      <Route
        path="/emergency-contacts"
        element={
          <LayoutWrapper currentPageName="EmergencyContacts">
            <EmergencyContacts />
          </LayoutWrapper>
        }
      />
      <Route
        path="/DisclosureGuide"
        element={
          <LayoutWrapper currentPageName="DisclosureGuide">
            <DisclosureGuide />
          </LayoutWrapper>
        }
      />
      <Route
        path="/WellnessLibrary"
        element={
          <LayoutWrapper currentPageName="WellnessLibrary">
            <WellnessLibrary />
          </LayoutWrapper>
        }
      />
      <Route
        path="/ResourceLibrary"
        element={
          <LayoutWrapper currentPageName="ResourceLibrary">
            <ResourceLibrary />
          </LayoutWrapper>
        }
      />
      <Route
        path="/ExpertAdvice"
        element={
          <LayoutWrapper currentPageName="ExpertAdvice">
            <ExpertAdvice />
          </LayoutWrapper>
        }
      />
      <Route
        path="/ManagerGuide"
        element={
          <LayoutWrapper currentPageName="ManagerGuide">
            <ManagerGuide />
          </LayoutWrapper>
        }
      />

      {/* ------- App routes (no sign-in required) ------- */}
      <Route>
        <Route path="/home" element={
          <LayoutWrapper currentPageName={mainPageKey}>
            <MainPage />
          </LayoutWrapper>
        } />
        {Object.entries(Pages).map(([path, Page]) => (
          <Route
            key={path}
            path={`/${path}`}
            element={
              <LayoutWrapper currentPageName={path}>
                <Page />
              </LayoutWrapper>
            }
          />
        ))}
        <Route
          path="/MyFeedback"
          element={
            <LayoutWrapper currentPageName="MyFeedback">
              <MyFeedback />
            </LayoutWrapper>
          }
        />
        <Route
          path="/Roadmap"
          element={
            <LayoutWrapper currentPageName="Roadmap">
              <Roadmap />
            </LayoutWrapper>
          }
        />
        <Route
          path="/ExpertQA"
          element={
            <LayoutWrapper currentPageName="ExpertQA">
              <ExpertQA />
            </LayoutWrapper>
          }
        />
        <Route
          path="/LegalRightsChecklist"
          element={
            <LayoutWrapper currentPageName="LegalRightsChecklist">
              <LegalRightsChecklist />
            </LayoutWrapper>
          }
        />
        <Route
          path="/LegalRightsAdvisor"
          element={
            <LayoutWrapper currentPageName="LegalRightsAdvisor">
              <LegalRightsAdvisor />
            </LayoutWrapper>
          }
        />
        <Route
          path="/LegalDirectory"
          element={
            <LayoutWrapper currentPageName="LegalDirectory">
              <LegalDirectory />
            </LayoutWrapper>
          }
        />
        <Route
          path="/AccommodationWorksheet"
          element={
            <LayoutWrapper currentPageName="AccommodationWorksheet">
              <AccommodationWorksheet />
            </LayoutWrapper>
          }
        />
        <Route
          path="/AccommodationTemplates"
          element={
            <LayoutWrapper currentPageName="AccommodationTemplates">
              <AccommodationTemplates />
            </LayoutWrapper>
          }
        />
        <Route
          path="/AccommodationLetterGenerator"
          element={
            <LayoutWrapper currentPageName="AccommodationLetterGenerator">
              <AccommodationLetterGenerator />
            </LayoutWrapper>
          }
        />
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {
  // Catch any 401 that no caller handled, wherever it surfaces.
  useEffect(() => {
    installUnauthorizedMonitor();
  }, []);

  return (
    <AuthProvider>
      <GoogleAdsSignupTracking />
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <NavigationTracker />
          <SessionExpiredNotice />
          <AuthenticatedApp />
        </Router>
        <Toaster />
        <SonnerToaster theme="light" richColors position="top-center" />
        <VisualEditAgent />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App