import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';
import { format, parseISO } from 'date-fns';

/**
 * One saved feedback entry: which resource it was about, whether it helped,
 * and the topics the person asked for more support on.
 */
export default function FeedbackEntryCard({ entry }) {
  const submittedOn = entry.created_date ? format(parseISO(entry.created_date), 'MMM d, yyyy') : null;

  return (
    <Card className="bg-white border-2 border-slate-300 shadow-sm">
      <CardContent className="p-5 space-y-3">
        <div className="flex flex-wrap items-center gap-2 justify-between">
          <Badge
            className={`font-bold border ${
              entry.was_helpful
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                : 'bg-rose-100 text-rose-800 border-rose-300'
            }`}
          >
            {entry.was_helpful ? (
              <><ThumbsUp className="h-3.5 w-3.5 mr-1" /> Was helpful</>
            ) : (
              <><ThumbsDown className="h-3.5 w-3.5 mr-1" /> Not quite</>
            )}
          </Badge>
          {submittedOn && <span className="text-xs font-semibold text-slate-600">{submittedOn}</span>}
        </div>

        {entry.resource_title && (
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wide text-slate-500">Resource</p>
            <p className="text-sm font-bold text-slate-900">{entry.resource_title}</p>
          </div>
        )}

        {entry.topics_needing_support && (
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wide text-slate-500">More support needed on</p>
            <p className="text-sm font-medium text-slate-800 leading-relaxed whitespace-pre-wrap">
              {entry.topics_needing_support}
            </p>
          </div>
        )}

        {entry.description && (
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wide text-slate-500">Notes</p>
            <p className="text-sm font-medium text-slate-800 leading-relaxed whitespace-pre-wrap">{entry.description}</p>
          </div>
        )}

        {entry.page && (
          <p className="text-xs font-semibold text-slate-600 inline-flex items-center gap-1">
            <MessageSquare className="h-3.5 w-3.5" /> Shared from {entry.page}
          </p>
        )}
      </CardContent>
    </Card>
  );
}