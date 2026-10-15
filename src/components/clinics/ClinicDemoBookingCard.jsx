import React, { useState, useMemo } from 'react';
import { format, addDays, startOfToday, isWeekend } from 'date-fns';
import { Calendar as CalendarIcon, Clock, Video, Phone, CheckCircle2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import BottomSheetSelect from '@/components/ui/bottom-sheet-select';
import AddToGoogleCalendarButton from '@/components/booking/AddToGoogleCalendarButton';
import { toast } from 'sonner';

const DEMO_SLOTS = [
  '09:00 AM', '09:30 AM', '10:30 AM', '11:30 AM',
  '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM',
];

const ROLES = [
  { value: 'Oncology Nurse Navigator', label: 'Oncology Nurse Navigator' },
  { value: 'Oncology Social Worker', label: 'Oncology Social Worker' },
  { value: 'Survivorship Program Coordinator', label: 'Survivorship Program Coordinator' },
  { value: 'Patient Navigator / Advocate', label: 'Patient Navigator / Advocate' },
  { value: 'Clinic / Cancer Center Leader', label: 'Clinic / Cancer Center Leader' },
  { value: 'Occupational / Rehab Therapist', label: 'Occupational / Rehab Therapist' },
  { value: 'Other Care Team Member', label: 'Other Care Team Member' },
];

function useAvailableWeekdays() {
  return useMemo(() => {
    const out = [];
    let d = addDays(startOfToday(), 1);
    while (out.length < 10) {
      if (!isWeekend(d)) out.push(new Date(d));
      d = addDays(d, 1);
    }
    return out;
  }, []);
}

export default function ClinicDemoBookingCard() {
  const dates = useAvailableWeekdays();
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Denver';

  const [selectedDate, setSelectedDate] = useState(() => dates[0] || null);
  const [selectedTime, setSelectedTime] = useState('10:30 AM');
  const [sessionFormat, setSessionFormat] = useState('video');
  const [name, setName] = useState('');
  const [role, setRole] = useState('Oncology Nurse Navigator');
  const [organization, setOrganization] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  const canSubmit = Boolean(
    selectedDate && selectedTime && name.trim() && organization.trim() && email.trim()
  );

  const handleBookDemo = async (e) => {
    e.preventDefault();
    if (!canSubmit || submitting) return;
    setSubmitting(true);

    const isoDate = format(selectedDate, 'yyyy-MM-dd');
    const dateStr = format(selectedDate, 'EEEE, MMMM d, yyyy');
    const formatLabel = sessionFormat === 'video' ? 'Video call (Zoom / Google Meet)' : 'Phone call';

    try {
      await base44.functions.invoke('sendAppEmail', {
        operation: 'clinic_demo_booking',
        data: {
          name: name.trim(),
          role,
          organization: organization.trim(),
          email: email.trim(),
          dateStr,
          time: selectedTime,
          timezone,
          formatLabel,
          notes: notes.trim(),
        },
      });

      // Also save a CoachBooking record if the visitor happens to be signed in.
      try {
        const isAuthed = await base44.auth.isAuthenticated();
        if (isAuthed) {
          await base44.entities.CoachBooking.create({
            requested_date: isoDate,
            requested_time: selectedTime,
            timezone,
            duration_minutes: 15,
            session_format: sessionFormat,
            topic: 'clinic_navigator_demo',
            notes: `[15-Min Clinic Demo — ${role} at ${organization.trim()}] ${notes.trim()}`.trim(),
            contact_email: email.trim(),
            contact_name: name.trim(),
            status: 'requested',
          });
        }
      } catch {
        // Non-blocking for public clinic visitors
      }

      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'conversion', {
          send_to: 'AW-18498327009/FLoYCKuhzJMdEOGj2PRE',
        });
      }

      setConfirmedBooking({
        requested_date: isoDate,
        requested_time: selectedTime,
        timezone,
        duration_minutes: 15,
        session_format: sessionFormat,
        topic: 'clinic_navigator_demo',
        notes: `15-Minute Clinic Walkthrough for ${organization.trim()} (${role})`,
        dateStr,
        formatLabel,
        name: name.trim(),
        organization: organization.trim(),
        email: email.trim(),
      });
      toast.success('15-minute clinic demo requested!');
    } catch {
      toast.error('Could not submit demo request. Please try again or email jess@artisanhrai.com.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="book-clinic-demo" aria-labelledby="demo-booking-heading" className="scroll-mt-24">
      <Card>
        <CardContent className="p-6 sm:p-8 space-y-6">
          <div className="space-y-2 border-b border-brand-border pb-5">
            <p className="nv-eyebrow nv-eyebrow--primary">15-Minute Live Walkthrough</p>
            <h2 id="demo-booking-heading" className="font-heading text-2xl sm:text-3xl font-bold text-brand-text">
              Book a 15-Minute Demo for Your Clinic or Navigation Team
            </h2>
            <p className="text-sm sm:text-base text-brand-muted-foreground max-w-3xl">
              Meet with founder Jess Whorton for a focused 15-minute walkthrough of the patient experience, printable clinic handouts, and Epic/MyChart smart phrases for your survivorship team. No sales pitch — just practical tools for your patients.
            </p>
          </div>

          {confirmedBooking ? (
            <div className="nv-card nv-card--muted p-6 sm:p-8 text-center space-y-4">
              <CheckCircle2 className="mx-auto h-12 w-12 text-brand-primary" />
              <h3 className="font-heading text-xl font-bold text-brand-text">
                Your 15-Minute Clinic Demo Is Requested
              </h3>
              <p className="text-sm text-brand-muted-foreground max-w-lg mx-auto">
                Thank you, <strong className="text-brand-text">{confirmedBooking.name}</strong>. We received your request for <strong className="text-brand-text">{confirmedBooking.dateStr} at {confirmedBooking.requested_time} ({confirmedBooking.timezone})</strong> via {confirmedBooking.formatLabel.toLowerCase()} and will send a calendar invite to <strong className="text-brand-text">{confirmedBooking.email}</strong>.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <AddToGoogleCalendarButton booking={confirmedBooking} />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setConfirmedBooking(null)}
                >
                  Schedule another time
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleBookDemo} className="space-y-6">
              {/* Date selection */}
              <div className="space-y-2.5">
                <Label className="text-brand-text font-semibold flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-brand-primary" />
                  1. Choose a weekday (15-minute session)
                </Label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {dates.map((d) => {
                    const iso = format(d, 'yyyy-MM-dd');
                    const active = selectedDate && format(selectedDate, 'yyyy-MM-dd') === iso;
                    return (
                      <button
                        key={iso}
                        type="button"
                        onClick={() => setSelectedDate(d)}
                        aria-pressed={active}
                        className={`rounded-brand border px-3 py-2.5 text-center transition-colors ${
                          active
                            ? 'border-brand-primary bg-brand-primary text-primary-foreground font-bold'
                            : 'border-brand-border bg-brand-surface text-brand-text hover:bg-brand-muted'
                        }`}
                      >
                        <div className="text-xs uppercase opacity-80">{format(d, 'EEE')}</div>
                        <div className="text-base font-bold">{format(d, 'MMM d')}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time selection */}
              <div className="space-y-2.5">
                <Label className="text-brand-text font-semibold flex items-center gap-2">
                  <Clock className="h-4 w-4 text-brand-primary" />
                  2. Pick a 15-minute time slot ({timezone})
                </Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {DEMO_SLOTS.map((slot) => {
                    const active = selectedTime === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedTime(slot)}
                        aria-pressed={active}
                        className={`rounded-brand border px-3 py-2.5 text-sm font-semibold transition-colors ${
                          active
                            ? 'border-brand-primary bg-brand-primary text-primary-foreground'
                            : 'border-brand-border bg-brand-surface text-brand-text hover:bg-brand-muted'
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Role & Format */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-brand-text font-semibold">Your Role</Label>
                  <BottomSheetSelect
                    value={role}
                    onValueChange={setRole}
                    title="Your Role"
                    options={ROLES}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-brand-text font-semibold">Meeting Format (15 min)</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSessionFormat('video')}
                      aria-pressed={sessionFormat === 'video'}
                      className={`flex items-center justify-center gap-2 rounded-brand border h-11 text-sm font-semibold transition-colors ${
                        sessionFormat === 'video'
                          ? 'border-brand-primary bg-brand-primary text-primary-foreground'
                          : 'border-brand-border bg-brand-surface text-brand-text hover:bg-brand-muted'
                      }`}
                    >
                      <Video className="h-4 w-4" /> Video Call
                    </button>
                    <button
                      type="button"
                      onClick={() => setSessionFormat('phone')}
                      aria-pressed={sessionFormat === 'phone'}
                      className={`flex items-center justify-center gap-2 rounded-brand border h-11 text-sm font-semibold transition-colors ${
                        sessionFormat === 'phone'
                          ? 'border-brand-primary bg-brand-primary text-primary-foreground'
                          : 'border-brand-border bg-brand-surface text-brand-text hover:bg-brand-muted'
                      }`}
                    >
                      <Phone className="h-4 w-4" /> Phone Call
                    </button>
                  </div>
                </div>
              </div>

              {/* Clinic Contact Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="clinic-demo-name" className="text-brand-text font-semibold">
                    Your Name *
                  </Label>
                  <Input
                    id="clinic-demo-name"
                    required
                    placeholder="Sarah Jenkins, RN, OCN"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="clinic-demo-org" className="text-brand-text font-semibold">
                    Clinic / Cancer Center *
                  </Label>
                  <Input
                    id="clinic-demo-org"
                    required
                    placeholder="e.g., Huntsman Cancer Institute"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="clinic-demo-email" className="text-brand-text font-semibold">
                    Work Email *
                  </Label>
                  <Input
                    id="clinic-demo-email"
                    type="email"
                    required
                    placeholder="you@hospital.org"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Optional Notes */}
              <div className="space-y-1.5">
                <Label htmlFor="clinic-demo-notes" className="text-brand-text font-semibold">
                  Anything specific your navigation team wants to cover? <span className="font-normal text-brand-muted-foreground">(optional)</span>
                </Label>
                <Textarea
                  id="clinic-demo-notes"
                  rows={3}
                  placeholder="e.g., Sharing printed handouts in our survivorship clinic, ADA/FMLA resources for breast & GI oncology patients, or staff in-service questions."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="nv-input w-full"
                />
              </div>

              <Button type="submit" disabled={!canSubmit || submitting} className="w-full sm:w-auto">
                {submitting ? 'Requesting 15-Minute Demo…' : 'Book 15-Minute Clinic Demo'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </section>
  );
}