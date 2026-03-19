import React, { useState, useEffect, useCallback } from 'react';
import { WifiOff, RefreshCw, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { fullSync } from '@/lib/offlineSync';
import { getOutbox } from '@/lib/offlineDB';

export default function OfflineIndicator() {
  const [isOnline, setIsOnline]       = useState(navigator.onLine);
  const [syncState, setSyncState]     = useState(null); // null | 'syncing' | 'done' | 'error'
  const [pendingCount, setPendingCount] = useState(0);
  const [syncResult, setSyncResult]   = useState(null);

  // Poll outbox count every few seconds when offline
  useEffect(() => {
    const poll = async () => {
      const items = await getOutbox();
      setPendingCount(items.length);
    };
    poll();
    const id = setInterval(poll, 5000);
    return () => clearInterval(id);
  }, [isOnline]);

  const handleSync = useCallback(async () => {
    setSyncState('syncing');
    setSyncResult(null);
    try {
      const result = await fullSync((stage) => setSyncState(stage));
      setSyncResult(result);
      setSyncState('done');
      setPendingCount(0);
      setTimeout(() => setSyncState(null), 4000);
    } catch {
      setSyncState('error');
      setTimeout(() => setSyncState(null), 4000);
    }
  }, []);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      handleSync();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js')
        .then(() => console.log('[SW] registered'))
        .catch((err) => console.warn('[SW] registration failed:', err));
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [handleSync]);

  // Nothing to show when online and idle
  if (isOnline && !syncState) return null;

  // Sync feedback banners (shown briefly when back online)
  if (isOnline && syncState) {
    const cfg = {
      syncing: { bg: 'bg-blue-600',   icon: <RefreshCw className="h-4 w-4 animate-spin" />, text: 'Syncing your offline changes…' },
      done:    { bg: 'bg-green-600',  icon: <CheckCircle2 className="h-4 w-4" />,           text: syncResult ? `Synced ${syncResult.synced} change${syncResult.synced !== 1 ? 's' : ''}` : 'All caught up!' },
      error:   { bg: 'bg-red-600',    icon: <AlertTriangle className="h-4 w-4" />,           text: 'Some changes failed to sync. Will retry.' },
    }[syncState];

    return (
      <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom">
        <Badge className={`${cfg.bg} text-white px-4 py-2 shadow-lg flex items-center space-x-2`}>
          {cfg.icon}
          <span>{cfg.text}</span>
        </Badge>
      </div>
    );
  }

  // Offline banner
  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom flex flex-col items-end gap-2">
      <Badge className="bg-orange-500 text-white px-4 py-2 shadow-lg flex items-center space-x-2">
        <WifiOff className="h-4 w-4" />
        <span>You're offline</span>
        {pendingCount > 0 && (
          <span className="ml-1 bg-white/20 rounded-full px-1.5 text-xs">
            {pendingCount} pending
          </span>
        )}
      </Badge>
    </div>
  );
}