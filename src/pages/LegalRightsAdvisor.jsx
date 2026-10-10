import LegalRightsAgentChat from '@/components/legal/LegalRightsAgentChat';
import PageHeader from '@/components/brand/PageHeader';

export default function LegalRightsAdvisor() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <PageHeader
        eyebrow="Legal & policy"
        title="Legal Rights Advisor"
        subtitle="Plain-language guidance on the ADA, FMLA, COBRA, and EEOC — informed by your own saved records."
      />

      <LegalRightsAgentChat />

      <p className="text-xs italic text-brand-muted-foreground">
        General information only — not legal advice. Please consult an employment attorney for your situation.
      </p>
    </div>
  );
}