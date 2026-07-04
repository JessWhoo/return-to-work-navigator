import './App.css'
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import VisualEditAgent from '@/lib/VisualEditAgent'
import NavigationTracker from '@/lib/NavigationTracker'
import { pagesConfig } from './pages.config'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import Roadmap from './pages/Roadmap';
import DisclosureGuide from './pages/DisclosureGuide';
import ResourceLibrary from './pages/ResourceLibrary';
import ExpertQA from './pages/ExpertQA';
import ExpertAdvice from './pages/ExpertAdvice';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Blog from './pages/Blog';


const { Pages, Layout, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = mainPageKey ? Pages[mainPageKey] : <></>;

const LayoutWrapper = ({ children, currentPageName }) => Layout ?
  <Layout currentPageName={currentPageName}>{children}</Layout>
  : <>{children}</>;

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
      <Route path="/" element={
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
        path="/Roadmap"
        element={
          <LayoutWrapper currentPageName="Roadmap">
            <Roadmap />
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
        path="/ResourceLibrary"
        element={
          <LayoutWrapper currentPageName="ResourceLibrary">
            <ResourceLibrary />
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
        path="/ExpertAdvice"
        element={
          <LayoutWrapper currentPageName="ExpertAdvice">
            <ExpertAdvice />
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

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <NavigationTracker />
          <AuthenticatedApp />
        </Router>
        <Toaster />
        <VisualEditAgent />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App