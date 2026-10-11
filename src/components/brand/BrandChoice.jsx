import React from 'react';
import { Button } from '@/components/ui/button';

export default function BrandChoice({ selected, onClick, icon: Icon, children, stacked = false, className = '' }) {
  return (
    <Button type="button" variant={selected ? 'default' : 'outline'} aria-pressed={selected} onClick={onClick} className={`h-auto min-w-0 !whitespace-normal px-4 py-3 text-sm ${stacked ? 'flex-col' : 'justify-start text-left'} ${className}`}>
      {Icon && <Icon className="h-5 w-5 shrink-0" strokeWidth={1.75} aria-hidden="true" />}
      <span>{children}</span>
    </Button>
  );
}