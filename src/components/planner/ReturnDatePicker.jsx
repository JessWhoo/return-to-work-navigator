import React, { useState, useEffect, useRef } from 'react';
import { format, isValid, parse, startOfDay } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const DATE_FORMATS = ['yyyy-MM-dd', 'MM/dd/yyyy', 'M/d/yyyy', 'MMM d, yyyy', 'MMMM d, yyyy', 'MMM d yyyy', 'MMMM d yyyy'];

function parseDateText(raw) {
  const trimmed = String(raw || '').trim();
  if (!trimmed) return null;

  for (const fmt of DATE_FORMATS) {
    const parsed = parse(trimmed, fmt, new Date());
    if (isValid(parsed) && parsed.getFullYear() >= 1900 && parsed.getFullYear() <= 2100) {
      // Confirm round-trip for numeric formats so partial strings like "2026-11-3" don't misparse
      if (fmt === 'yyyy-MM-dd' && !/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) continue;
      if ((fmt === 'MM/dd/yyyy' || fmt === 'M/d/yyyy') && !/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(trimmed)) continue;
      return { date: startOfDay(parsed), iso: format(parsed, 'yyyy-MM-dd') };
    }
  }
  return null;
}

export default function ReturnDatePicker({ id = 'returnDate', value = '', onChange, minDate = null }) {
  const [text, setText] = useState(value || '');
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');

  const selectedParsed = parseDateText(value);
  const selectedDate = selectedParsed?.date || undefined;
  const minDay = minDate ? startOfDay(minDate) : undefined;
  const [month, setMonth] = useState(selectedDate || minDay || new Date());
  const lastEmittedRef = useRef(value || '');

  const emitChange = (nextIso) => {
    lastEmittedRef.current = nextIso;
    onChange(nextIso);
  };

  useEffect(() => {
    if ((value || '') === lastEmittedRef.current) return;
    lastEmittedRef.current = value || '';
    setText(value || '');
    const parsed = parseDateText(value);
    if (parsed) {
      setMonth(parsed.date);
      setError('');
    }
  }, [value]);

  const handleTextChange = (e) => {
    const next = e.target.value;
    setText(next);

    if (!next.trim()) {
      setError('');
      emitChange('');
      return;
    }

    const parsed = parseDateText(next);
    if (parsed) {
      if (minDay && parsed.date < minDay) {
        setError(`Please choose ${format(minDay, 'yyyy-MM-dd')} or later.`);
        emitChange('');
        return;
      }
      setError('');
      setMonth(parsed.date);
      emitChange(parsed.iso);
    } else {
      setError('');
    }
  };

  const handleBlur = () => {
    const trimmed = text.trim();
    if (!trimmed) {
      setError('');
      emitChange('');
      return;
    }
    const parsed = parseDateText(trimmed);
    if (!parsed) {
      setError('Enter a valid date like YYYY-MM-DD or MM/DD/YYYY.');
      return;
    }
    if (minDay && parsed.date < minDay) {
      setError(`Please choose ${format(minDay, 'yyyy-MM-dd')} or later.`);
      return;
    }
    setError('');
    setText(parsed.iso);
    setMonth(parsed.date);
    emitChange(parsed.iso);
  };

  const handleSelect = (date) => {
    if (!date) return;
    const iso = format(date, 'yyyy-MM-dd');
    setText(iso);
    setMonth(date);
    setError('');
    emitChange(iso);
    setOpen(false);
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <Input
          id={id}
          type="text"
          value={text}
          onChange={handleTextChange}
          onBlur={handleBlur}
          placeholder="YYYY-MM-DD"
          autoComplete="off"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : `${id}-hint`}
          className="flex-1"
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Open return date calendar"
              className="shrink-0"
            >
              <CalendarIcon className="h-4 w-4" aria-hidden="true" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-auto p-0">
            <Calendar
              mode="single"
              selected={selectedDate}
              month={month}
              onMonthChange={setMonth}
              disabled={minDay ? { before: minDay } : undefined}
              onSelect={handleSelect}
              classNames={{
                nav_button: 'nv-btn nv-btn--outline !min-h-0 !p-0 h-8 w-8 bg-transparent opacity-70 hover:opacity-100',
                day: 'nv-btn nv-btn--text !min-h-0 !p-0 h-9 w-9 font-normal aria-selected:opacity-100',
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-xs font-medium text-destructive">
          {error}
        </p>
      ) : (
        <p id={`${id}-hint`} className="text-xs text-muted-foreground">
          Type a date (e.g. 2026-12-01) or pick one from the calendar.
        </p>
      )}
    </div>
  );
}