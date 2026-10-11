import React from 'react';
import { DialogContent } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

export default function ResourceDialogContent({ className, ...props }) {
  return (
    <DialogContent
      className={cn(
        'nv-resource-dialog bg-brand-surface text-brand-text border-brand-border rounded-brand-lg sm:rounded-brand-lg shadow-brand-lg w-[calc(100vw-2rem)] max-h-[90dvh] overflow-y-auto p-4 sm:p-6',
        className
      )}
      {...props}
    />
  );
}