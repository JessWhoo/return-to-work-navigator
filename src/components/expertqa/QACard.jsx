import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThumbsUp, Star, CheckCircle2, User } from 'lucide-react';
import { getTopic } from './expertQaData';

export default function QACard({ item, isExpanded, onToggle, onHelpful, userMarkedHelpful }) {
  const topic = getTopic(item.topic);
  const Icon = topic.icon;
  const hasAnswer = item.status === 'answered' || item.status === 'featured';

  return (
    <motion.div layout>
      <Card className="overflow-hidden">
        <button type="button" aria-expanded={isExpanded} onClick={onToggle} className="w-full min-w-0 text-left [overflow-wrap:anywhere]">
          <CardHeader className="pb-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-brand bg-brand-muted flex-shrink-0">
                <Icon className="h-5 w-5 text-brand-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <Badge variant="secondary" className="text-xs">{topic.label}</Badge>
                  {item.status === 'featured' && (
                    <Badge className="bg-brand-compass-cream text-brand-text text-xs">
                      <Star className="h-3 w-3" /> Featured
                    </Badge>
                  )}
                  {hasAnswer ? (
                    <Badge className="bg-brand-secondary text-brand-text text-xs">
                      <CheckCircle2 className="h-3 w-3" /> Answered
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs">Awaiting expert</Badge>
                  )}
                </div>
                <CardTitle className="text-base sm:text-lg text-brand-text">
                  {item.question}
                </CardTitle>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-brand-muted-foreground">
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" /> {item.asker_name || 'Anonymous'}
                  </span>
                  {item.helpful_count > 0 && (
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="h-3 w-3" /> {item.helpful_count} helpful
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
        </button>

        <CardContent className={isExpanded ? 'pt-0 pb-4 space-y-3' : 'sr-only'}>
          {item.question_details && (
            <div className="sm:pl-14">
              <p className="text-sm text-brand-text whitespace-pre-wrap">{item.question_details}</p>
            </div>
          )}

          {hasAnswer ? (
            <div className="sm:ml-14 nv-card nv-card--muted p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center text-primary-foreground text-xs font-bold shrink-0">
                  {item.expert_name?.[0]?.toUpperCase() || 'E'}
                </div>
                <div>
                  <p className="font-bold text-sm text-brand-text">
                    {item.expert_name || 'Workplace Expert'}
                  </p>
                  {item.expert_title && (
                    <p className="text-xs text-brand-text font-medium">{item.expert_title}</p>
                  )}
                </div>
              </div>
              <p className="text-sm text-brand-text whitespace-pre-wrap">
                {item.answer}
              </p>
              <div className="mt-3 pt-3 border-t border-brand-border flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs text-brand-muted-foreground font-medium">Was this helpful?</span>
                <Button
                  size="sm"
                  aria-pressed={userMarkedHelpful}
                  variant={userMarkedHelpful ? "default" : "outline"}
                  onClick={(e) => { e.stopPropagation(); onHelpful(); }}
                  className="!whitespace-normal"
                >
                  <ThumbsUp className="h-3 w-3" />
                  {userMarkedHelpful ? 'Helpful' : 'Mark helpful'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="sm:ml-14 nv-card nv-card--muted p-4">
              <p className="text-sm text-brand-text italic">
                This question is awaiting an expert response. Check back soon.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}