import React from 'react';
import { Check, ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function CommunityResourceChoice({ resource, selected, onToggle }) {
  return (
    <Card className={`flex items-start gap-2 p-3 ${selected ? 'nv-card--muted' : ''}`}>
      <button type="button" onClick={onToggle} aria-pressed={selected} className="flex min-h-11 min-w-0 flex-1 items-start gap-3 p-1 text-left">
        <span aria-hidden="true" className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-brand-sm border ${selected ? 'border-primary bg-primary text-primary-foreground' : 'border-brand-border'}`}>
          {selected && <Check className="h-4 w-4" strokeWidth={1.75} />}
        </span>
        <span className="block min-w-0 flex-1 space-y-1 [overflow-wrap:anywhere]">
          <span className="block text-sm font-semibold text-brand-text">{resource.name}</span>
          <span className="block text-xs text-brand-muted-foreground">{resource.org}</span>
          <span className="flex flex-wrap gap-1">
            <Badge variant="secondary" className="rounded-pill text-xs">{resource.category}</Badge>
            {resource.type && <Badge variant="secondary" className="rounded-pill text-xs">{resource.type}</Badge>}
          </span>
        </span>
      </button>
      <Button asChild variant="ghost" size="icon" className="shrink-0">
        <a href={resource.url} target="_blank" rel="noopener noreferrer" aria-label={`Open ${resource.name} in a new tab`}>
          <ExternalLink className="h-4 w-4" strokeWidth={1.75} />
        </a>
      </Button>
    </Card>
  );
}