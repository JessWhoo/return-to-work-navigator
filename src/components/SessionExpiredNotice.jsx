import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/AuthContext';

// Shown app-wide when a stored session turns out to be expired, so a page load
// that 401s reads as "please sign in again" instead of a broken screen.
export default function SessionExpiredNotice() {
  const { sessionExpired, dismissSessionExpired, navigateToLogin } = useAuth();

  // Nothing to explain on the pages that already ask for sign-in details.
  const onAuthPage = ['/login', '/register', '/forgot-password', '/reset-password']
    .includes(window.location.pathname);

  if (!sessionExpired || onAuthPage) return null;

  return (
    <div role="alert" aria-live="polite" className="bg-amber-50 border-b-2 border-amber-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" aria-hidden="true" />
        <p className="flex-1 min-w-[12rem] text-sm font-semibold text-slate-900">
          Your session expired, so you're signed out. Sign in again to keep saving your progress.
        </p>
        <Button
          size="sm"
          onClick={navigateToLogin}
          className="bg-violet-700 hover:bg-violet-800 text-white font-bold"
        >
          Sign in again
        </Button>
        <button
          type="button"
          onClick={dismissSessionExpired}
          aria-label="Dismiss session expired message"
          className="p-1.5 rounded-lg text-slate-700 hover:bg-amber-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-700"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}