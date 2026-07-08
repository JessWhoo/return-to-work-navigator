import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, Printer, RotateCcw, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { generateAccommodationWorksheetPdf } from '@/components/worksheets/generateAccommodationWorksheetPdf';
import useSEO from '@/hooks/useSEO';

const EMPTY_FORM = {
  employeeName: '',
  meetingDate: '',
  meetingTime: '',
  meetingLocation: '',
  attendees: '',
  goals: '',
  requests: '',
  rationale: '',
  talkingPoints: '',
  questions: '',
};

const EXAMPLE_FORM = {
  employeeName: '',
  meetingDate: '',
  meetingTime: '',
  meetingLocation: 'Video call (Zoom)',
  attendees: 'My supervisor, HR representative',
  goals:
    'Agree on a phased return-to-work schedule and confirm the accommodations I need for the next 90 days.',
  requests: [
    'Modified schedule: start at 10am for the first 4 weeks',
    'Two 15-minute rest breaks during the workday',
    'Option to work from home 2 days per week',
    'Temporary reduction of non-essential travel',
  ].join('\n'),
  rationale:
    'Fatigue is highest in the morning and after long stretches of focused work. These adjustments let me maintain quality and meet my core responsibilities while I continue recovery.',
  talkingPoints: [
    'I am committed to my role and want a plan that works for both of us.',
    'These accommodations are expected to be temporary and will be reviewed in 90 days.',
    'I am happy to document progress and adjust as needed.',
  ].join('\n'),
  questions: [
    'What documentation, if any, do you need from my care team?',
    'How will we measure whether the plan is working?',
    'Who should I contact if I need to adjust the plan sooner?',
  ].join('\n'),
};

function Field({ id, label, children, hint }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-sm font-bold text-slate-800">
        {label}
      </Label>
      {children}
      {hint && <p className="text-xs text-slate-600 font-medium">{hint}</p>}
    </div>
  );
}

function PreviewBlock({ title, children }) {
  return (
    <div>
      <h3 className="text-xs font-extrabold uppercase tracking-wider text-violet-700 border-b border-slate-200 pb-1 mb-2">
        {title}
      </h3>
      <div className="text-sm text-slate-800 font-medium leading-relaxed whitespace-pre-wrap min-h-[1.5rem]">
        {children || <span className="text-slate-400 italic">—</span>}
      </div>
    </div>
  );
}

export default function AccommodationWorksheet() {
  useSEO({
    title: 'Accommodation Meeting Worksheet',
    description:
      'Generate and download a clean, printable worksheet to prepare for your workplace accommodation meeting.',
    path: '/AccommodationWorksheet',
  });

  const [form, setForm] = useState(EMPTY_FORM);
  const [isDownloading, setIsDownloading] = useState(false);

  const update = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleDownload = () => {
    setIsDownloading(true);
    try {
      generateAccommodationWorksheetPdf(form);
    } finally {
      // brief flag reset so button feedback shows
      setTimeout(() => setIsDownloading(false), 400);
    }
  };

  const handlePrint = () => window.print();

  return (
    <div className="max-w-6xl mx-auto">
      {/* Print-only styles: hide the form when printing so the paper output
          shows just the preview worksheet. */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-full { max-width: none !important; }
        }
      `}</style>

      {/* Header */}
      <div className="no-print mb-6">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-violet-700">
          <Sparkles className="h-3.5 w-3.5" />
          Meeting Prep
        </div>
        <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Accommodation Meeting Worksheet
        </h1>
        <p className="mt-2 text-slate-700 font-medium max-w-2xl">
          Fill in a few details, preview your worksheet, then download a clean
          PDF you can print and bring to your meeting.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Form */}
        <Card className="no-print border-2 border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-extrabold text-slate-900">
              <FileText className="h-5 w-5 text-violet-600" />
              Your details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field id="employeeName" label="Your name">
                <Input
                  id="employeeName"
                  value={form.employeeName}
                  onChange={update('employeeName')}
                  placeholder="Jane Doe"
                />
              </Field>
              <Field id="meetingDate" label="Meeting date">
                <Input
                  id="meetingDate"
                  type="date"
                  value={form.meetingDate}
                  onChange={update('meetingDate')}
                />
              </Field>
              <Field id="meetingTime" label="Meeting time">
                <Input
                  id="meetingTime"
                  type="time"
                  value={form.meetingTime}
                  onChange={update('meetingTime')}
                />
              </Field>
              <Field id="meetingLocation" label="Location or format">
                <Input
                  id="meetingLocation"
                  value={form.meetingLocation}
                  onChange={update('meetingLocation')}
                  placeholder="e.g. HR office, Zoom, phone"
                />
              </Field>
            </div>

            <Field id="attendees" label="Attendees" hint="Who will be in the room">
              <Input
                id="attendees"
                value={form.attendees}
                onChange={update('attendees')}
                placeholder="My supervisor, HR representative"
              />
            </Field>

            <Field id="goals" label="My goals for this meeting">
              <Textarea
                id="goals"
                rows={3}
                value={form.goals}
                onChange={update('goals')}
                placeholder="What outcome do you want to leave with?"
              />
            </Field>

            <Field
              id="requests"
              label="Accommodations I'm requesting"
              hint="One per line — they'll appear as a bulleted list."
            >
              <Textarea
                id="requests"
                rows={4}
                value={form.requests}
                onChange={update('requests')}
                placeholder={'Modified schedule\nRest breaks\nWork-from-home days'}
              />
            </Field>

            <Field
              id="rationale"
              label="Why these accommodations help me do my job"
            >
              <Textarea
                id="rationale"
                rows={3}
                value={form.rationale}
                onChange={update('rationale')}
                placeholder="Briefly explain the connection to your work."
              />
            </Field>

            <Field
              id="talkingPoints"
              label="Talking points to remember"
              hint="One per line."
            >
              <Textarea
                id="talkingPoints"
                rows={3}
                value={form.talkingPoints}
                onChange={update('talkingPoints')}
                placeholder={'I am committed to my role\nThese are temporary\nI will document progress'}
              />
            </Field>

            <Field
              id="questions"
              label="Questions I want to ask"
              hint="One per line."
            >
              <Textarea
                id="questions"
                rows={3}
                value={form.questions}
                onChange={update('questions')}
                placeholder={'What documentation do you need?\nHow will we measure success?'}
              />
            </Field>

            <div className="flex flex-wrap gap-2 pt-2">
              <Button
                type="button"
                onClick={() => setForm(EXAMPLE_FORM)}
                variant="outline"
                className="font-bold"
              >
                <Sparkles className="h-4 w-4 mr-1.5" />
                Fill with example
              </Button>
              <Button
                type="button"
                onClick={() => setForm(EMPTY_FORM)}
                variant="outline"
                className="font-bold"
              >
                <RotateCcw className="h-4 w-4 mr-1.5" />
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Preview + actions */}
        <div className="space-y-5 print-full">
          <motion.div
            layout
            className="bg-white border-2 border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8"
          >
            <div className="border-b-2 border-violet-500 pb-4 mb-5">
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Accommodation Meeting Worksheet
              </h2>
              <p className="text-xs text-slate-600 font-medium mt-1">
                A simple guide to help you prepare, take notes, and follow up.
              </p>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <PreviewBlock title="Name">{form.employeeName}</PreviewBlock>
                <PreviewBlock title="Date">{form.meetingDate}</PreviewBlock>
                <PreviewBlock title="Time">{form.meetingTime}</PreviewBlock>
                <PreviewBlock title="Location / Format">
                  {form.meetingLocation}
                </PreviewBlock>
              </div>
              <PreviewBlock title="Attendees">{form.attendees}</PreviewBlock>
              <PreviewBlock title="My goals">{form.goals}</PreviewBlock>
              <PreviewBlock title="Accommodations I'm requesting">
                {form.requests}
              </PreviewBlock>
              <PreviewBlock title="Why these help">
                {form.rationale}
              </PreviewBlock>
              <PreviewBlock title="Talking points">
                {form.talkingPoints}
              </PreviewBlock>
              <PreviewBlock title="Questions I want to ask">
                {form.questions}
              </PreviewBlock>

              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-violet-700 border-b border-slate-200 pb-1 mb-2">
                  Notes during the meeting
                </h3>
                <div className="space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="border-b border-dashed border-slate-300 h-5" />
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-violet-700 border-b border-slate-200 pb-1 mb-2">
                  Agreed next steps
                </h3>
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="border-b border-dashed border-slate-300 h-5" />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <div className="no-print flex flex-wrap gap-2">
            <Button
              onClick={handleDownload}
              disabled={isDownloading}
              className="bg-gradient-to-r from-violet-500 via-purple-500 to-emerald-600 hover:from-violet-600 hover:via-purple-600 hover:to-emerald-700 text-white font-bold shadow-md"
            >
              <Download className="h-4 w-4 mr-1.5" />
              {isDownloading ? 'Preparing PDF…' : 'Download PDF'}
            </Button>
            <Button onClick={handlePrint} variant="outline" className="font-bold">
              <Printer className="h-4 w-4 mr-1.5" />
              Print
            </Button>
          </div>

          <p className="no-print text-xs text-slate-600 font-medium">
            Educational use only. Not legal advice — consult a qualified
            professional for legal guidance.
          </p>
        </div>
      </div>
    </div>
  );
}