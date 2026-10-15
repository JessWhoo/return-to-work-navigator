import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { ShieldCheck, Lock, UserX, Trash2, Stethoscope } from 'lucide-react';

const PRIVACY_PILLARS = [
  {
    icon: UserX,
    title: 'Anonymous Browsing & Letter Drafting',
    description:
      'Patients can read every legal and wellness guide, generate customized ADA workplace accommodation letters, and export PDF meeting worksheets without creating an account or entering their name.',
  },
  {
    icon: ShieldCheck,
    title: 'Never Sold or Shared With Employers or Insurers',
    description:
      'We never sell, rent, or disclose patient data to employers, human resources departments, health or disability insurers, data brokers, or advertisers. Period.',
  },
  {
    icon: Lock,
    title: 'Strict Per-User Isolation for Saved Logs',
    description:
      'If a survivor chooses to create an optional account to track daily energy, save checklist milestones, or chat with the AI Coach, their records are protected by strict Row-Level Security (RLS) so only they can view them.',
  },
  {
    icon: Trash2,
    title: '1-Click Patient Data Export & Permanent Deletion',
    description:
      'Patients own their information. At any time from their Profile page, a user can export their logs to share with their care team or permanently delete their account and all associated data.',
  },
];

export default function ClinicPrivacySection() {
  return (
    <section aria-labelledby="privacy-stance-heading" className="space-y-5">
      <div className="space-y-2">
        <p className="nv-eyebrow nv-eyebrow--primary">Our Privacy &amp; Clinical Scope Stance</p>
        <h2 id="privacy-stance-heading" className="font-heading text-2xl sm:text-3xl font-bold text-brand-text">
          Built to Protect Survivor Confidentiality From Day One
        </h2>
        <p className="text-brand-muted-foreground max-w-3xl">
          Fear of workplace stigma or accidental disclosure is the #1 reason cancer survivors hesitate to use online career tools. You can refer patients with confidence knowing our architecture minimizes data collection by default.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {PRIVACY_PILLARS.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <Card key={pillar.title}>
              <CardContent className="p-6 space-y-2.5">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-pill bg-brand-muted text-brand-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="font-heading text-base font-bold text-brand-text">
                    {pillar.title}
                  </h3>
                </div>
                <p className="text-sm text-brand-muted-foreground leading-relaxed">
                  {pillar.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="nv-card--muted">
        <CardContent className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Stethoscope className="h-5 w-5 text-brand-primary shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-brand-muted-foreground leading-relaxed">
              <strong className="text-brand-text">Clear Clinical &amp; Legal Boundaries:</strong> Return to Work Navigator provides educational workplace, accommodation, and communication guidance. It does not provide medical advice, clinical diagnosis, or formal legal representation, and consistently prompts patients to review return-to-work timelines and physical restrictions with their oncology care team.
            </p>
          </div>
          <Link
            to="/PrivacySecurity"
            className="nv-btn nv-btn--outline nv-btn--sm shrink-0"
          >
            Read Full Privacy Policy
          </Link>
        </CardContent>
      </Card>
    </section>
  );
}