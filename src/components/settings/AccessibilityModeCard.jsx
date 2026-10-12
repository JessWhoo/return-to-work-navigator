import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Eye } from 'lucide-react';
import { toast } from 'sonner';
import { A11Y_KEY, applyAccessibilityMode, isAccessibilityModeOn } from '@/lib/accessibilityMode';

export default function AccessibilityModeCard() {
  const [enabled, setEnabled] = useState(isAccessibilityModeOn);

  const handleToggle = (next) => {
    setEnabled(next);
    applyAccessibilityMode(next);
    try { localStorage.setItem(A11Y_KEY, next ? '1' : '0'); } catch {}
    toast.success(next ? 'Accessibility mode on' : 'Accessibility mode off');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-heading text-brand-text">
          <Eye className="h-5 w-5 text-brand-primary" />
          <span>Accessibility</span>
        </CardTitle>
        <p className="text-sm text-brand-muted-foreground mt-2">
          Easier reading for visual strain or cognitive fatigue
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between gap-4 rounded-brand bg-brand-muted p-4">
          <div className="space-y-1 min-w-0">
            <Label className="font-semibold text-brand-text">Accessibility Mode</Label>
            <p className="text-sm text-brand-muted-foreground">
              Larger text, higher contrast, bolder borders, and no distracting motion
            </p>
          </div>
          <Switch checked={enabled} onCheckedChange={handleToggle} aria-label="Accessibility mode" />
        </div>
      </CardContent>
    </Card>
  );
}