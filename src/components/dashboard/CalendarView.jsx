import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft, ChevronRight, Calendar as CalendarIcon, 
  Plus, Clock, Stethoscope, Star, Bell, MoreHorizontal, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isToday } from 'date-fns';
import AddEventDialog from '@/components/dashboard/AddEventDialog';

const eventTypeConfig = {
  return_date: { icon: Star, color: 'bg-secondary', label: 'Return Date' },
  accommodation_review: { icon: Clock, color: 'bg-accent', label: 'Accommodation Review' },
  energy_log: { icon: Bell, color: 'bg-muted', label: 'Energy Log' },
  meeting: { icon: CalendarIcon, color: 'bg-muted', label: 'Meeting' },
  medical: { icon: Stethoscope, color: 'bg-accent', label: 'Medical' },
  milestone: { icon: Star, color: 'bg-secondary', label: 'Milestone' },
  reminder: { icon: Bell, color: 'bg-brand-cream', label: 'Reminder' },
  other: { icon: MoreHorizontal, color: 'bg-brand-border', label: 'Other' }
};

export default function CalendarView({ progress, onUpdateProgress }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showAddEvent, setShowAddEvent] = useState(false);

  const getAllEvents = () => {
    const events = [];
    
    // Return date
    if (progress?.return_date) {
      events.push({
        id: 'return-date',
        // Date-only values must parse as LOCAL midnight: new Date('2026-12-01')
        // is UTC midnight, which lands on Nov 30 for anyone behind UTC.
        date: parseISO(progress.return_date),
        title: 'Return to Work',
        type: 'return_date',
        description: 'Your planned return to work date'
      });
    }

    // Accommodation reviews
    progress?.accommodations_requested?.forEach((acc, idx) => {
      if (acc.review_date) {
        events.push({
          id: `acc-review-${idx}`,
          date: parseISO(acc.review_date),
          title: `${acc.type} Review`,
          type: 'accommodation_review',
          description: `Review for ${acc.type} accommodation`
        });
      }
    });

    // Energy logs
    progress?.energy_logs?.forEach((log, idx) => {
      if (log.date) {
        events.push({
          id: `energy-${idx}`,
          date: parseISO(log.date),
          title: 'Energy Log',
          type: 'energy_log',
          description: `Mood: ${log.mood || 'N/A'}, Stress: ${log.stress_level || 'N/A'}`
        });
      }
    });

    // Custom events
    progress?.calendar_events?.forEach((event) => {
      events.push({
        ...event,
        date: parseISO(event.date)
      });
    });

    return events;
  };

  const events = getAllEvents();
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getEventsForDate = (date) => {
    return events.filter(event => isSameDay(event.date, date));
  };

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const handleToday = () => setCurrentMonth(new Date());

  const handleDeleteEvent = (eventId) => {
    const updatedEvents = progress.calendar_events.filter(e => e.id !== eventId);
    onUpdateProgress({ calendar_events: updatedEvents });
  };

  const dayEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle className="flex items-center space-x-2">
              <CalendarIcon className="h-6 w-6 text-brand-primary" />
              <span className="text-xl sm:text-2xl">Return-to-Work Calendar</span>
            </CardTitle>
            <Button
              onClick={() => setShowAddEvent(true)}
              className="!whitespace-normal"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Event
            </Button>
          </div>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          {/* Calendar Controls */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
            <Button variant="outline" size="icon" aria-label="Previous month" onClick={handlePrevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-3">
              <h3 className="text-base font-bold text-brand-text sm:text-xl">
                {format(currentMonth, 'MMMM yyyy')}
              </h3>
              <Button variant="ghost" size="sm" onClick={handleToday}>
                Today
              </Button>
            </div>
            <Button variant="outline" size="icon" aria-label="Next month" onClick={handleNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-semibold text-brand-muted-foreground py-2">
                {day}
              </div>
            ))}
            
            {daysInMonth.map((day, idx) => {
              const dayEvents = getEventsForDate(day);
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              const isCurrentDay = isToday(day);
              
              return (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedDate(day)}
                  aria-label={`${format(day, 'MMMM d, yyyy')}, ${dayEvents.length} events`}
                  aria-pressed={!!isSelected}
                  aria-current={isCurrentDay ? 'date' : undefined}
                  className={`relative min-h-[64px] rounded-brand border p-1 transition-colors sm:min-h-[80px] sm:p-2 ${!isSameMonth(day, currentMonth) ? 'opacity-30' : ''} ${isSelected ? 'border-primary bg-muted' : isCurrentDay ? 'border-secondary bg-secondary/30' : 'border-border bg-card hover:bg-muted'}`}
                >
                  <div className={`
                    text-sm font-semibold mb-1
                    ${isCurrentDay ? 'text-brand-primary' : 'text-brand-text'}
                  `}>
                    {format(day, 'd')}
                  </div>
                  
                  <div className="space-y-1">
                    {dayEvents.slice(0, 2).map((event, eventIdx) => {
                      const config = eventTypeConfig[event.type];
                      const Icon = config?.icon || MoreHorizontal;
                      return (
                        <div
                          key={eventIdx}
                          className={`
                            ${config?.color || 'bg-muted'} 
                            text-brand-text text-xs px-1 py-0.5 rounded-pill flex items-center justify-center gap-1 sm:justify-start truncate
                          `}
                          title={event.title}
                        >
                          <Icon className="h-2.5 w-2.5 flex-shrink-0" />
                          <span className="hidden truncate sm:inline">{event.title}</span>
                        </div>
                      );
                    })}
                    {dayEvents.length > 2 && (
                      <div className="text-xs text-brand-muted-foreground font-medium">
                        +{dayEvents.length - 2} more
                      </div>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Selected Date Events */}
      <AnimatePresence>
        {selectedDate && dayEvents.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <Card className="nv-card--muted">
              <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <CardTitle className="text-lg">
                    Events on {format(selectedDate, 'MMMM d, yyyy')}
                  </CardTitle>
                  <Button variant="ghost" size="icon" aria-label="Close selected date events" onClick={() => setSelectedDate(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {dayEvents.map((event, idx) => {
                  const config = eventTypeConfig[event.type];
                  const Icon = config?.icon || MoreHorizontal;
                  const isCustomEvent = event.type && !['return_date', 'accommodation_review', 'energy_log'].includes(event.type);
                  
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="nv-card p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex min-w-0 flex-1 items-start gap-3">
                          <div className={`${config?.color || 'bg-muted'} shrink-0 p-2 rounded-pill`}>
                            <Icon className="h-5 w-5 text-brand-text" strokeWidth={1.75} aria-hidden="true" />
                          </div>
                          <div className="min-w-0 flex-1 break-words">
                            <h4 className="font-semibold text-brand-text">{event.title}</h4>
                            <Badge variant="outline" className="mt-1">
                              {config?.label || 'Event'}
                            </Badge>
                            {event.description && (
                              <p className="text-sm text-brand-muted-foreground mt-2">{event.description}</p>
                            )}
                          </div>
                        </div>
                        {isCustomEvent && (
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={`Delete event: ${event.title}`}
                            onClick={() => handleDeleteEvent(event.id)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Event Dialog */}
      <AddEventDialog
        open={showAddEvent}
        onClose={() => setShowAddEvent(false)}
        onAddEvent={(newEvent) => {
          const updatedEvents = [...(progress?.calendar_events || []), newEvent];
          onUpdateProgress({ calendar_events: updatedEvents });
          setShowAddEvent(false);
        }}
      />
    </div>
  );
}