import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, Clock, Stethoscope, Briefcase, Star, 
  AlertCircle, CheckCircle2, MessageSquare, ChevronRight,
  Lightbulb, ListChecks, FileText
} from 'lucide-react';
import { format, differenceInDays, isBefore, isToday, addDays } from 'date-fns';
import { motion } from 'framer-motion';

export default function ProactiveCalendarInsights({ progress, onSendMessage }) {
  const [expandedEvent, setExpandedEvent] = useState(null);

  const getUpcomingEvents = () => {
    const events = [];
    const today = new Date();
    const nextWeek = addDays(today, 7);

    // Return date
    if (progress?.return_date) {
      const returnDate = new Date(progress.return_date);
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
        const reviewDate = new Date(acc.review_date);
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
      const eventDate = new Date(event.date);
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
    const daysUntil = differenceInDays(event.date, new Date());
    const isUrgent = daysUntil <= 1;

    const insights = {
      return_date: {
        icon: Briefcase,
        color: 'from-purple-500 to-violet-500',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-200',
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
        color: 'from-rose-500 to-pink-500',
        bgColor: 'bg-rose-50',
        borderColor: 'border-rose-200',
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
        color: 'from-blue-500 to-cyan-500',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
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
        color: 'from-amber-500 to-orange-500',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-200',
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
        color: 'from-teal-500 to-emerald-500',
        bgColor: 'bg-teal-50',
        borderColor: 'border-teal-200',
        tips: [
          'Take time to reflect on your progress',
          'Identify what strategies have been most helpful',
          'Celebrate this achievement - you\'ve earned it',
          'Consider what you\'ve learned about your capabilities',
          'Share your success with supportive people'
        ],
        resources: [
          'Reflection prompts for milestone moments',
          'Self-compassion exercises',
          'Ways to celebrate progress mindfully'
        ],
        questions: [
          'What am I most proud of accomplishing?',
          'What surprised me about this journey?',
          'What do I want to focus on next?'
        ]
      },
      reminder: {
        icon: Clock,
        color: 'from-indigo-500 to-blue-500',
        bgColor: 'bg-indigo-50',
        borderColor: 'border-indigo-200',
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
        color: 'from-gray-500 to-slate-500',
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-200',
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
    return (
      <Card className="bg-gradient-to-br from-teal-50 to-cyan-50 border-2 border-teal-200">
        <CardContent className="pt-6 text-center">
          <Calendar className="h-12 w-12 text-teal-600 mx-auto mb-3" />
          <p className="text-gray-700 font-medium">No upcoming events in the next 7 days</p>
          <p className="text-sm text-gray-600 mt-1">Add events to your calendar to receive proactive preparation tips</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-200 flex items-center space-x-2">
          <Lightbulb className="h-5 w-5 text-yellow-400" />
          <span>Proactive Insights for Upcoming Events</span>
        </h3>
        <Badge variant="outline" className="border-slate-600 text-slate-300">
          {upcomingEvents.length} upcoming
        </Badge>
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
              <Card className={`border-2 ${insights.borderColor} hover:shadow-lg transition-all overflow-hidden`}>
                <CardHeader 
                  className={`${insights.bgColor} cursor-pointer`}
                  onClick={() => setExpandedEvent(isExpanded ? null : event.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${insights.color}`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-base text-gray-800">{event.title}</CardTitle>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-sm text-gray-600">
                            {isToday(event.date) ? 'Today' : format(event.date, 'MMM d, yyyy')}
                          </span>
                          {isUrgent && (
                            <Badge className="bg-red-100 text-red-800 text-xs">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              {daysUntil === 0 ? 'Today' : 'Tomorrow'}
                            </Badge>
                          )}
                          {event.priority === 'high' && (
                            <Badge className="bg-orange-100 text-orange-800 text-xs">
                              High Priority
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className={`h-5 w-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                  </div>
                </CardHeader>

                {isExpanded && (
                  <CardContent className="pt-6 space-y-4">
                    {/* Preparation Tips */}
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2 flex items-center space-x-2">
                        <ListChecks className="h-4 w-4 text-blue-600" />
                        <span>Preparation Tips</span>
                      </h4>
                      <ul className="space-y-2">
                        {insights.tips.map((tip, tipIdx) => (
                          <li key={tipIdx} className="flex items-start space-x-2 text-sm text-gray-700">
                            <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Relevant Resources */}
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2 flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-purple-600" />
                        <span>Relevant Resources</span>
                      </h4>
                      <ul className="space-y-1">
                        {insights.resources.map((resource, resIdx) => (
                          <li key={resIdx} className="text-sm text-purple-700 ml-4">
                            • {resource}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Questions to Discuss */}
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2 flex items-center space-x-2">
                        <MessageSquare className="h-4 w-4 text-teal-600" />
                        <span>Questions You Might Have</span>
                      </h4>
                      <div className="space-y-2">
                        {insights.questions.map((question, qIdx) => (
                          <Button
                            key={qIdx}
                            variant="outline"
                            size="sm"
                            className="w-full text-left justify-start text-sm"
                            onClick={() => onSendMessage && onSendMessage(question)}
                          >
                            <MessageSquare className="h-3 w-3 mr-2 flex-shrink-0" />
                            <span className="text-left">{question}</span>
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2 border-t">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => onSendMessage && onSendMessage(`I have my ${event.title} coming up on ${format(event.date, 'MMM d')}. Can you help me prepare?`)}
                        className={`flex-1 bg-gradient-to-r ${insights.color} hover:opacity-90`}
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
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