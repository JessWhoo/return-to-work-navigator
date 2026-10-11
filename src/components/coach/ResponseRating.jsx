import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { ThumbsUp, ThumbsDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const FEEDBACK_TAGS_HELPFUL = ['Empathetic', 'Actionable', 'Informative', 'Encouraging'];
const FEEDBACK_TAGS_NOT_HELPFUL = ['Too generic', 'Not relevant', 'Needs more detail', 'Missed the point'];

// Strip HTML tags, markdown syntax, and collapse whitespace so a stored
// message_snippet can NEVER carry executable markup into any admin viewer.
function sanitizeSnippet(text) {
  if (!text) return '';
  return String(text)
    .replace(/<[^>]*>/g, '')                 // strip HTML tags
    .replace(/[`*_~[\]()#>!]/g, '')          // strip markdown control chars
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 200);
}

export default function ResponseRating({ conversationId, messageIndex, messageSnippet, detectedSentiment }) {
  const [rating, setRating] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const handleRate = (value) => {
    setRating(value);
    setSelectedTags([]);
  };

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async () => {
    await base44.entities.CoachFeedback.create({
      conversation_id: conversationId,
      message_index: messageIndex,
      rating,
      feedback_tags: selectedTags,
      message_snippet: sanitizeSnippet(messageSnippet),
      detected_sentiment: detectedSentiment || 'neutral'
    });

    base44.analytics.track({
      eventName: 'coach_response_rated',
      properties: { rating, feedback_tags: selectedTags, detected_sentiment: detectedSentiment }
    });

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Check className="h-3 w-3 text-brand-secondary" />
        <span>Thanks for the feedback!</span>
      </div>
    );
  }

  const tags = rating === 'helpful' ? FEEDBACK_TAGS_HELPFUL : FEEDBACK_TAGS_NOT_HELPFUL;

  return (
    <div className="mt-2 space-y-2">
      {/* Rating buttons */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Was this helpful?</span>
        <button
          onClick={() => handleRate('helpful')}
          className={cn(
            'rounded p-1 transition-all',
            rating === 'helpful'
              ? 'text-brand-secondary bg-brand-secondary/15'
              : 'text-muted-foreground hover:text-brand-secondary hover:bg-brand-secondary/10'
          )}
        >
          <ThumbsUp className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => handleRate('not_helpful')}
          className={cn(
            'rounded p-1 transition-all',
            rating === 'not_helpful'
              ? 'text-destructive bg-destructive/10'
              : 'text-muted-foreground hover:text-destructive hover:bg-destructive/10'
          )}
        >
          <ThumbsDown className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Quick tags */}
      {rating && (
        <div className="flex flex-wrap gap-1.5">
          {tags.map(tag => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={cn(
                'rounded-pill border px-2 py-0.5 text-xs transition-all',
                selectedTags.includes(tag)
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border text-muted-foreground hover:border-primary hover:text-foreground'
              )}
            >
              {tag}
            </button>
          ))}
          <button
            onClick={handleSubmit}
            className="rounded-pill border border-primary bg-primary px-2 py-0.5 text-xs text-primary-foreground transition-all hover:opacity-90"
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
}