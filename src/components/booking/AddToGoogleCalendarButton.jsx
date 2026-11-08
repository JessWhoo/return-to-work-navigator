import React from 'react';
import { Button } from '@/components/ui/button';
import { CalendarPlus, Download } from 'lucide-react';
import { buildGoogleCalendarUrl, buildIcsFile } from './calendarEvent';

function downloadIcs(booking) {
  const file = buildIcsFile(booking);
  if (!file) return;
  const url = URL.createObjectURL(new Blob([file.content], { type: 'text/calendar;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = file.fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function AddToGoogleCalendarButton({ booking }) {
  const googleUrl = buildGoogleCalendarUrl(booking);
  const ics = buildIcsFile(booking);
  if (!googleUrl || !ics) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Always available: works without a Google session, imports into any calendar. */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => downloadIcs(booking)}
        className="border-2 border-sky-300 text-sky-800 hover:bg-sky-50 font-bold"
      >
        <Download className="h-4 w-4 mr-1" aria-hidden="true" /> Add to calendar (.ics)
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => window.open(googleUrl, '_blank', 'noopener,noreferrer')}
        className="font-bold"
      >
        <CalendarPlus className="h-4 w-4 mr-1" aria-hidden="true" /> Google Calendar
      </Button>
    </div>
  );
}