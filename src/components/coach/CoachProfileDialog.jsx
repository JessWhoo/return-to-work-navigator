import React from 'react';
import { Bot, Check, Lock, ShieldCheck } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { coachProfile } from './coachProfile';

export default function CoachProfileDialog({ open, onOpenChange }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85dvh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-pill bg-primary text-primary-foreground">
              <Bot className="h-6 w-6" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <DialogTitle>{coachProfile.name}</DialogTitle>
              <p className="text-xs font-semibold text-brand-muted-foreground">{coachProfile.role}</p>
            </div>
          </div>
          <DialogDescription className="pt-2 text-sm text-brand-muted-foreground">
            {coachProfile.summary}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          <div className="space-y-2">
            <p className="nv-eyebrow">What your coach helps with</p>
            <ul className="space-y-2">
              {coachProfile.specialties.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-brand-text">
                  <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-primary" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="nv-card nv-card--muted space-y-2 p-4">
            <p className="flex items-center gap-2 text-sm font-bold text-brand-text">
              <ShieldCheck className="h-4 w-4 flex-shrink-0 text-brand-primary" aria-hidden="true" />
              Non-medical workplace support
            </p>
            <p className="text-sm text-brand-muted-foreground">{coachProfile.boundaries}</p>
          </div>

          <p className="flex items-start gap-2 text-xs text-brand-muted-foreground">
            <Lock className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
            <span>{coachProfile.privacy}</span>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}