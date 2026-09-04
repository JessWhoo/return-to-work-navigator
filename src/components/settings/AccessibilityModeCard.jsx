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
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-slate-200">
          <Eye className="h-5 w-5 text-teal-400" />
          <span>Accessibility</span>
        </CardTitle>
        <p className="text-sm text-slate-400 mt-2">
          Easier reading for visual strain or cognitive fatigue
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between p-4 bg-slate-900 rounded-lg">
          <div className="space-y-1 pr-4">
            <Label className="text-slate-200">Accessibility Mode</Label>
            <p className="text-sm text-slate-400">
              Larger text, higher contrast, bolder borders, and no distracting motion
            </p>
          </div>
          <Switch checked={enabled} onCheckedChange={handleToggle} aria-label="Accessibility mode" />
        </div>
      </CardContent>
    </Card>
  );
}