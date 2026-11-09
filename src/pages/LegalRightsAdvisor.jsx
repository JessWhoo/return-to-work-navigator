import LegalRightsAgentChat from '@/components/legal/LegalRightsAgentChat';
import PageHeader from '@/components/brand/PageHeader';
import ToolSeoIntro from '@/components/seo/ToolSeoIntro';
import GuideFaqSection from '@/components/seo/GuideFaqSection';
import { LEGAL_ADVISOR_FAQS } from '@/components/seo/toolFaqs';
import useSEO from '@/hooks/useSEO';

export default function LegalRightsAdvisor() {
  useSEO({
    title: 'Interactive ADA & FMLA Legal Rights Advisor',
    description:
      'Ask our interactive Legal Rights Advisor plain-language questions about ADA workplace accommodations, intermittent FMLA leave, COBRA coverage, and EEOC protections.',
    path: '/LegalRightsAdvisor',
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <PageHeader
        eyebrow="Legal & policy"
        title="Interactive Workplace Legal Rights Advisor"
        subtitle="Plain-language guidance on the ADA, FMLA, COBRA, and EEOC — informed by your own saved records."
      />

      <ToolSeoIntro
        id="legal-advisor-intro"
        eyebrow="Legal rights advisor"
        heading="ADA, FMLA, and EEOC Questions Answered for Cancer Survivors"
        paragraphs={[
          'Workplace rights questions rarely come one at a time. This advisor answers plain-language questions about reasonable accommodations under the ADA, intermittent FMLA leave, COBRA coverage, and what to do when an employer pushes back — using the records you have saved so the answer fits your situation.',
          'It explains how the law generally works and when a question is worth taking to an employment attorney.',
        ]}
        points={[
          'ADA accommodations and the interactive process',
          'FMLA eligibility, leave, and certification',
          'COBRA coverage and EEOC filing timelines',
        ]}
      />

      <LegalRightsAgentChat />

      <p className="text-xs italic text-brand-muted-foreground">
        General information only — not legal advice. Please consult an employment attorney for your situation.
      </p>

      <GuideFaqSection
        id="legal-advisor-faq"
        eyebrow="Legal rights FAQ"
        title="Frequently Asked Questions About Workplace Legal Rights"
        subtitle="The ADA, FMLA, medical documentation, and what to do when a request is denied."
        faqs={LEGAL_ADVISOR_FAQS}
      />
    </div>
  );
}