import React from 'react';
import { format, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Printer, X } from 'lucide-react';

const MEETING_TYPE_LABELS = {
  accommodation_request: 'Accommodation Request',
  return_to_work_plan: 'Return to Work Plan',
  performance_review: 'Performance Review',
  hr_discussion: 'HR Discussion',
  supervisor_checkin: 'Supervisor Check-in',
  disclosure: 'Medical Disclosure',
  other: 'Other',
};

function Section({ title, children }) {
  return (
    <section className="mb-6 break-inside-avoid">
      <h2 className="text-sm font-bold text-brand-primary border-b border-brand-border pb-1 mb-3">
        {title}
      </h2>
      {children}
    </section>
  );
}

function safeDate(d, fmt) {
  try { return format(parseISO(d), fmt); } catch { return d; }
}

export default function PrintableMeetingDoc({ meeting, onClose }) {
  if (!meeting) return null;

  return (
    <div className="printable-doc fixed inset-0 z-[100] bg-brand-background overflow-y-auto">
      {/* Toolbar — hidden when printing */}
      <div className="print:hidden sticky top-0 z-10 bg-brand-surface border-b border-brand-border shadow-brand-sm px-4 py-3 flex items-center justify-between">
        <p className="font-bold text-brand-text">Printable Meeting Document</p>
        <div className="flex gap-2">
          <Button onClick={() => window.print()} className="">
            <Printer className="h-4 w-4 mr-2" /> Print
          </Button>
          <Button variant="outline" onClick={onClose} className="">
            <X className="h-4 w-4 mr-2" /> Close
          </Button>
        </div>
      </div>

      {/* Document */}
      <div className="max-w-[8.5in] mx-auto my-6 print:my-0 bg-brand-surface shadow-brand-lg print:shadow-none px-5 sm:px-10 py-10 print:px-0 print:py-0 text-brand-text">
        {/* Header */}
        <header className="mb-8 border-b-4 border-brand-primary pb-4">
          <p className="nv-eyebrow nv-eyebrow--primary mb-1">Meeting Preparation Document</p>
          <h1 className="text-2xl font-extrabold text-brand-text">{meeting.title || 'Untitled Meeting'}</h1>
          <div className="mt-2 text-sm text-brand-text space-y-0.5">
            <p>
              <span className="font-semibold">Meeting type:</span> {MEETING_TYPE_LABELS[meeting.meeting_type] || meeting.meeting_type}
              {meeting.meeting_date && <> &nbsp;•&nbsp; <span className="font-semibold">Date:</span> {safeDate(meeting.meeting_date, 'MMMM d, yyyy')}</>}
            </p>
            {meeting.attendees && <p><span className="font-semibold">Attendees:</span> {meeting.attendees}</p>}
          </div>
        </header>

        {meeting.goals && (
          <Section title="Meeting Goals">
            <p className="text-sm whitespace-pre-wrap">{meeting.goals}</p>
          </Section>
        )}

        {meeting.talking_points?.length > 0 && (
          <Section title="Talking Points">
            <ol className="space-y-2">
              {meeting.talking_points.map((pt, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <span className="font-bold text-brand-primary flex-shrink-0">{i + 1}.</span>
                  <span>{pt}</span>
                </li>
              ))}
            </ol>
          </Section>
        )}

        {meeting.accommodation_requests?.length > 0 && (
          <Section title="Accommodation Requests">
            <div className="space-y-3">
              {meeting.accommodation_requests.map((req, i) => (
                <div key={i} className="border border-brand-border rounded-lg p-3 break-inside-avoid">
                  <p className="text-sm font-bold">{i + 1}. {req.accommodation}</p>
                  {req.reason && <p className="text-sm text-brand-text mt-1"><span className="font-semibold">Reason:</span> {req.reason}</p>}
                </div>
              ))}
            </div>
          </Section>
        )}

        {meeting.anticipated_objections?.length > 0 && (
          <Section title="Anticipated Concerns & Responses">
            <ul className="space-y-2">
              {meeting.anticipated_objections.map((obj, i) => (
                <li key={i} className="flex gap-2 text-sm">
                  <span className="flex-shrink-0">•</span>
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {meeting.documents_to_bring?.length > 0 && (
          <Section title="Documents Checklist">
            <ul className="space-y-1.5">
              {meeting.documents_to_bring.map((d, i) => (
                <li key={i} className="flex gap-2 text-sm items-start">
                  <span className="inline-block w-4 h-4 border-2 border-brand-primary rounded-sm flex-shrink-0 mt-0.5" />
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {meeting.outcome_summary && (
          <Section title="Outcome Summary">
            <p className="text-sm whitespace-pre-wrap">{meeting.outcome_summary}</p>
          </Section>
        )}

        {meeting.description && (
          <Section title="Additional Notes">
            <p className="text-sm whitespace-pre-wrap">{meeting.description}</p>
          </Section>
        )}

        {/* Notes space for the meeting itself */}
        <Section title="Notes During Meeting">
          <div className="space-y-5 pt-1">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="border-b border-brand-border" />
            ))}
          </div>
        </Section>

        <footer className="mt-8 pt-3 border-t border-brand-border text-xs text-brand-muted-foreground flex justify-between">
          <span>Prepared with Back to Life, Back to Work Navigator</span>
          <span>Generated {format(new Date(), 'MMMM d, yyyy')}</span>
        </footer>
      </div>
    </div>
  );
}