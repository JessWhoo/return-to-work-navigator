import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { ThumbsUp, ThumbsDown, Check } from 'lucide-react';
import BrandChoice from '@/components/brand/BrandChoice';
import { Button } from '@/components/ui/button';

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
        <Check className="h-3 w-3 text-primary" />
        <span>Thanks for the feedback!</span>
      </div>
    );
  }

  const tags = rating === 'helpful' ? FEEDBACK_TAGS_HELPFUL : FEEDBACK_TAGS_NOT_HELPFUL;

  return (
    <div className="mt-3 space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-muted-foreground">Was this helpful?</span>
        <BrandChoice selected={rating === 'helpful'} icon={ThumbsUp} onClick={() => handleRate('helpful')} className="nv-btn--icon"><span className="sr-only">Helpful</span></BrandChoice>
        <BrandChoice selected={rating === 'not_helpful'} icon={ThumbsDown} onClick={() => handleRate('not_helpful')} className="nv-btn--icon"><span className="sr-only">Not helpful</span></BrandChoice>
      </div>
      {rating && (
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => <BrandChoice key={tag} selected={selectedTags.includes(tag)} onClick={() => toggleTag(tag)}>{tag}</BrandChoice>)}
          <Button type="button" size="sm" onClick={handleSubmit}>Submit</Button>
        </div>
      )}
    </div>
  );
}