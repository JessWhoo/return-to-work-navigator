import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Shield, Lock, Eye, EyeOff, UserCheck, Database, Server, Trash2,
  Download, KeyRound, HeartPulse, MessageCircle, FileText, CheckCircle2,
  AlertTriangle, Mail
} from 'lucide-react';
import useSEO from '@/hooks/useSEO';

const sections = [
  {
    icon: HeartPulse,
    color: 'from-rose-500 to-pink-600',
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
    color: 'from-violet-500 to-purple-600',
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
    color: 'from-emerald-500 to-teal-600',
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
    color: 'from-sky-500 to-blue-600',
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
    color: 'from-amber-500 to-orange-600',
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
    color: 'from-indigo-500 to-violet-600',
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
    color: 'from-slate-600 to-slate-800',
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
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-violet-600 to-emerald-600 flex items-center justify-center shadow-lg">
          <Shield className="h-10 w-10 text-white" />
        </div>
        <div className="flex justify-center">
          <Badge className="bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold">
            Transparency Page
          </Badge>
        </div>
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-violet-700 via-purple-600 to-emerald-700 bg-clip-text text-transparent">
          Privacy & Security
        </h1>
        <p className="text-lg text-slate-700 max-w-2xl mx-auto font-medium">
          What happens to your health logs, journey progress, and personal notes — explained in
          plain language, no legalese.
        </p>
      </div>

      {/* Trust summary */}
      <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 shadow-md">
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { icon: Lock, text: 'Encrypted in transit & at rest' },
              { icon: EyeOff, text: 'Anonymous in the community' },
              { icon: Trash2, text: 'Delete anything, anytime' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-emerald-200">
                  <Icon className="h-5 w-5 text-emerald-700" />
                </div>
                <span className="text-sm font-bold text-slate-800">{text}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed sections */}
      <div className="space-y-6">
        {sections.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.title} className="bg-white border-2 border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center shadow-md flex-shrink-0`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-xl font-extrabold text-slate-900 pt-2">{s.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-700 leading-relaxed">{s.body}</p>

                {s.bullets && (
                  <ul className="space-y-2 pl-1">
                    {s.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-slate-700">
                        <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm font-medium">{b}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {s.table && (
                  <div className="overflow-hidden rounded-lg border-2 border-slate-200">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-100">
                        <tr>
                          <th className="text-left p-3 font-bold text-slate-800">Data type</th>
                          <th className="text-left p-3 font-bold text-slate-800">Who can read it</th>
                        </tr>
                      </thead>
                      <tbody>
                        {s.table.map((row, i) => (
                          <tr key={row.data} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                            <td className="p-3 text-slate-800 font-medium">{row.data}</td>
                            <td className="p-3 text-slate-700">{row.who}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Your controls quick links */}
      <Card className="bg-gradient-to-br from-violet-50 to-purple-50 border-2 border-violet-200 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-900">
            <UserCheck className="h-6 w-6 text-violet-700" />
            <span className="font-extrabold">Your data controls</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-3">
            <Link
              to="/Profile"
              className="flex items-center gap-3 p-4 bg-white rounded-lg border-2 border-slate-200 hover:border-violet-400 hover:shadow-md transition-all"
            >
              <FileText className="h-5 w-5 text-violet-700" />
              <div>
                <div className="font-bold text-slate-900 text-sm">Edit profile & preferences</div>
                <div className="text-xs text-slate-600">Notification settings, name, sign out</div>
              </div>
            </Link>
            <Link
              to="/Profile"
              className="flex items-center gap-3 p-4 bg-white rounded-lg border-2 border-slate-200 hover:border-red-400 hover:shadow-md transition-all"
            >
              <Trash2 className="h-5 w-5 text-red-600" />
              <div>
                <div className="font-bold text-slate-900 text-sm">Delete your account</div>
                <div className="text-xs text-slate-600">Profile → Danger Zone</div>
              </div>
            </Link>
            <Link
              to="/Contact"
              className="flex items-center gap-3 p-4 bg-white rounded-lg border-2 border-slate-200 hover:border-sky-400 hover:shadow-md transition-all"
            >
              <Mail className="h-5 w-5 text-sky-700" />
              <div>
                <div className="font-bold text-slate-900 text-sm">Ask a privacy question</div>
                <div className="text-xs text-slate-600">Contact our team</div>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Footer note */}
      <Card className="bg-amber-50 border-2 border-amber-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-700 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-slate-800 space-y-2">
              <p className="font-bold">A note about medical information</p>
              <p className="text-slate-700 leading-relaxed">
                Navigator is not a medical record system, health-insurance portal, or legal service.
                It's a personal tool for organizing your return-to-work journey. Please continue to
                keep official medical records with your care team and consult a licensed attorney
                for legal decisions.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <p className="text-center text-xs text-slate-600 italic pb-4">
        Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
      </p>
    </div>
  );
}