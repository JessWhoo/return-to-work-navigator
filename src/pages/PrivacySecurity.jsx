import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Lock, EyeOff, UserCheck, Database, Trash2, KeyRound, HeartPulse, MessageCircle, FileText, CheckCircle2,
  AlertTriangle, Mail, ExternalLink
} from 'lucide-react';
import SmsConsentCard from '@/components/sms/SmsConsentCard';
import useSEO from '@/hooks/useSEO';
import PageHeader from '@/components/brand/PageHeader';

const sections = [
  {
    icon: HeartPulse,
    title: 'Your health and journey data stays yours',
    body: (
      <>
        Every energy log, symptom entry, journal note, medical record, checklist item, and
        gamification stat is stored under your account only. Our database enforces row-level
        security rules so that <strong>only you can read, edit, or delete records you created</strong> —
        not other members, not other survivors, not the public.
      </>
    ),
    bullets: [
      'Symptom logs, energy tracking, and mood check-ins → private to you',
      'Medical records, doctor notes, and workplace meeting logs → private to you',
      'Journal entries, reflections, and daily affirmations → private to you',
      'Communication drafts, meeting-prep notes, and accommodation requests → private to you',
    ],
  },
  {
    icon: EyeOff,
    title: 'Community features are anonymous by design',
    body: (
      <>
        When you join Peer Connections or ask an Expert Q&A question, you choose a display name —
        your real name and email are <strong>never shown to other users</strong>. Anonymous questions
        stay anonymous publicly. Your account is still linked internally so our moderators can keep
        the space safe and respond to you, but that link is never exposed to other members.
      </>
    ),
    bullets: [
      'Choose your own anonymous display name',
      'Direct messages are readable only by the two people in the conversation',
      'Forum posts and expert questions are visible only to signed-in members, not the public web',
      '"Ask anonymously" hides your name from everyone except moderators',
    ],
  },
  {
    icon: Lock,
    title: 'How your data is protected',
    body: (
      <>
        Navigator runs on the Base44 platform, which handles authentication, encrypted storage, and
        secure transport for us. Traffic between your device and our servers is encrypted with
        <strong> HTTPS/TLS</strong>. Data at rest is stored in an encrypted, access-controlled
        database. You sign in with a verified email + password or Google — we never see or store
        your password ourselves.
      </>
    ),
    bullets: [
      'HTTPS/TLS encryption for every request',
      'Encrypted database storage with row-level security',
      'Email verification and OTP for account creation',
      'Passwords are hashed and managed by the auth provider — never stored by us',
    ],
  },
  {
    icon: UserCheck,
    title: 'Who can see what',
    body: (
      <>
        We use strict per-record access rules. Here's exactly who can read each type of data:
      </>
    ),
    table: [
      { data: 'Health logs, symptoms, journal, records', who: 'You only' },
      { data: 'Checklist progress and gamification', who: 'You only' },
      { data: 'Communication drafts & meeting prep', who: 'You only' },
      { data: 'Coach booking details', who: 'You + admin' },
      { data: 'Peer profile (anonymous)', who: 'Signed-in members' },
      { data: 'Forum posts & expert questions', who: 'Signed-in members' },
      { data: 'Direct messages', who: 'You and the recipient' },
      { data: 'Public resource library', who: 'Everyone' },
    ],
  },
  {
    icon: MessageCircle,
    title: 'AI Coach and how your prompts are handled',
    body: (
      <>
        When you chat with the AI Coach, your message is sent to a large language model provider to
        generate a response. We <strong>do not share your identity</strong> with the model — only
        the text of your prompt and, where helpful, non-identifying context (like your journey
        stage). Conversations you save appear only in your own account. You can delete any
        conversation at any time.
      </>
    ),
    bullets: [
      'Prompts are used to generate your response, not to train public models',
      'No name, email, or account ID is sent with your prompt',
      'Saved conversations are private to you and deletable at any time',
    ],
  },
  {
    icon: KeyRound,
    title: 'Your rights and controls',
    body: (
      <>
        You are always in control of your data. From your Profile you can update your name and
        notification preferences, sign out, or permanently delete your account and everything tied
        to it.
      </>
    ),
    bullets: [
      'View and edit your profile at any time',
      'Turn email reminders and weekly summaries on or off',
      'Delete individual records, logs, drafts, or messages',
      'Permanently delete your account and all associated data from Profile → Danger Zone',
    ],
  },
  {
    icon: Database,
    title: 'What we never do',
    body: (
      <>
        Transparency matters as much as security. Here's what Navigator <strong>never</strong> does
        with your information:
      </>
    ),
    bullets: [
      'We never sell or rent your personal information',
      'We never share your identity with employers, insurers, or the public',
      'We never post to the community on your behalf',
      'We never share your health data outside the tools you use it in',
      'We never require you to disclose your diagnosis to use the app',
    ],
  },
];

export default function PrivacySecurity() {
  useSEO({
    title: 'Privacy & Security — Navigator',
    description:
      'How Navigator protects your health logs, journey progress, and personal information. Clear, plain-language transparency about data privacy and security.',
    path: '/PrivacySecurity',
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <PageHeader center eyebrow="Transparency Page" title="Privacy & Security" subtitle="What happens to your health logs, journey progress, and personal notes — explained in plain language, no legalese." />
      <Card className="nv-card--muted">
        <CardContent className="pt-6"><div className="grid md:grid-cols-3 gap-4">
          {[{ icon: Lock, text: 'Encrypted in transit & at rest' }, { icon: EyeOff, text: 'Anonymous in the community' }, { icon: Trash2, text: 'Delete anything, anytime' }].map(({ icon: Icon, text }) => <div key={text} className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-brand-surface flex items-center justify-center border border-brand-border shrink-0"><Icon className="h-5 w-5 text-brand-primary" /></div><span className="text-sm font-semibold text-brand-text">{text}</span></div>)}
        </div></CardContent>
      </Card>
      <div className="space-y-6">
        {sections.map(s => {
          const Icon = s.icon;
          return (
            <Card key={s.title}>
              <CardHeader><CardTitle className="flex items-start gap-4"><div className="w-12 h-12 rounded-brand bg-brand-muted flex items-center justify-center shrink-0"><Icon className="h-6 w-6 text-brand-primary" /></div><span className="text-xl font-bold text-brand-text pt-2">{s.title}</span></CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <p className="text-brand-text">{s.body}</p>
                {s.bullets && <ul className="space-y-2 pl-1">{s.bullets.map(b => <li key={b} className="flex items-start gap-2 text-brand-text"><CheckCircle2 className="h-5 w-5 text-brand-primary shrink-0 mt-0.5" /><span className="text-sm font-medium">{b}</span></li>)}</ul>}
                {s.table && <div className="overflow-x-auto rounded-brand border border-brand-border"><table className="w-full text-sm"><thead className="bg-brand-muted"><tr><th className="text-left p-3 font-semibold text-brand-text">Data type</th><th className="text-left p-3 font-semibold text-brand-text">Who can read it</th></tr></thead><tbody>{s.table.map((row, i) => <tr key={row.data} className={i % 2 === 0 ? 'bg-brand-surface' : 'bg-brand-background'}><td className="p-3 text-brand-text font-medium">{row.data}</td><td className="p-3 text-brand-muted-foreground">{row.who}</td></tr>)}</tbody></table></div>}
              </CardContent>
            </Card>
          );
        })}
      </div>
      <Card className="nv-card--muted">
        <CardHeader><CardTitle className="flex items-center gap-2 text-brand-text"><UserCheck className="h-6 w-6 text-brand-primary" /><span>Your data controls</span></CardTitle></CardHeader>
        <CardContent><div className="grid sm:grid-cols-2 gap-3">
          <Link to="/Profile" className="nv-card flex items-center gap-3 p-4"><FileText className="h-5 w-5 text-brand-primary shrink-0" /><div><div className="font-semibold text-brand-text text-sm">Edit profile & preferences</div><div className="text-xs text-brand-muted-foreground">Notification settings, name, sign out</div></div></Link>
          <Link to="/Profile" className="nv-card flex items-center gap-3 p-4"><Trash2 className="h-5 w-5 text-destructive shrink-0" /><div><div className="font-semibold text-brand-text text-sm">Delete your account</div><div className="text-xs text-brand-muted-foreground">Profile → Danger Zone</div></div></Link>
          <Link to="/Contact" className="nv-card flex items-center gap-3 p-4"><Mail className="h-5 w-5 text-brand-primary shrink-0" /><div><div className="font-semibold text-brand-text text-sm">Ask a privacy question</div><div className="text-xs text-brand-muted-foreground">Contact our team</div></div></Link>
        </div></CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 text-brand-text"><ExternalLink className="h-6 w-6 text-brand-primary" /><span>Third-party services</span></CardTitle></CardHeader>
        <CardContent className="space-y-3"><p className="text-sm text-brand-text">Some features are supported by outside services, and those services' own terms apply to how they handle your information.</p><a href="https://conversations.godaddy.com/policies/tos/df004a43-c23b-11f1-8742-3cfdfe75eb81" target="_blank" rel="noopener noreferrer" className="nv-btn nv-btn--text !whitespace-normal underline"><span>GoDaddy Conversations Terms of Service</span><ExternalLink className="h-4 w-4" /></a></CardContent>
      </Card>
      <SmsConsentCard>
        <p className="text-xs text-brand-text font-bold">Return Collective does not share mobile numbers, text messaging originator opt-in data, or consent with any third parties or affiliates for marketing or promotional purposes.</p>
        <p className="text-xs text-brand-muted-foreground">Text messaging originator opt-in data and consent will not be shared with any third parties, excluding aggregators and providers of the Text Message services.</p>
      </SmsConsentCard>
      <Card className="nv-card--muted"><CardContent className="pt-6"><div className="flex items-start gap-3"><AlertTriangle className="h-5 w-5 text-brand-primary shrink-0 mt-0.5" /><div className="text-sm text-brand-text space-y-2"><p className="font-bold">A note about medical information</p><p>Navigator is not a medical record system, health-insurance portal, or legal service. It's a personal tool for organizing your return-to-work journey. Please continue to keep official medical records with your care team and consult a licensed attorney for legal decisions.</p></div></div></CardContent></Card>
      <p className="text-center text-xs text-brand-muted-foreground italic pb-4">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
    </div>
  );
}