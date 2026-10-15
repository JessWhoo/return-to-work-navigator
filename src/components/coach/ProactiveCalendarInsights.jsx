import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Calendar, Clock, Stethoscope, Briefcase, Star, 
  AlertCircle, CheckCircle2, MessageSquare, ChevronRight,
  Lightbulb, ListChecks, FileText
} from 'lucide-react';
import { format, parseISO, differenceInDays, isBefore, isToday, addDays } from 'date-fns';
import { motion } from 'framer-motion';

export default function ProactiveCalendarInsights({ progress, onSendMessage }) {
  const [expandedEvent, setExpandedEvent] = useState(null);

  const getUpcomingEvents = () => {
    const events = [];
    const today = new Date();
    const nextWeek = addDays(today, 7);

    // Return date
    if (progress?.return_date) {
      // Date-only values must parse as LOCAL midnight: new Date('2026-12-01')
      // is UTC midnight, which lands on Nov 30 for anyone behind UTC.
      const returnDate = parseISO(progress.return_date);
      if (isBefore(today, returnDate) && isBefore(returnDate, nextWeek)) {
        events.push({
          id: 'return-date',
          title: 'Return to Work',
          date: returnDate,
          type: 'return_date',
          priority: 'high',
          description: 'Your planned return to work date'
        });
      }
    }

    // Accommodation reviews
    progress?.accommodations_requested?.forEach((acc, idx) => {
      if (acc.review_date) {
        const reviewDate = parseISO(acc.review_date);
        if (isBefore(today, reviewDate) && isBefore(reviewDate, nextWeek)) {
          events.push({
            id: `acc-review-${idx}`,
            title: `${acc.type} Accommodation Review`,
            date: reviewDate,
            type: 'accommodation_review',
            priority: 'medium',
            description: `Review meeting for ${acc.type} accommodation`
          });
        }
      }
    });

    // Calendar events
    progress?.calendar_events?.forEach((event) => {
      const eventDate = parseISO(event.date);
      if (isBefore(today, eventDate) && isBefore(eventDate, nextWeek)) {
        events.push({
          ...event,
          date: eventDate,
          priority: event.type === 'medical' || event.type === 'meeting' ? 'high' : 'medium'
        });
      }
    });

    return events.sort((a, b) => a.date - b.date);
  };

  const getEventInsights = (event) => {
    const insights = {
      return_date: {
        icon: Briefcase,
        tips: [
          'Review your completed checklist items and note any gaps',
          'Confirm all accommodation requests are in place',
          'Prepare responses for common questions about your absence',
          'Plan your commute and first-day schedule',
          'Pack comfortable clothing and any needed supplies'
        ],
        resources: [
          'Communication scripts for first day conversations',
          'Energy management strategies for your first week',
          'Stress reduction techniques for transition anxiety'
        ],
        questions: [
          'What are my main concerns about returning?',
          'What accommodations do I need to ensure are ready?',
          'How can I pace myself during the first week?'
        ]
      },
      medical: {
        icon: Stethoscope,
        tips: [
          'List symptoms or concerns you\'ve experienced since last visit',
          'Note how your energy levels affect work capability',
          'Bring your energy logs to show patterns',
          'Ask about any work restrictions or limitations',
          'Request documentation for workplace accommodations if needed'
        ],
        resources: [
          'Sample questions to ask your oncologist',
          'How to discuss workplace capacity with your doctor',
          'Documentation templates for accommodation requests'
        ],
        questions: [
          'What should I ask my doctor about work readiness?',
          'How do I discuss ongoing fatigue or symptoms?',
          'What documentation will my employer need?'
        ]
      },
      meeting: {
        icon: Briefcase,
        tips: [
          'Schedule meeting during your peak energy time if possible',
          'Prepare key points in writing beforehand',
          'Use the BFOQ framework: Brief, Factual, Objective, Qualified',
          'Practice boundary-setting phrases',
          'Plan breaks before and after the meeting'
        ],
        resources: [
          'Communication strategies for supervisor discussions',
          'How to discuss accommodations professionally',
          'Phrases for setting boundaries without over-explaining'
        ],
        questions: [
          'How do I communicate my needs without over-sharing?',
          'What if my supervisor seems unsupportive?',
          'How do I negotiate a modified workload?'
        ]
      },
      accommodation_review: {
        icon: FileText,
        tips: [
          'Document what\'s working well (with specific examples)',
          'Identify what needs adjustment',
          'Prepare energy/mood data to support your needs',
          'Consider any new accommodations that might help',
          'Have alternative solutions ready if current ones aren\'t working'
        ],
        resources: [
          'How to document accommodation effectiveness',
          'Sample accommodation adjustment requests',
          'Your rights during accommodation reviews'
        ],
        questions: [
          'How do I prepare for this review meeting?',
          'What if they want to reduce my accommodations?',
          'Can I request additional accommodations?'
        ]
      },
      milestone: {
        icon: Star,
        tips: [
          'Take time to reflect on your progress',
          'Identify what strategies have been most helpful',
          'Note what this milestone reflects about your progress',
          'Consider what you\'ve learned about your capabilities',
          'Share your success with supportive people'
        ],
        resources: [
          'Reflection prompts for milestone moments',
          'Self-compassion exercises',
          'Ways to reflect on progress mindfully'
        ],
        questions: [
          'What am I most proud of accomplishing?',
          'What surprised me about this journey?',
          'What do I want to focus on next?'
        ]
      },
      reminder: {
        icon: Clock,
        tips: [
          'Set up advance reminders to avoid last-minute stress',
          'Plan your energy around this task',
          'Break large tasks into smaller, manageable steps',
          'Give yourself buffer time for unexpected delays'
        ],
        resources: [
          'Energy pacing strategies',
          'Time management tips for fatigue',
          'How to prioritize when overwhelmed'
        ],
        questions: [
          'How can I prepare for this without exhausting myself?',
          'What should I do if I don\'t have energy that day?'
        ]
      },
      other: {
        icon: Calendar,
        tips: [
          'Consider how this event fits into your energy management',
          'Plan rest periods before and after if needed',
          'Give yourself permission to adjust plans if necessary'
        ],
        resources: [
          'Energy conservation strategies',
          'Self-care reminder checklist'
        ],
        questions: [
          'How can I prepare for this event?',
          'What support might I need?'
        ]
      }
    };

    return insights[event.type] || insights.other;
  };

  const upcomingEvents = getUpcomingEvents();

  if (upcomingEvents.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="flex items-center space-x-2 font-heading text-lg font-bold text-foreground">
          <Lightbulb className="h-5 w-5 text-primary" />
          <span>Proactive Insights for Upcoming Events</span>
        </h3>
        <span className="nv-chip nv-chip--muted">
          {upcomingEvents.length} upcoming
        </span>
      </div>

      <div className="space-y-3">
        {upcomingEvents.map((event, idx) => {
          const insights = getEventInsights(event);
          const Icon = insights.icon;
          const daysUntil = differenceInDays(event.date, new Date());
          const isExpanded = expandedEvent === event.id;
          const isUrgent = daysUntil <= 1;

          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="overflow-hidden">
                <CardHeader 
                  className="cursor-pointer bg-muted"
                  onClick={() => setExpandedEvent(isExpanded ? null : event.id)}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center space-x-3">
                      <div className="rounded-brand bg-primary p-2 text-primary-foreground">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-base text-foreground">{event.title}</CardTitle>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            {isToday(event.date) ? 'Today' : format(event.date, 'MMM d, yyyy')}
                          </span>
                          {isUrgent && (
                            <span className="nv-chip !bg-destructive !text-destructive-foreground">
                              <AlertCircle className="h-3 w-3" />
                              {daysUntil === 0 ? 'Today' : 'Tomorrow'}
                            </span>
                          )}
                          {event.priority === 'high' && (
                            <span className="nv-chip">High Priority</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className={`h-5 w-5 text-muted-foreground transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                  </div>
                </CardHeader>

                {isExpanded && (
                  <CardContent className="space-y-4 pt-6">
                    {/* Preparation Tips */}
                    <div>
                      <h4 className="mb-2 flex items-center space-x-2 font-semibold text-foreground">
                        <ListChecks className="h-4 w-4 text-primary" />
                        <span>Preparation Tips</span>
                      </h4>
                      <ul className="space-y-2">
                        {insights.tips.map((tip, tipIdx) => (
                          <li key={tipIdx} className="flex items-start space-x-2 text-sm text-foreground">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-secondary" />
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Relevant Resources */}
                    <div>
                      <h4 className="mb-2 flex items-center space-x-2 font-semibold text-foreground">
                        <FileText className="h-4 w-4 text-primary" />
                        <span>Relevant Resources</span>
                      </h4>
                      <ul className="space-y-1">
                        {insights.resources.map((resource, resIdx) => (
                          <li key={resIdx} className="ml-4 text-sm text-primary">
                            • {resource}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Questions to Discuss */}
                    <div>
                      <h4 className="mb-2 flex items-center space-x-2 font-semibold text-foreground">
                        <MessageSquare className="h-4 w-4 text-primary" />
                        <span>Questions You Might Have</span>
                      </h4>
                      <div className="space-y-2">
                        {insights.questions.map((question, qIdx) => (
                          <Button
                            key={qIdx}
                            variant="outline"
                            size="sm"
                            className="h-auto w-full justify-start !whitespace-normal text-left text-sm"
                            onClick={() => onSendMessage && onSendMessage(question)}
                          >
                            <MessageSquare className="h-3 w-3 flex-shrink-0" />
                            <span className="text-left">{question}</span>
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 border-t border-border pt-2">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => onSendMessage && onSendMessage(`I have my ${event.title} coming up on ${format(event.date, 'MMM d')}. Can you help me prepare?`)}
                        className="flex-1 !whitespace-normal"
                      >
                        <MessageSquare className="h-4 w-4" />
                        Discuss with Coach
                      </Button>
                    </div>
                  </CardContent>
                )}
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}