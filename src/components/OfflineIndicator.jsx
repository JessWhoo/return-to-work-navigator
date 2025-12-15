import React, { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js')
        .then(() => console.log('Service Worker registered'))
        .catch((error) => console.log('Service Worker registration failed:', error));
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom">
      <Badge className="bg-orange-500 text-white px-4 py-2 shadow-lg flex items-center space-x-2">
        <WifiOff className="h-4 w-4" />
        <span>You're offline</span>
      </Badge>
    </div>
  );
}