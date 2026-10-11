import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function LibraryErrorPanel({ onRetry, retrying }) {
  return (
    <Card className="nv-card--pink" role="alert">
      <CardContent className="space-y-4 p-5 text-center sm:p-8">
        <AlertTriangle className="mx-auto h-10 w-10 text-destructive" strokeWidth={1.75} aria-hidden="true" />
        <h3 className="text-lg font-bold text-brand-text">We couldn't load the library</h3>
        <p className="text-sm text-brand-muted-foreground">Please check your connection and try again.</p>
        <Button onClick={onRetry} disabled={retrying}>
          <RefreshCw className={`h-4 w-4 ${retrying ? 'animate-spin' : ''}`} />Retry
        </Button>
      </CardContent>
    </Card>
  );
}