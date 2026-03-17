import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const FEEDBACK_TAGS_HELPFUL = ['Empathetic', 'Actionable', 'Informative', 'Encouraging'];
const FEEDBACK_TAGS_NOT_HELPFUL = ['Too generic', 'Not relevant', 'Needs more detail', 'Missed the point'];

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
      message_snippet: messageSnippet?.slice(0, 200) || '',
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
      <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-400">
        <Check className="h-3 w-3 text-green-400" />
        <span>Thanks for the feedback!</span>
      </div>
    );
  }

  const tags = rating === 'helpful' ? FEEDBACK_TAGS_HELPFUL : FEEDBACK_TAGS_NOT_HELPFUL;

  return (
    <div className="mt-2 space-y-2">
      {/* Rating buttons */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-500">Was this helpful?</span>
        <button
          onClick={() => handleRate('helpful')}
          className={cn(
            'p-1 rounded transition-all',
            rating === 'helpful'
              ? 'text-green-400 bg-green-400/10'
              : 'text-slate-500 hover:text-green-400 hover:bg-green-400/10'
          )}
        >
          <ThumbsUp className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => handleRate('not_helpful')}
          className={cn(
            'p-1 rounded transition-all',
            rating === 'not_helpful'
              ? 'text-red-400 bg-red-400/10'
              : 'text-slate-500 hover:text-red-400 hover:bg-red-400/10'
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
                'px-2 py-0.5 rounded-full text-xs border transition-all',
                selectedTags.includes(tag)
                  ? 'bg-purple-600 border-purple-600 text-white'
                  : 'border-slate-600 text-slate-400 hover:border-purple-500 hover:text-slate-200'
              )}
            >
              {tag}
            </button>
          ))}
          <button
            onClick={handleSubmit}
            className="px-2 py-0.5 rounded-full text-xs bg-slate-700 text-slate-300 hover:bg-slate-600 border border-slate-600 transition-all"
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
}