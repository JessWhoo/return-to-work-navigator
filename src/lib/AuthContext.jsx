import React, { createContext, useState, useContext, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { appParams } from '@/lib/app-params';
import { createAxiosClient } from '@base44/sdk/dist/utils/axios-client';
import {
  isSessionExpiredFlag,
  markSessionExpired,
  clearSessionExpiredFlag,
  onUnauthorized,
} from '@/lib/sessionGuard';

const AuthContext = createContext();

// Tokens that already failed /User/me once. Kept at module scope so a
// StrictMode double-mount (or a remount) never re-fires the same doomed
// request and produces a second 401.
const rejectedTokens = new Set();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [appPublicSettings, setAppPublicSettings] = useState(null); // Contains only { id, public_settings }
  // True when a stored session turned out to be expired. Seeded from a flag
  // that survives a reload, so the notice still shows after the SDK's sign-out
  // round trip.
  const [sessionExpired, setSessionExpired] = useState(() => isSessionExpiredFlag());

  const didInit = React.useRef(false);

  useEffect(() => {
    // Guard against StrictMode's double effect invocation — otherwise the
    // whole auth check (including /User/me) runs twice on every load.
    if (didInit.current) return;
    didInit.current = true;
    checkAppState();
  }, []);

  // A 401 from anywhere (React Query, a direct call, an unhandled rejection) is
  // reported through sessionGuard. Treat it as a signed-out session and offer
  // to sign in again, instead of leaving pages to fail one request at a time.
  useEffect(() => {
    return onUnauthorized(() => {
      setUser(null);
      setIsAuthenticated(false);
      setSessionExpired(true);
    });
  }, []);

  const checkAppState = async () => {
    try {
      setIsLoadingPublicSettings(true);
      setAuthError(null);
      
      // First, check app public settings (with token if available)
      // This will tell us if auth is required, user not registered, etc.
      const appClient = createAxiosClient({
        baseURL: `${appParams.serverUrl}/api/apps/public`,
        headers: {
          'X-App-Id': appParams.appId
        },
        token: appParams.token, // Include token if available
        interceptResponses: true
      });
      
      try {
        const settingsPath = `/prod/public-settings/by-id/${appParams.appId}`;
        let publicSettings;
        try {
          publicSettings = await appClient.get(settingsPath);
        } catch (firstError) {
          // Status 0 = the request never reached the server (brief network
          // drop, page reload mid-request). Retry once before failing.
          if (firstError?.status !== 0) throw firstError;
          await new Promise((resolve) => setTimeout(resolve, 800));
          publicSettings = await appClient.get(settingsPath);
        }
        setAppPublicSettings(publicSettings);
        
        // If we got the app public settings successfully, check if user is authenticated
        if (appParams.token && !rejectedTokens.has(appParams.token)) {
          await checkUserAuth();
        } else {
          // No stored token. The expired flag is deliberately left alone: it is
          // what tells the next load — after the SDK has cleared the dead
          // session — that this visitor was signed out because their session
          // expired, so the notice can still be offered. It is cleared on a
          // successful sign-in or when the notice is dismissed.
          setIsLoadingAuth(false);
          setIsAuthenticated(false);
        }
        setIsLoadingPublicSettings(false);
      } catch (appError) {
        if (appError?.status === 0) {
          console.warn('App settings unreachable (network issue); continuing as a public visitor.');
        } else {
          console.error('App state check failed:', appError);
        }
        
        // Handle app-level errors
        if (appError.status === 403 && appError.data?.extra_data?.reason) {
          const reason = appError.data.extra_data.reason;
          if (reason === 'auth_required') {
            setAuthError({
              type: 'auth_required',
              message: 'Authentication required'
            });
          } else if (reason === 'user_not_registered') {
            setAuthError({
              type: 'user_not_registered',
              message: 'User not registered for this app'
            });
          } else {
            setAuthError({
              type: reason,
              message: appError.message
            });
          }
        } else {
          setAuthError({
            type: 'unknown',
            message: appError.message || 'Failed to load app'
          });
        }
        setIsLoadingPublicSettings(false);
        setIsLoadingAuth(false);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      setAuthError({
        type: 'unknown',
        message: error.message || 'An unexpected error occurred'
      });
      setIsLoadingPublicSettings(false);
      setIsLoadingAuth(false);
    }
  };

  const checkUserAuth = async () => {
    try {
      // Now check if the user is authenticated
      setIsLoadingAuth(true);
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      setIsAuthenticated(true);
      clearSessionExpiredFlag();
      setSessionExpired(false);
      setIsLoadingAuth(false);
    } catch (error) {
      console.error('User auth check failed:', error);
      setIsLoadingAuth(false);
      setIsAuthenticated(false);
      
      // Expired/invalid token: flag it so the app can offer a calm "sign in
      // again" notice, then clear it so the visitor continues cleanly as a
      // signed-out user instead of every request failing with 401.
      // (The app is public — no login is required to browse.)
      if (error.status === 401 || error.status === 403) {
        markSessionExpired();
        setSessionExpired(true);
        if (appParams.token) rejectedTokens.add(appParams.token);
        try {
          base44.auth.logout(); // removes stale token, no redirect
        } catch {
          // best-effort cleanup
        }
      }
    }
  };

  const dismissSessionExpired = () => {
    clearSessionExpiredFlag();
    setSessionExpired(false);
  };

  const logout = (shouldRedirect = true) => {
    setUser(null);
    setIsAuthenticated(false);
    
    if (shouldRedirect) {
      // Use the SDK's logout method which handles token cleanup and redirect
      base44.auth.logout(window.location.href);
    } else {
      // Just remove the token without redirect
      base44.auth.logout();
    }
  };

  const navigateToLogin = () => {
    // Use the SDK's redirectToLogin method
    base44.auth.redirectToLogin(window.location.href);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoadingAuth,
      isLoadingPublicSettings,
      authError,
      appPublicSettings,
      sessionExpired,
      dismissSessionExpired,
      logout,
      navigateToLogin,
      checkAppState
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};