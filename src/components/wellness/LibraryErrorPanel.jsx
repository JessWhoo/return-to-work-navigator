import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function LibraryErrorPanel({ onRetry, retrying }) {
  return (
    <Card className="bg-white border-2 border-rose-300 shadow-md" role="alert">
      <CardContent className="p-10 text-center space-y-3">
        <AlertTriangle className="h-10 w-10 text-rose-600 mx-auto" />
        <h3 className="text-lg font-extrabold text-slate-900">We couldn't load the library</h3>
        <p className="text-sm font-medium text-slate-700">
          Please check your connection and try again.
        </p>
        <Button
          onClick={onRetry}
          disabled={retrying}
          className="bg-rose-600 hover:bg-rose-700 text-white font-semibold"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${retrying ? 'animate-spin' : ''}`} />
          Retry
        </Button>
      </CardContent>
    </Card>
  );
}