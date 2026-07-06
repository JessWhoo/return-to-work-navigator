import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ClipboardList, MessageSquare, FileText, Handshake,
  CheckSquare, AlertTriangle, ScrollText, Sparkles, ArrowRight
} from 'lucide-react';

// A plain-language, step-by-step guide for requesting workplace accommodations
// under the ADA (private employers, 15+) and Rehabilitation Act (federal).
// Written for cancer survivors — no legalese, just clear next steps.

const steps = [
  {
    num: 1,
    icon: ClipboardList,
    title: 'Figure out what you actually need',
    plain: 'Before talking to anyone, list the specific tasks that are hard right now and the change that would help.',
    examples: [
      '"I need to start work at 10 AM on Wednesdays for chemo" — not "I need flexibility"',
      '"I need to work from home 2 days a week during radiation" — not "I need remote work"',
      '"I need a chair with lumbar support" — not "I need better equipment"'
    ],
    tip: 'The clearer and more specific your request, the harder it is to say no.'
  },
  {
    num: 2,
    icon: MessageSquare,
    title: 'Ask in writing — use the magic words',
    plain: 'You do NOT have to say "cancer." You do NOT have to say "ADA." But you should put the request in writing (email is fine) so there is a record.',
    examples: [
      'Email your supervisor OR HR — either counts as a legal request',
      'Include the phrase "reasonable accommodation" — this triggers ADA protections',
      'Say what you need and (briefly) why — you don\'t owe them your diagnosis'
    ],
    tip: 'Once you use the words "reasonable accommodation," the clock starts on your employer\'s legal duty to respond.'
  },
  {
    num: 3,
    icon: FileText,
    title: 'Get a doctor\'s note (only if asked)',
    plain: 'Your employer may ask for medical documentation, but they can only ask what is needed to confirm you have a condition and understand the limitation.',
    examples: [
      'They can ask: "Does this employee have a condition that limits their ability to X?"',
      'They CANNOT demand: full medical records, your diagnosis, your prognosis, or your treatment plan',
      'A short note from your oncologist stating you have a "serious health condition" requiring accommodation is usually enough'
    ],
    tip: 'You control what medical info is shared. When in doubt, ask your doctor to write the minimum needed.'
  },
  {
    num: 4,
    icon: Handshake,
    title: 'Engage in the "interactive process"',
    plain: 'The law requires your employer to have a real, back-and-forth conversation with you about options — not just say yes or no.',
    examples: [
      'They may counter-offer (e.g., "We can\'t do 100% remote, but 3 days a week works")',
      'You can propose alternatives if their answer doesn\'t fit',
      'This dialogue is legally required — them ignoring you or refusing to talk is itself a violation'
    ],
    tip: 'Keep this conversation in writing (or follow up any meeting with an email summary).'
  },
  {
    num: 5,
    icon: CheckSquare,
    title: 'Get the agreement in writing',
    plain: 'Once you settle on an accommodation, ask for it in writing — including start date, duration, and who to contact if it stops working.',
    examples: [
      'A one-page accommodation agreement or HR memo is standard',
      'Include a review date (e.g., "We will revisit this in 3 months")',
      'Save a copy at home, not just on work systems'
    ],
    tip: 'Verbal agreements evaporate when supervisors change. Written ones don\'t.'
  }
];

const scriptExamples = [
  {
    scenario: 'The short email to HR or your supervisor',
    text: `Subject: Reasonable Accommodation Request

Hi [Name],

I'm writing to request a reasonable accommodation for a serious health condition that is affecting my ability to [describe the task, e.g., "work a standard 9-5 schedule"].

Specifically, I'm requesting [the exact change, e.g., "a modified start time of 10 AM on Tuesdays and Thursdays for approximately the next 12 weeks"].

I'm happy to discuss this further and to provide any medical documentation you may need. I can also propose alternatives if this specific request doesn't work for the team.

Thanks,
[Your name]`
  },
  {
    scenario: 'If they push for medical details you\'re uncomfortable sharing',
    text: `Under the ADA, I understand that my employer may request documentation confirming that I have a qualifying condition and describing the functional limitation — but not my specific diagnosis or treatment details. I've asked my physician to provide a note confirming the accommodation is medically necessary, and I'd like to keep the specifics of my condition private. Thank you for understanding.`
  },
  {
    scenario: 'If your request is denied without a real conversation',
    text: `Thank you for the response. Before we close this out, could we schedule time to discuss alternative accommodations that might work for the team? Under the ADA's interactive process, I'd like to explore options together before we consider the request denied. I'm open to compromise.`
  }
];

const commonAccommodations = [
  { category: 'Schedule', items: ['Modified start/end times', 'Flexible schedule for treatment days', 'Reduced hours (part-time)', 'Extra unpaid breaks for rest'] },
  { category: 'Location', items: ['Full or partial remote work', 'Closer parking spot', 'Move desk to a quieter area', 'Access to a private room for rest'] },
  { category: 'Duties', items: ['Temporary reassignment of heavy tasks', 'Reduced travel', 'Written instructions for memory issues', 'Voice-to-text software'] },
  { category: 'Environment', items: ['Ergonomic chair or standing desk', 'Air purifier (immunocompromised)', 'Adjustable lighting', 'Temperature control near workstation'] },
  { category: 'Leave', items: ['Intermittent FMLA leave', 'Accrued sick/PTO for appointments', 'Unpaid leave beyond FMLA', 'Phased return-to-work schedule'] }
];

const redFlags = [
  'Your employer refuses to discuss the request at all',
  'You are demoted, disciplined, or given worse assignments after requesting',
  'HR asks for your full medical records or specific diagnosis',
  'You are told "we don\'t do accommodations here"',
  'Your accommodation is granted but silently revoked or ignored',
  'Coworkers are told about your health situation without your permission'
];

export default function AccommodationRequestGuide() {
  return (
    <div className="space-y-8">
      {/* Intro */}
      <Card className="bg-gradient-to-br from-emerald-50 via-white to-teal-50 border-2 border-emerald-300">
        <CardContent className="pt-6 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold">
            <Sparkles className="h-3.5 w-3.5" />
            Plain-language guide
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            How to Request Workplace Accommodations
          </h2>
          <p className="text-slate-800 leading-relaxed">
            Under the <strong>ADA</strong> (private employers with 15+ workers) and the <strong>Rehabilitation Act </strong>
            (federal employees and federal contractors), you have the right to ask your employer for
            reasonable changes to your job so you can keep working through and after cancer treatment.
            Here's exactly how to do it — no legalese.
          </p>
        </CardContent>
      </Card>

      {/* Step-by-step */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <ArrowRight className="h-6 w-6 text-emerald-700" />
          <h3 className="text-2xl font-bold text-slate-900">The 5-Step Process</h3>
        </div>
        <div className="space-y-4">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <Card key={step.num} className="bg-white border-2 border-slate-200 shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 text-white font-bold text-lg flex-shrink-0">
                      {step.num}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className="h-5 w-5 text-emerald-700" />
                        <CardTitle className="text-lg text-slate-900">{step.title}</CardTitle>
                      </div>
                      <p className="text-slate-800 leading-relaxed">{step.plain}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pl-16 space-y-3">
                  <ul className="space-y-1.5">
                    {step.examples.map((ex, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-800">
                        <span className="text-emerald-700 font-bold mt-0.5">•</span>
                        <span>{ex}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="bg-emerald-50 border-l-4 border-emerald-500 rounded-r p-3">
                    <p className="text-sm text-emerald-900"><strong>💡 Tip:</strong> {step.tip}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Scripts */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <ScrollText className="h-6 w-6 text-blue-700" />
          <h3 className="text-2xl font-bold text-slate-900">Copy-and-Paste Scripts</h3>
        </div>
        <p className="text-slate-800">Word-for-word language you can adapt for your own situation.</p>
        <div className="space-y-3">
          {scriptExamples.map((s, i) => (
            <Card key={i} className="bg-white border-2 border-blue-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-blue-900">{s.scenario}</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="whitespace-pre-wrap text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-lg p-4 font-sans leading-relaxed">
{s.text}
                </pre>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Common accommodations */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <CheckSquare className="h-6 w-6 text-purple-700" />
          <h3 className="text-2xl font-bold text-slate-900">Common Accommodations to Consider</h3>
        </div>
        <p className="text-slate-800">Pick what fits your situation — you can request more than one.</p>
        <div className="grid sm:grid-cols-2 gap-3">
          {commonAccommodations.map((cat) => (
            <Card key={cat.category} className="bg-white border-2 border-purple-200">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Badge className="bg-purple-700 text-white">{cat.category}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1.5">
                  {cat.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-800">
                      <span className="text-purple-700 font-bold mt-0.5">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Red flags */}
      <Card className="bg-rose-50 border-2 border-rose-300">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-rose-700" />
            <CardTitle className="text-xl text-rose-900">Red Flags — When to Get Legal Help</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-slate-800">
            If any of the following happens, your employer may be violating the ADA. Document
            everything and reach out to the <strong>EEOC (1-800-669-4000)</strong> or a free
            legal service like the <strong>Cancer Legal Resource Center</strong>.
          </p>
          <ul className="grid sm:grid-cols-2 gap-2">
            {redFlags.map((flag, i) => (
              <li key={i} className="flex items-start gap-2 bg-white border border-rose-200 rounded-lg p-3">
                <span className="text-rose-700 font-bold flex-shrink-0">⚠</span>
                <span className="text-sm text-slate-800">{flag}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Quick reference */}
      <Card className="bg-gradient-to-br from-slate-50 to-white border-2 border-slate-300">
        <CardHeader>
          <CardTitle className="text-lg text-slate-900">Quick Reference Card</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-bold text-slate-900 mb-2">You are NOT required to:</p>
              <ul className="space-y-1 text-slate-800">
                <li>• Disclose your specific diagnosis</li>
                <li>• Share medical records or treatment plans</li>
                <li>• Tell coworkers about your condition</li>
                <li>• Use the word "cancer" or "ADA"</li>
              </ul>
            </div>
            <div>
              <p className="font-bold text-slate-900 mb-2">You ARE entitled to:</p>
              <ul className="space-y-1 text-slate-800">
                <li>• A written, timely response to your request</li>
                <li>• A real interactive dialogue about options</li>
                <li>• Confidentiality of any medical info shared</li>
                <li>• Protection from retaliation for asking</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}