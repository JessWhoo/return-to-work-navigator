import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export default function SupportNetworkCard({ organization }) {
  const Icon = organization.icon;
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <div className="shrink-0 rounded-brand bg-brand-muted p-2">
            <Icon className="h-5 w-5 text-primary" strokeWidth={1.75} aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1 [overflow-wrap:anywhere]">
            <h3 className="mb-1 font-bold text-foreground">{organization.name}</h3>
            <p className="mb-2 text-sm text-muted-foreground">{organization.description}</p>
            <p className="text-xs text-muted-foreground">{organization.contact}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}