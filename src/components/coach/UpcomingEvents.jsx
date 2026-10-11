import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar, AlertCircle, CheckCircle2, Clock, 
  Stethoscope, Users, Target, Bell
} from 'lucide-react';
import { format, differenceInDays, isSameDay, parseISO, isAfter, isBefore, addDays } from 'date-fns';

const eventTypeConfig = {
  meeting: { icon: Users, surface: 'nv-card--muted' },
  medical: { icon: Stethoscope, surface: 'nv-card--sage' },
  milestone: { icon: Target, surface: 'nv-card--muted' },
  reminder: { icon: Bell, surface: 'nv-card--pink' },
  other: { icon: Calendar, surface: 'nv-card--muted' },
  return_date: { icon: CheckCircle2, surface: 'nv-card--sage' },
  accommodation_review: { icon: AlertCircle, surface: 'nv-card--pink' }
};

export default function UpcomingEvents({ progress, onAskCoach }) {
  const getUpcomingEvents = () => {
    if (!progress) return [];
    
    const today = new Date();
    const nextWeek = addDays(today, 7);
    const events = [];

    // Add return date if set and upcoming
    if (progress.return_date) {
      const returnDate = parseISO(progress.return_date);
      if (isAfter(returnDate, today) || isSameDay(returnDate, today)) {
        const daysUntil = differenceInDays(returnDate, today);
        events.push({
          id: 'return-date',
          title: 'Return to Work',
          date: progress.return_date,
          type: 'return_date',
          daysUntil,
          urgency: daysUntil <= 7 ? 'high' : daysUntil <= 14 ? 'medium' : 'low',
          description: daysUntil === 0 ? 'Today is your return date!' : 
                      daysUntil === 1 ? 'Your return date is tomorrow!' :
                      `Your return date is in ${daysUntil} days`
        });
      }
    }

    // Add accommodation reviews
    if (progress.accommodations_requested) {
      progress.accommodations_requested.forEach((acc, idx) => {
        if (acc.review_date) {
          const reviewDate = parseISO(acc.review_date);
          if (isAfter(reviewDate, today) || isSameDay(reviewDate, today)) {
            const daysUntil = differenceInDays(reviewDate, today);
            if (daysUntil <= 14) {
              events.push({
                id: `review-${idx}`,
                title: `${acc.type} Review`,
                date: acc.review_date,
                type: 'accommodation_review',
                daysUntil,
                urgency: daysUntil <= 7 ? 'high' : 'medium',
                description: `Review for ${acc.type} accommodation`
              });
            }
          }
        }
      });
    }

    // Add custom calendar events (next 7 days)
    if (progress.calendar_events) {
      progress.calendar_events.forEach((event) => {
        const eventDate = parseISO(event.date);
        if ((isAfter(eventDate, today) || isSameDay(eventDate, today)) && 
            isBefore(eventDate, nextWeek)) {
          const daysUntil = differenceInDays(eventDate, today);
          events.push({
            ...event,
            daysUntil,
            urgency: daysUntil === 0 ? 'high' : daysUntil <= 3 ? 'medium' : 'low'
          });
        }
      });
    }

    // Sort by date
    return events.sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const upcomingEvents = getUpcomingEvents();

  if (upcomingEvents.length === 0) {
    return null;
  }

  const handleAskCoach = (event) => {
    const messages = {
      return_date: `My return-to-work date is coming up in ${event.daysUntil} days. Can you help me prepare? What should I focus on?`,
      accommodation_review: `I have an accommodation review coming up for ${event.title}. Can you help me prepare and document what's working?`,
      medical: `I have a medical appointment coming up: ${event.title}. Can you help me prepare questions and think about how to communicate the results with my employer?`,
      meeting: `I have a meeting coming up: ${event.title}. Can you help me prepare and give me some energy management tips?`,
      milestone: `I have a milestone coming up: ${event.title}. Let's reflect on my progress!`,
      reminder: `I have this reminder: ${event.title}. Can you help me think through this?`,
      other: `I have this event coming up: ${event.title}. Can you give me some advice?`
    };

    const message = messages[event.type] || messages.other;
    onAskCoach(message);
  };

  return (
    <Card className="nv-card--muted">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-lg">
          <Clock className="h-5 w-5 text-primary" />
          <span>Upcoming Events</span>
          <Badge variant="secondary" className="ml-auto rounded-pill">{upcomingEvents.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {upcomingEvents.map((event) => {
          const config = eventTypeConfig[event.type] || eventTypeConfig.other;
          const Icon = config.icon;
          
          return (
            <div
              key={event.id}
              className={`nv-card ${config.surface} space-y-3 p-4`}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="flex items-start space-x-2 flex-1">
                  <div className="mt-0.5 shrink-0 rounded-pill bg-primary p-2">
                    <Icon className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-foreground text-sm">{event.title}</h4>
                    {event.description && (
                      <p className="text-xs text-muted-foreground mt-0.5">{event.description}</p>
                    )}
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {format(parseISO(event.date), 'MMM d, yyyy')}
                      </span>
                      <span className="text-xs font-medium text-foreground">
                        {event.daysUntil === 0 ? '• Today' : 
                         event.daysUntil === 1 ? '• Tomorrow' : 
                         `• In ${event.daysUntil} days`}
                      </span>
                    </div>
                  </div>
                </div>
                {event.urgency === 'high' && (
                  <Badge variant="destructive" className="shrink-0 rounded-pill text-xs">Urgent</Badge>
                )}
              </div>
              
              <Button
                onClick={() => handleAskCoach(event)}
                size="sm"
                variant="outline"
                className="w-full !whitespace-normal text-xs"
              >
                Ask Coach for Help
              </Button>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}