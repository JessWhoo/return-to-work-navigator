import { Scale } from 'lucide-react';
import LegalRightsAgentChat from '@/components/legal/LegalRightsAgentChat';

export default function LegalRightsAdvisor() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-start gap-3">
        <div className="p-3 rounded-2xl bg-gradient-to-br from-violet-600 to-emerald-600 shadow-md">
          <Scale className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold">Legal Rights Advisor</h1>
          <p className="text-sm text-slate-700 font-medium">
            Plain-language guidance on the ADA, FMLA, COBRA, and EEOC — informed by your own saved records.
          </p>
        </div>
      </div>

      <LegalRightsAgentChat />

      <p className="text-xs text-slate-700 italic">
        General information only — not legal advice. Please consult an employment attorney for your situation.
      </p>
    </div>
  );
}