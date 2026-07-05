import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Shield, Lock, EyeOff, UserCheck, Database, Share2,
  FileText, Trash2, Mail, Heart, Briefcase, CheckCircle2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import useSEO from '@/hooks/useSEO';

const pledges = [
  {
    icon: Heart,
    title: 'Your health story stays yours',
    body: 'Diagnosis details, symptoms, energy logs, mood check-ins, and journal entries are private to your account. We do not sell, rent, or trade this information — ever.',
    accent: 'from-rose-500 to-pink-500',
  },
  {
    icon: Briefcase,
    title: 'Your workplace details are protected',
    body: 'Employer names, accommodation requests, meeting prep notes, and communication drafts are visible only to you. Your manager, HR, and coworkers cannot see this app.',
    accent: 'from-sky-500 to-indigo-500',
  },
  {
    icon: EyeOff,
    title: 'Anonymous by default in community',
    body: 'When you post in the community forum or connect with peers, you choose a display name. Your real name, email, and employer are never revealed to other users.',
    accent: 'from-violet-500 to-purple-500',
  },
  {
    icon: Lock,
    title: 'Encrypted in transit and at rest',
    body: 'All data moves over encrypted connections (HTTPS/TLS) and is stored in encrypted databases with strict access controls.',
    accent: 'from-emerald-500 to-teal-500',
  },
  {
    icon: UserCheck,
    title: 'You control your data',
    body: 'You can export your records, edit or delete individual entries, and request full account deletion at any time — no questions asked.',
    accent: 'from-amber-500 to-orange-500',
  },
  {
    icon: Share2,
    title: 'You decide what to share',
    body: 'Sharing a progress report, meeting prep summary, or resource with an employer or doctor only happens when you explicitly export or send it.',
    accent: 'from-cyan-500 to-sky-500',
  },
];

const dataCategories = [
  {
    label: 'Health & wellbeing data',
    examples: 'Symptoms, energy, mood, medical appointment notes, journal entries',
    access: 'Only you',
  },
  {
    label: 'Workplace & career data',
    examples: 'Accommodation requests, meeting prep, employer email drafts, return-to-work plans',
    access: 'Only you',
  },
  {
    label: 'AI Coach conversations',
    examples: 'Your chats with the return-to-work coach',
    access: 'Only you — used to power your session, not to train public models',
  },
  {
    label: 'Community posts',
    examples: 'Forum posts, replies, peer connection profiles',
    access: 'Other signed-in users (under your chosen display name)',
  },
  {
    label: 'Account basics',
    examples: 'Email, name, sign-in method',
    access: 'You and Navigator staff (for support only)',
  },
];

const neverList = [
  'Sell or rent your personal information',
  'Share your health data with employers, insurers, or advertisers',
  'Reveal your real identity in the community without your permission',
  'Use your private notes or coaching chats to train public AI models',
  'Send your data to third parties without a clear, listed purpose',
];

export default function PrivacyPledge() {
  useSEO({
    title: 'Privacy Pledge — Navigator',
    description:
      'Our transparency pledge: how Back to Life, Back to Work Navigator protects your sensitive health and workplace information.',
    path: '/privacy-pledge',
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-sky-50">
      {/* Header */}
      <header className="bg-white border-b-2 border-slate-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69406c752de234aafebf891d/433da2071_IMG_1196.png"
              alt="Navigator"
              className="h-11 w-11 object-contain"
            />
            <span className="text-xl font-extrabold bg-gradient-to-r from-rose-600 via-violet-600 to-sky-700 bg-clip-text text-transparent">
              Navigator
            </span>
          </Link>
          <Link to="/">
            <Button variant="outline" className="border-2 border-slate-300 text-slate-800 font-semibold">
              Back to home
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Hero */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-sky-600 shadow-lg mb-5">
            <Shield className="h-8 w-8 text-white" aria-hidden="true" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-rose-600 via-violet-600 to-sky-700 bg-clip-text text-transparent mb-4">
            Our Privacy Pledge
          </h1>
          <p className="text-lg text-slate-800 max-w-2xl mx-auto leading-relaxed font-medium">
            You're trusting us with two of the most personal parts of your life —
            your health and your work. Here's exactly how we protect both.
          </p>
          <p className="text-sm text-slate-600 mt-4">Last updated: July 2026</p>
        </motion.section>

        {/* The 6 pledges */}
        <section className="mb-16">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-8 text-center">
            Six promises we make to you
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {pledges.map((p, idx) => {
              const Icon = p.icon;
              return (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                >
                  <Card className="bg-white border-2 border-slate-200 shadow-md hover:shadow-lg h-full">
                    <CardContent className="p-6">
                      <div className={`inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br ${p.accent} shadow-md mb-4`}>
                        <Icon className="h-5 w-5 text-white" aria-hidden="true" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">{p.title}</h3>
                      <p className="text-slate-700 leading-relaxed">{p.body}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* What we collect & who sees it */}
        <section className="mb-16">
          <Card className="bg-white border-2 border-slate-200 shadow-md">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center">
                  <Database className="h-5 w-5 text-white" aria-hidden="true" />
                </div>
                <CardTitle className="text-2xl font-extrabold text-slate-900">
                  What we collect and who can see it
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-slate-300">
                      <th className="py-3 pr-4 text-sm font-bold text-slate-900">Category</th>
                      <th className="py-3 pr-4 text-sm font-bold text-slate-900">Examples</th>
                      <th className="py-3 text-sm font-bold text-slate-900">Who can access it</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataCategories.map((row) => (
                      <tr key={row.label} className="border-b border-slate-200 align-top">
                        <td className="py-4 pr-4 font-semibold text-slate-900">{row.label}</td>
                        <td className="py-4 pr-4 text-slate-700">{row.examples}</td>
                        <td className="py-4 text-slate-700">{row.access}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* What we will never do */}
        <section className="mb-16">
          <Card className="bg-gradient-to-br from-rose-50 to-pink-50 border-2 border-rose-200 shadow-md">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center">
                  <EyeOff className="h-5 w-5 text-white" aria-hidden="true" />
                </div>
                <CardTitle className="text-2xl font-extrabold text-slate-900">
                  What we will never do
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {neverList.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-1 inline-flex items-center justify-center w-6 h-6 rounded-full bg-rose-600 flex-shrink-0">
                      <span className="block w-3 h-0.5 bg-white rounded" aria-hidden="true" />
                    </span>
                    <span className="text-slate-800 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Your rights */}
        <section className="mb-16">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-6 text-center">
            Your rights, in plain language
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Card className="bg-white border-2 border-slate-200 shadow-md">
              <CardContent className="p-6 text-center">
                <FileText className="h-8 w-8 text-sky-600 mx-auto mb-3" aria-hidden="true" />
                <h3 className="font-bold text-slate-900 mb-2">Export your data</h3>
                <p className="text-sm text-slate-700">Download your records, journal, and progress anytime from your profile.</p>
              </CardContent>
            </Card>
            <Card className="bg-white border-2 border-slate-200 shadow-md">
              <CardContent className="p-6 text-center">
                <CheckCircle2 className="h-8 w-8 text-emerald-600 mx-auto mb-3" aria-hidden="true" />
                <h3 className="font-bold text-slate-900 mb-2">Edit or correct</h3>
                <p className="text-sm text-slate-700">Update or remove individual entries — including community posts you've made.</p>
              </CardContent>
            </Card>
            <Card className="bg-white border-2 border-slate-200 shadow-md">
              <CardContent className="p-6 text-center">
                <Trash2 className="h-8 w-8 text-rose-600 mx-auto mb-3" aria-hidden="true" />
                <h3 className="font-bold text-slate-900 mb-2">Delete everything</h3>
                <p className="text-sm text-slate-700">Request full account deletion and we'll permanently remove your data.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Contact */}
        <section>
          <Card className="bg-gradient-to-br from-sky-600 via-violet-600 to-rose-600 text-white border-0 shadow-xl">
            <CardContent className="p-8 sm:p-10 text-center">
              <Mail className="h-10 w-10 mx-auto mb-4 text-white" aria-hidden="true" />
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
                Questions about your privacy?
              </h2>
              <p className="text-white/90 max-w-xl mx-auto mb-6 leading-relaxed">
                We want you to feel safe sharing here. If anything about how your data is
                handled is unclear, reach out and a real person will get back to you.
              </p>
              <Link to="/Contact">
                <Button className="bg-white text-slate-900 hover:bg-slate-100 font-bold px-8 py-6 text-lg rounded-full shadow-md">
                  Contact us
                </Button>
              </Link>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}