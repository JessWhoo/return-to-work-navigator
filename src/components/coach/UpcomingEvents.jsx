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
  meeting: { 
    icon: Users, 
    color: 'blue',
    gradient: 'from-blue-500 to-cyan-500',
    bg: 'bg-blue-50',
    border: 'border-blue-200'
  },
  medical: { 
    icon: Stethoscope, 
    color: 'green',
    gradient: 'from-green-500 to-emerald-500',
    bg: 'bg-green-50',
    border: 'border-green-200'
  },
  milestone: { 
    icon: Target, 
    color: 'purple',
    gradient: 'from-purple-500 to-pink-500',
    bg: 'bg-purple-50',
    border: 'border-purple-200'
  },
  reminder: { 
    icon: Bell, 
    color: 'amber',
    gradient: 'from-amber-500 to-orange-500',
    bg: 'bg-amber-50',
    border: 'border-amber-200'
  },
  other: { 
    icon: Calendar, 
    color: 'gray',
    gradient: 'from-gray-500 to-slate-500',
    bg: 'bg-gray-50',
    border: 'border-gray-200'
  },
  return_date: {
    icon: CheckCircle2,
    color: 'rose',
    gradient: 'from-rose-500 to-pink-500',
    bg: 'bg-rose-50',
    border: 'border-rose-200'
  },
  accommodation_review: {
    icon: AlertCircle,
    color: 'indigo',
    gradient: 'from-indigo-500 to-purple-500',
    bg: 'bg-indigo-50',
    border: 'border-indigo-200'
  }
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
    <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-lg">
          <Clock className="h-5 w-5 text-indigo-600" />
          <span>Upcoming Events</span>
          <Badge className="ml-auto bg-indigo-500">{upcomingEvents.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {upcomingEvents.map((event) => {
          const config = eventTypeConfig[event.type] || eventTypeConfig.other;
          const Icon = config.icon;
          
          return (
            <div
              key={event.id}
              className={`p-3 rounded-lg ${config.bg} border ${config.border} space-y-2`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-2 flex-1">
                  <div className={`p-1.5 rounded-md bg-gradient-to-br ${config.gradient} mt-0.5`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-800 text-sm">{event.title}</h4>
                    {event.description && (
                      <p className="text-xs text-gray-600 mt-0.5">{event.description}</p>
                    )}
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-gray-500">
                        {format(parseISO(event.date), 'MMM d, yyyy')}
                      </span>
                      <span className="text-xs font-medium text-gray-700">
                        {event.daysUntil === 0 ? '• Today' : 
                         event.daysUntil === 1 ? '• Tomorrow' : 
                         `• In ${event.daysUntil} days`}
                      </span>
                    </div>
                  </div>
                </div>
                {event.urgency === 'high' && (
                  <Badge className="bg-red-500 text-white text-xs">Urgent</Badge>
                )}
              </div>
              
              <Button
                onClick={() => handleAskCoach(event)}
                size="sm"
                variant="outline"
                className="w-full text-xs"
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