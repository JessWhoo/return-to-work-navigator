import React, { useState } from 'react';
import { Star } from 'lucide-react';

export default function StarRating({ value = 0, onRate, size = 'h-5 w-5' }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-0.5" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= (hover || Math.round(value));
        return (
          <button
            key={star}
            type="button"
            onClick={() => onRate?.(star)}
            onMouseEnter={() => onRate && setHover(star)}
            className={onRate ? 'cursor-pointer' : 'cursor-default'}
            aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
          >
            <Star
              className={`${size} transition-colors ${
                filled ? 'text-amber-500 fill-amber-400' : 'text-slate-300'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}