import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Shield } from 'lucide-react';
import { LEGAL_PROTECTIONS } from '@/components/disclosure/disclosureSteps';

export default function LegalProtectionsCard() {
  return (
    <Card className="nv-card--muted">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4"><div className="p-2 rounded-brand bg-brand-primary"><Shield className="h-5 w-5 text-primary-foreground" /></div><h2 className="text-xl font-bold text-brand-text">Laws That Protect You</h2></div>
        <p className="text-sm font-medium text-brand-muted-foreground mb-4">You have legal rights as someone managing a cancer diagnosis at work. These are the key US protections — your state may offer more.</p>
        <div className="space-y-3">{LEGAL_PROTECTIONS.map(law => <div key={law.name} className="nv-card p-4"><h3 className="font-bold text-brand-text text-sm mb-1">{law.name}</h3><p className="text-xs font-medium text-brand-muted-foreground">{law.description}</p></div>)}</div>
        <p className="text-xs italic font-medium text-brand-muted-foreground mt-4">This is general information, not legal advice. For your specific situation, consult an employment attorney or your local EEOC office.</p>
      </CardContent>
    </Card>
  );
}