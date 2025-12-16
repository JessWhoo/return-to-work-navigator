import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft, ChevronRight, Calendar as CalendarIcon, 
  Plus, Clock, Stethoscope, Star, Bell, MoreHorizontal, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isToday } from 'date-fns';
import AddEventDialog from './AddEventDialog';

const eventTypeConfig = {
  return_date: { icon: Star, color: 'bg-teal-500', label: 'Return Date' },
  accommodation_review: { icon: Clock, color: 'bg-amber-500', label: 'Accommodation Review' },
  energy_log: { icon: Bell, color: 'bg-blue-500', label: 'Energy Log' },
  meeting: { icon: CalendarIcon, color: 'bg-purple-500', label: 'Meeting' },
  medical: { icon: Stethoscope, color: 'bg-rose-500', label: 'Medical' },
  milestone: { icon: Star, color: 'bg-indigo-500', label: 'Milestone' },
  reminder: { icon: Bell, color: 'bg-orange-500', label: 'Reminder' },
  other: { icon: MoreHorizontal, color: 'bg-gray-500', label: 'Other' }
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
        date: new Date(progress.return_date),
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
          date: new Date(acc.review_date),
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
          date: new Date(log.date),
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
        date: new Date(event.date)
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
      <Card className="bg-white/90 backdrop-blur-sm border-2 border-indigo-200 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <CalendarIcon className="h-6 w-6 text-indigo-600" />
              <span className="text-2xl">Return-to-Work Calendar</span>
            </CardTitle>
            <Button
              onClick={() => setShowAddEvent(true)}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Event
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Calendar Controls */}
          <div className="flex items-center justify-between mb-6">
            <Button variant="outline" onClick={handlePrevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center space-x-3">
              <h3 className="text-xl font-bold text-gray-800">
                {format(currentMonth, 'MMMM yyyy')}
              </h3>
              <Button variant="ghost" size="sm" onClick={handleToday}>
                Today
              </Button>
            </div>
            <Button variant="outline" onClick={handleNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
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
                  className={`
                    relative min-h-[80px] p-2 rounded-lg border-2 transition-all
                    ${!isSameMonth(day, currentMonth) ? 'opacity-30' : ''}
                    ${isSelected ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'}
                    ${isCurrentDay ? 'bg-gradient-to-br from-teal-50 to-emerald-50' : 'bg-white'}
                  `}
                >
                  <div className={`
                    text-sm font-semibold mb-1
                    ${isCurrentDay ? 'text-teal-700' : 'text-gray-700'}
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
                            ${config?.color || 'bg-gray-500'} 
                            text-white text-xs px-1 py-0.5 rounded flex items-center space-x-1 truncate
                          `}
                          title={event.title}
                        >
                          <Icon className="h-2.5 w-2.5 flex-shrink-0" />
                          <span className="truncate">{event.title}</span>
                        </div>
                      );
                    })}
                    {dayEvents.length > 2 && (
                      <div className="text-xs text-gray-500 font-medium">
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
            <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    Events on {format(selectedDate, 'MMMM d, yyyy')}
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedDate(null)}>
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
                      className="bg-white rounded-lg p-4 border-2 border-gray-200 hover:border-indigo-300 transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className={`${config?.color || 'bg-gray-500'} p-2 rounded-lg`}>
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800">{event.title}</h4>
                            <Badge variant="outline" className="mt-1">
                              {config?.label || 'Event'}
                            </Badge>
                            {event.description && (
                              <p className="text-sm text-gray-600 mt-2">{event.description}</p>
                            )}
                          </div>
                        </div>
                        {isCustomEvent && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteEvent(event.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
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