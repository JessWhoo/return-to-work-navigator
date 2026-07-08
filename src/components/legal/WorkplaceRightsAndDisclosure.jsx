import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Shield, Lock, FileText, AlertTriangle, CheckCircle2,
  Scale, UserCheck, Eye, MessageSquare, Sparkles
} from 'lucide-react';

const laws = [
  {
    name: 'Americans with Disabilities Act (ADA)',
    icon: Shield,
    color: 'green',
    summary: 'Cancer is considered a disability under the ADA, even in remission. Employers with 15+ employees must provide reasonable accommodations and cannot discriminate based on your diagnosis or treatment history.',
    keyPoints: [
      'Protects you whether currently in treatment, in remission, or with a history of cancer',
      'Requires "reasonable accommodations" like modified schedules, remote work, or extended breaks',
      'Employer must engage in an "interactive process" with you to find solutions',
      'Cannot be fired, demoted, or denied promotion because of your cancer history'
    ]
  },
  {
    name: 'Family and Medical Leave Act (FMLA)',
    icon: FileText,
    color: 'blue',
    summary: 'Provides up to 12 weeks of unpaid, job-protected leave per year for serious health conditions, including cancer treatment and recovery. Your health insurance continues during leave.',
    keyPoints: [
      'Applies to employers with 50+ employees within a 75-mile radius',
      'You must have worked there 12+ months and 1,250+ hours in the past year',
      'Leave can be taken intermittently — e.g., chemo days, appointments, recovery',
      'You must be returned to the same or equivalent position upon return'
    ]
  },
  {
    name: 'Genetic Information Nondiscrimination Act (GINA)',
    icon: Lock,
    color: 'purple',
    summary: 'Prohibits employers from using genetic information — including family history of cancer — in hiring, firing, or promotion decisions. They also cannot request this information.',
    keyPoints: [
      'Protects you from discrimination based on hereditary cancer risk',
      'Employers cannot ask about family medical history',
      'Applies to all employers with 15+ employees'
    ]
  },
  {
    name: 'Rehabilitation Act (Section 503/504)',
    icon: Scale,
    color: 'amber',
    summary: 'Extends ADA-like protections to federal employees, federal contractors, and recipients of federal funding. Often offers broader protections than the ADA.',
    keyPoints: [
      'Covers federal government employees and contractors',
      'Affirmative action requirement for hiring people with disabilities',
      'Stronger remedies in some cases than the ADA'
    ]
  }
];

const disclosureScenarios = [
  {
    when: 'During the application & interview process',
    rule: 'You are NOT required to disclose',
    detail: 'Employers cannot legally ask about medical conditions, disabilities, or cancer history before making a job offer. You have no obligation to volunteer this information.',
    icon: Eye,
    color: 'green'
  },
  {
    when: 'After receiving a job offer (pre-employment)',
    rule: 'Only if a medical exam is required of all hires',
    detail: 'An employer can require a post-offer medical exam, but only if it is required of all candidates in similar positions. The offer cannot be rescinded unless you cannot perform essential job functions even with accommodations.',
    icon: FileText,
    color: 'amber'
  },
  {
    when: 'When requesting accommodations',
    rule: 'Yes — but only what is necessary',
    detail: 'To request reasonable accommodations under the ADA, you need to disclose enough to show you have a qualifying condition. You do NOT need to share full medical details, prognosis, or treatment plans.',
    icon: UserCheck,
    color: 'blue'
  },
  {
    when: 'During regular employment',
    rule: 'Your choice — never required',
    detail: 'You are never required to disclose your cancer history to coworkers, supervisors, or HR. If you do disclose, the company must keep it confidential in a separate medical file.',
    icon: Lock,
    color: 'purple'
  }
];

const confidenceTips = [
  {
    icon: '🛡️',
    title: 'You control the narrative',
    text: 'You decide what to share, when to share it, and with whom. There is no "right" amount of disclosure — only what feels safe and useful for you.'
  },
  {
    icon: '📋',
    title: 'Document everything',
    text: 'Keep written records of accommodation requests, meetings with HR, and employer responses. Email is your friend — it creates a paper trail.'
  },
  {
    icon: '⚖️',
    title: 'Retaliation is illegal',
    text: 'Employers cannot retaliate against you for requesting accommodations, taking FMLA leave, or filing a complaint. If they do, you have legal recourse.'
  },
  {
    icon: '🤝',
    title: 'You are not alone',
    text: 'Free legal help is available through the EEOC, Cancer Legal Resource Center, and Triage Cancer. You do not need to navigate this by yourself.'
  }
];

const colorClasses = {
  green: { bg: 'bg-emerald-50', border: 'border-emerald-300', icon: 'text-emerald-700', text: 'text-emerald-900', accent: 'bg-emerald-100' },
  blue: { bg: 'bg-blue-50', border: 'border-blue-300', icon: 'text-blue-700', text: 'text-blue-900', accent: 'bg-blue-100' },
  purple: { bg: 'bg-purple-50', border: 'border-purple-300', icon: 'text-purple-700', text: 'text-purple-900', accent: 'bg-purple-100' },
  amber: { bg: 'bg-amber-50', border: 'border-amber-300', icon: 'text-amber-700', text: 'text-amber-900', accent: 'bg-amber-100' }
};

export default function WorkplaceRightsAndDisclosure() {
  return (
    <div className="space-y-8">
      {/* Hero / Intro */}
      <Card className="bg-gradient-to-br from-emerald-50 via-white to-teal-50 border-emerald-200">
        <CardContent className="pt-6 space-y-3 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5" />
            Know your rights. Feel confident.
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Workplace Legal Rights & Disclosure Laws
          </h2>
          <p className="text-slate-800 max-w-3xl mx-auto leading-relaxed">
            Returning to work after cancer raises hard questions — what must I tell my employer?
            What are they allowed to ask? You have powerful legal protections. Here is what every
            cancer survivor should know before walking back through the office door.
          </p>
        </CardContent>
      </Card>

      {/* Key Federal Laws */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Scale className="h-6 w-6 text-emerald-700" />
          <h3 className="text-2xl font-bold text-slate-900">Key Federal Laws That Protect You</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {laws.map((law) => {
            const Icon = law.icon;
            const c = colorClasses[law.color];
            return (
              <Card key={law.name} className={`${c.bg} ${c.border} border-2`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${c.accent}`}>
                      <Icon className={`h-5 w-5 ${c.icon}`} />
                    </div>
                    <CardTitle className={`text-lg ${c.text} leading-tight`}>{law.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-slate-800 leading-relaxed">{law.summary}</p>
                  <ul className="space-y-1.5">
                    {law.keyPoints.map((point, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-800">
                        <CheckCircle2 className={`h-4 w-4 flex-shrink-0 mt-0.5 ${c.icon}`} />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Disclosure Rules */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-6 w-6 text-emerald-700" />
          <h3 className="text-2xl font-bold text-slate-900">When Must You Disclose?</h3>
        </div>
        <p className="text-slate-800 max-w-3xl">
          Short answer: <strong>almost never</strong>. Here is the breakdown by scenario:
        </p>
        <div className="space-y-3">
          {disclosureScenarios.map((s) => {
            const Icon = s.icon;
            const c = colorClasses[s.color];
            return (
              <Card key={s.when} className={`${c.bg} ${c.border} border-l-4`}>
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${c.accent} flex-shrink-0`}>
                      <Icon className={`h-5 w-5 ${c.icon}`} />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                        {s.when}
                      </p>
                      <p className={`text-base font-bold ${c.text}`}>{s.rule}</p>
                      <p className="text-sm text-slate-800 leading-relaxed">{s.detail}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Red Flags */}
      <Card className="bg-rose-50 border-rose-300 border-2">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-rose-700" />
            <CardTitle className="text-xl text-rose-900">Red Flags: Questions Employers Cannot Ask</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-800 mb-3">
            If a current or potential employer asks any of the following, they may be violating
            federal law. You can decline to answer and report the incident to the EEOC.
          </p>
          <div className="grid sm:grid-cols-2 gap-2">
            {[
              '"Do you have any medical conditions?"',
              '"Have you ever had cancer?"',
              '"Why were you out of work for so long?"',
              '"Will your treatment affect your work?"',
              '"Are you planning to have more medical procedures?"',
              '"Does cancer run in your family?"'
            ].map((q) => (
              <div key={q} className="flex items-start gap-2 bg-white rounded-lg p-3 border border-rose-200">
                <span className="text-rose-600 font-bold flex-shrink-0">✗</span>
                <span className="text-sm text-slate-800 italic">{q}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Confidence Tips */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-emerald-700" />
          <h3 className="text-2xl font-bold text-slate-900">Walk In With Confidence</h3>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {confidenceTips.map((tip) => (
            <Card key={tip.title} className="bg-white border-emerald-200">
              <CardContent className="pt-5 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{tip.icon}</span>
                  <h4 className="font-bold text-slate-900">{tip.title}</h4>
                </div>
                <p className="text-sm text-slate-800 leading-relaxed">{tip.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Where to Get Help */}
      <Card className="bg-gradient-to-br from-blue-50 to-emerald-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-xl text-slate-900 flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-700" />
            Free Legal Resources for Cancer Survivors
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <a href="https://www.eeoc.gov" target="_blank" rel="noopener noreferrer"
               className="block bg-white rounded-lg p-3 border border-blue-200 hover:border-blue-400 transition-colors">
              <p className="font-semibold text-slate-900">U.S. EEOC</p>
              <p className="text-xs text-slate-700">File a workplace discrimination complaint</p>
            </a>
            <a href="https://www.cancerlegalresources.org" target="_blank" rel="noopener noreferrer"
               className="block bg-white rounded-lg p-3 border border-blue-200 hover:border-blue-400 transition-colors">
              <p className="font-semibold text-slate-900">Cancer Legal Resource Center</p>
              <p className="text-xs text-slate-700">Free legal info & referrals for cancer patients</p>
            </a>
            <a href="https://triagecancer.org" target="_blank" rel="noopener noreferrer"
               className="block bg-white rounded-lg p-3 border border-blue-200 hover:border-blue-400 transition-colors">
              <p className="font-semibold text-slate-900">Triage Cancer</p>
              <p className="text-xs text-slate-700">Free education on legal & financial issues</p>
            </a>
            <a href="https://www.dol.gov/agencies/whd/fmla" target="_blank" rel="noopener noreferrer"
               className="block bg-white rounded-lg p-3 border border-blue-200 hover:border-blue-400 transition-colors">
              <p className="font-semibold text-slate-900">U.S. Dept. of Labor — FMLA</p>
              <p className="text-xs text-slate-700">Official FMLA rules & how to file</p>
            </a>
          </div>
          <p className="text-xs text-slate-700 italic pt-2 border-t border-blue-200">
            This information is for educational purposes only and is not legal advice. For
            advice on your specific situation, please consult a licensed attorney.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}