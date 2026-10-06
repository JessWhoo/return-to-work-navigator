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
    <Card className="bg-white border-2 border-slate-300 shadow-sm hover:shadow-md transition-shadow h-full">
      <CardContent className="p-5 flex flex-col h-full space-y-3">
        <div className="flex items-start justify-between gap-2">
          <Badge className="bg-violet-100 text-violet-800 border border-violet-300 font-bold">
            {TOPIC_LABELS[resource.topic] || resource.topic}
          </Badge>
          <Badge variant="outline" className="capitalize">{resource.type}</Badge>
        </div>
        <h3 className="text-lg font-extrabold text-slate-900 leading-snug">{resource.title}</h3>
        {resource.summary && (
          <p className="text-sm text-slate-700 leading-relaxed flex-1">{resource.summary}</p>
        )}
        {resource.source && (
          <p className="text-xs font-semibold text-slate-600">Source: {resource.source}</p>
        )}
        <div className="pt-2 border-t border-slate-200 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <StarRating value={avgRating} size="h-4 w-4" />
              <span className="text-xs font-bold text-slate-700">
                {ratingCount > 0 ? `${avgRating.toFixed(1)} (${ratingCount})` : 'No ratings yet'}
              </span>
            </div>
            {resource.url && (
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-bold text-violet-700 hover:text-violet-900"
              >
                Open <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
          <WellnessRatingEditor resourceId={resource.id} myRating={myRating} myNote={myNote} />
          {onFeedback && (
            <button
              type="button"
              onClick={() => onFeedback(resource)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-900 underline underline-offset-2"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              Share feedback
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}