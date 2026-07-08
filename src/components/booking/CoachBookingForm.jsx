import React, { useState, useMemo, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { format, addDays, startOfToday, isWeekend } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { CheckCircle2, Calendar as CalendarIcon, Clock, Video, Phone } from 'lucide-react';

const TIME_SLOTS = [
  '09:00 AM', '10:00 AM', '11:00 AM',
  '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'
];

const TOPICS = [
  { value: 'return_to_work_planning', label: 'Return-to-work planning' },
  { value: 'accommodations', label: 'Requesting accommodations' },
  { value: 'workplace_disclosure', label: 'Disclosing to my employer' },
  { value: 'energy_and_fatigue', label: 'Energy & fatigue management' },
  { value: 'career_transition', label: 'Career transition' },
  { value: 'communication_and_boundaries', label: 'Communication & boundaries' },
  { value: 'emotional_support', label: 'Emotional support' },
  { value: 'other', label: 'Something else' },
];

// Next 14 weekdays available for booking.
function useAvailableDates() {
  return useMemo(() => {
    const out = [];
    let d = addDays(startOfToday(), 1); // start tomorrow
    while (out.length < 14) {
      if (!isWeekend(d)) out.push(new Date(d));
      d = addDays(d, 1);
    }
    return out;
  }, []);
}

export default function CoachBookingForm({ user, onBooked }) {
  const dates = useAvailableDates();
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [duration, setDuration] = useState('30');
  const [format_, setFormat] = useState('video');
  const [topic, setTopic] = useState('');
  const [notes, setNotes] = useState('');
  const [contactName, setContactName] = useState(user?.full_name || '');
  const [contactEmail, setContactEmail] = useState(user?.email || '');
  const [submitting, setSubmitting] = useState(false);

  // Which time slots are already booked on the coach's calendar for the selected date.
  const [busyMap, setBusyMap] = useState({}); // { '09:00 AM': true, ... }
  const [loadingAvailability, setLoadingAvailability] = useState(false);

  // When the date or duration changes, ask the backend which slots are busy.
  useEffect(() => {
    if (!selectedDate) {
      setBusyMap({});
      return;
    }
    let cancelled = false;
    setLoadingAvailability(true);
    (async () => {
      try {
        const res = await base44.functions.invoke('getCoachAvailability', {
          date: format(selectedDate, 'yyyy-MM-dd'),
          timezone,
          slots: TIME_SLOTS,
          durationMinutes: Number(duration),
        });
        if (cancelled) return;
        setBusyMap(res?.data?.busy || {});
        // Clear the selection if it just became unavailable.
        if (selectedTime && res?.data?.busy?.[selectedTime]) {
          setSelectedTime(null);
        }
      } catch (err) {
        console.warn('Availability lookup failed:', err);
        if (!cancelled) setBusyMap({});
      } finally {
        if (!cancelled) setLoadingAvailability(false);
      }
    })();
    return () => { cancelled = true; };
     
  }, [selectedDate, duration, timezone]);

  const canSubmit =
    !!selectedDate && !!selectedTime && !!topic && !!contactEmail.trim();

  const handleSubmit = async () => {
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    try {
      const booking = await base44.entities.CoachBooking.create({
        requested_date: format(selectedDate, 'yyyy-MM-dd'),
        requested_time: selectedTime,
        timezone,
        duration_minutes: Number(duration),
        session_format: format_,
        topic,
        notes: notes.trim(),
        contact_email: contactEmail.trim(),
        contact_name: contactName.trim(),
        status: 'requested',
      });

      // The coach's Google Calendar event is created server-side by the
      // "New coach booking → calendar event" entity automation, which fires
      // on CoachBooking.create. Clients cannot invoke that endpoint directly.
      const topicLabel = TOPICS.find((t) => t.value === topic)?.label || topic;

      // Send a confirmation email so the user has a written record of the request.
      // Failure here shouldn't block the booking itself — just log it.
      try {
        await base44.integrations.Core.SendEmail({
          to: contactEmail.trim(),
          subject: 'Your coaching session request',
          body: [
            `Hi ${contactName.trim() || 'there'},`,
            '',
            'Thanks for requesting a session with a return-to-work coach. Here are the details we received:',
            '',
            `Date: ${format(selectedDate, 'EEEE, MMMM d, yyyy')}`,
            `Time: ${selectedTime} (${timezone})`,
            `Length: ${duration} minutes`,
            `Format: ${format_ === 'video' ? 'Video call' : 'Phone call'}`,
            `Topic: ${topicLabel}`,
            notes.trim() ? `Notes: ${notes.trim()}` : '',
            '',
            'A coach will reach out shortly to confirm the time and share meeting details.',
            '',
            '— Back to Life, Back to Work Navigator',
          ].filter(Boolean).join('\n'),
        });
      } catch (emailErr) {
        console.warn('Confirmation email failed:', emailErr);
      }

      toast({
        title: 'Session requested',
        description: 'A coach will confirm your time by email shortly.',
      });
      onBooked?.(booking);

      // Reset key fields so the form can be used again.
      setSelectedDate(null);
      setSelectedTime(null);
      setNotes('');
      setTopic('');
    } catch (err) {
      toast({
        title: 'Could not book your session',
        description: err?.message || 'Please try again in a moment.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Date picker */}
      <div>
        <Label className="text-slate-900 font-bold text-base flex items-center gap-2 mb-3">
          <CalendarIcon className="h-4 w-4 text-rose-600" />
          Choose a date
        </Label>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2">
          {dates.map((d) => {
            const iso = format(d, 'yyyy-MM-dd');
            const active = selectedDate && format(selectedDate, 'yyyy-MM-dd') === iso;
            return (
              <button
                key={iso}
                type="button"
                onClick={() => setSelectedDate(d)}
                className={`px-2 py-3 rounded-lg border-2 text-center transition-all ${
                  active
                    ? 'border-rose-600 bg-rose-50 text-slate-900 shadow-md'
                    : 'border-slate-300 bg-white text-slate-800 hover:border-rose-400'
                }`}
              >
                <div className="text-[11px] font-bold uppercase tracking-wide text-slate-600">
                  {format(d, 'EEE')}
                </div>
                <div className="text-lg font-extrabold leading-tight">
                  {format(d, 'd')}
                </div>
                <div className="text-[11px] font-semibold text-slate-600">
                  {format(d, 'MMM')}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time picker */}
      <div>
        <Label className="text-slate-900 font-bold text-base flex items-center gap-2 mb-3">
          <Clock className="h-4 w-4 text-sky-600" />
          Choose a time
          <span className="ml-2 text-xs font-semibold text-slate-600">({timezone})</span>
          {loadingAvailability && (
            <span className="ml-2 text-xs font-medium text-slate-600">Checking availability…</span>
          )}
        </Label>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2">
          {TIME_SLOTS.map((t) => {
            const active = selectedTime === t;
            const isBusy = !!busyMap[t];
            const disabled = !selectedDate || isBusy;
            return (
              <button
                key={t}
                type="button"
                disabled={disabled}
                onClick={() => setSelectedTime(t)}
                title={isBusy ? 'Already booked' : undefined}
                className={`px-2 py-3 rounded-lg border-2 text-sm font-bold transition-all ${
                  active
                    ? 'border-sky-600 bg-sky-50 text-slate-900 shadow-md'
                    : isBusy
                    ? 'border-slate-200 bg-slate-100 text-slate-500 line-through cursor-not-allowed'
                    : 'border-slate-300 bg-white text-slate-800 hover:border-sky-400 disabled:opacity-40 disabled:cursor-not-allowed'
                }`}
              >
                {t}
              </button>
            );
          })}
        </div>
        {!selectedDate && (
          <p className="text-xs text-slate-600 mt-2 font-medium">Pick a date first to select a time.</p>
        )}
        {selectedDate && !loadingAvailability && Object.values(busyMap).some(Boolean) && (
          <p className="text-xs text-slate-600 mt-2 font-medium">
            Grayed-out times are already booked on the coach's calendar.
          </p>
        )}
      </div>

      {/* Duration + Format */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label className="text-slate-900 font-bold text-base mb-2 block">Session length</Label>
          <Select value={duration} onValueChange={setDuration}>
            <SelectTrigger className="bg-white border-2 border-slate-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">30 minutes</SelectItem>
              <SelectItem value="45">45 minutes</SelectItem>
              <SelectItem value="60">60 minutes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-slate-900 font-bold text-base mb-2 block">How would you like to meet?</Label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setFormat('video')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg border-2 font-semibold transition-all ${
                format_ === 'video'
                  ? 'border-emerald-600 bg-emerald-50 text-slate-900'
                  : 'border-slate-300 bg-white text-slate-800 hover:border-emerald-400'
              }`}
            >
              <Video className="h-4 w-4" /> Video
            </button>
            <button
              type="button"
              onClick={() => setFormat('phone')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg border-2 font-semibold transition-all ${
                format_ === 'phone'
                  ? 'border-emerald-600 bg-emerald-50 text-slate-900'
                  : 'border-slate-300 bg-white text-slate-800 hover:border-emerald-400'
              }`}
            >
              <Phone className="h-4 w-4" /> Phone
            </button>
          </div>
        </div>
      </div>

      {/* Topic */}
      <div>
        <Label className="text-slate-900 font-bold text-base mb-2 block">
          What would you like to focus on?
        </Label>
        <Select value={topic} onValueChange={setTopic}>
          <SelectTrigger className="bg-white border-2 border-slate-300">
            <SelectValue placeholder="Choose a topic" />
          </SelectTrigger>
          <SelectContent>
            {TOPICS.map((t) => (
              <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Contact details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="contact-name" className="text-slate-900 font-bold text-base mb-2 block">
            Your name
          </Label>
          <Input
            id="contact-name"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            placeholder="First name works"
            className="bg-white border-2 border-slate-300"
          />
        </div>
        <div>
          <Label htmlFor="contact-email" className="text-slate-900 font-bold text-base mb-2 block">
            Email for confirmation
          </Label>
          <Input
            id="contact-email"
            type="email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            placeholder="you@example.com"
            className="bg-white border-2 border-slate-300"
          />
        </div>
      </div>

      {/* Notes */}
      <div>
        <Label htmlFor="notes" className="text-slate-900 font-bold text-base mb-2 block">
          Anything the coach should know? <span className="font-medium text-slate-600">(optional)</span>
        </Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Share context, specific questions, or goals for the session."
          className="bg-white border-2 border-slate-300 min-h-[110px]"
          maxLength={2000}
        />
      </div>

      <Button
        onClick={handleSubmit}
        disabled={!canSubmit || submitting}
        className="w-full bg-gradient-to-r from-rose-500 via-violet-500 to-sky-600 hover:from-rose-600 hover:via-violet-600 hover:to-sky-700 text-white font-bold text-base py-6 rounded-xl shadow-lg disabled:opacity-40"
      >
        {submitting ? 'Booking your session…' : (
          <span className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" /> Request this session
          </span>
        )}
      </Button>
    </div>
  );
}