import React from 'react';
import { Bot, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { coachProfile } from './coachProfile';

/**
 * Coach identity card. Compact (avatar + name + role) on desktop, and on
 * mobile it also carries the profile summary and the entry point to the
 * coach's full profile.
 */
export default function CoachProfileCard({ onViewProfile, className = '' }) {
  return (
    <Card className={`nv-card--muted ${className}`}>
      <CardContent className="pt-4 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-pill bg-primary text-primary-foreground">
            <Bot className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-foreground">{coachProfile.name}</h3>
            <p className="text-xs font-medium text-muted-foreground">{coachProfile.role}</p>
          </div>
        </div>

        {/* Mobile profile summary + entry point to the full profile */}
        <div className="mt-4 space-y-3 lg:hidden">
          <p className="text-sm text-brand-muted-foreground">{coachProfile.summary}</p>
          <Button variant="outline" className="w-full" onClick={onViewProfile}>
            <UserRound className="h-4 w-4" aria-hidden="true" />
            View profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}