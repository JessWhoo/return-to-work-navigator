import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, MessageSquare } from 'lucide-react';
import StarRating from './StarRating';
import WellnessRatingEditor from '@/components/wellness/WellnessRatingEditor';

const TOPIC_LABELS = {
  fatigue_management: 'Fatigue Management',
  legal_rights: 'Legal Rights',
  emotional_wellbeing: 'Emotional Well-Being',
  workplace_accommodations: 'Workplace Accommodations',
  nutrition_movement: 'Nutrition & Movement',
  sleep_rest: 'Sleep & Rest',
};

export default function WellnessResourceCard({ resource, avgRating, ratingCount, myRating, myNote, onFeedback }) {
  return (
    <Card className="h-full">
      <CardContent className="flex h-full min-w-0 flex-col gap-4 p-5">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <Badge variant="secondary" className="rounded-pill !whitespace-normal">{TOPIC_LABELS[resource.topic] || resource.topic}</Badge>
          <Badge variant="outline" className="rounded-pill capitalize">{resource.type}</Badge>
        </div>
        <h3 className="break-words text-lg font-bold text-brand-text">{resource.title}</h3>
        {resource.summary && <p className="flex-1 break-words text-sm text-brand-muted-foreground">{resource.summary}</p>}
        {resource.source && <p className="break-words text-xs font-semibold text-brand-muted-foreground">Source: {resource.source}</p>}
        <div className="space-y-3 border-t border-brand-border pt-4">
          <WellnessRatingEditor resourceId={resource.id} resourceTitle={resource.title} myRating={myRating} myNote={myNote} />
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <StarRating value={avgRating} size="h-4 w-4" />
              <span className="text-xs font-semibold text-brand-muted-foreground">
                {ratingCount > 0 ? `Community: ${avgRating.toFixed(1)} (${ratingCount})` : 'No community ratings yet'}
              </span>
            </div>
            {resource.url && <a href={resource.url} target="_blank" rel="noopener noreferrer" className="nv-btn nv-btn--text nv-btn--sm">Open <ExternalLink className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" /></a>}
          </div>
          {onFeedback && <button type="button" onClick={() => onFeedback(resource)} className="nv-btn nv-btn--outline nv-btn--sm"><MessageSquare className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />Share feedback</button>}
        </div>
      </CardContent>
    </Card>
  );
}