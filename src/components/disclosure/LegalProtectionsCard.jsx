import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Shield } from 'lucide-react';
import { LEGAL_PROTECTIONS } from './disclosureSteps';

export default function LegalProtectionsCard() {
  return (
    <Card className="bg-gradient-to-br from-indigo-50 to-violet-50 border-2 border-indigo-300 shadow-md">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 shadow-md">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">
            Laws That Protect You
          </h2>
        </div>
        <p className="text-sm font-medium text-slate-700 mb-4">
          You have legal rights as someone managing a cancer diagnosis at work.
          These are the key US protections — your state may offer more.
        </p>
        <div className="space-y-3">
          {LEGAL_PROTECTIONS.map((law) => (
            <div
              key={law.name}
              className="bg-white border-2 border-indigo-200 rounded-xl p-4"
            >
              <h3 className="font-extrabold text-slate-900 text-sm mb-1">
                {law.name}
              </h3>
              <p className="text-xs font-medium text-slate-700 leading-relaxed">
                {law.description}
              </p>
            </div>
          ))}
        </div>
        <p className="text-xs italic font-medium text-slate-600 mt-4">
          This is general information, not legal advice. For your specific
          situation, consult an employment attorney or your local EEOC office.
        </p>
      </CardContent>
    </Card>
  );
}