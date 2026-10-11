import React from 'react';
import { Home, CheckCircle2, MessageSquare, Calendar, Lock, Mail } from 'lucide-react';
import BrandChoice from '@/components/brand/BrandChoice';

const ICONS = { return_to_work: Home, accommodation_request: CheckCircle2, health_status_update: MessageSquare, schedule_modification: Calendar, disclosure: Lock, follow_up: Mail };

export default function EmailScenarioChoice({ scenario, selected, onClick }) {
  return (
    <BrandChoice selected={selected} onClick={onClick} icon={ICONS[scenario.id]} className="w-full">
      <span className="block space-y-1">
        <span className="block text-sm font-semibold">{scenario.label}</span>
        <span className={`block text-xs ${selected ? 'text-primary-foreground' : 'text-muted-foreground'}`}>{scenario.description}</span>
      </span>
    </BrandChoice>
  );
}