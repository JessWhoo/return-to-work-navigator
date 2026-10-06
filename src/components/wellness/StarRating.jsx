import React, { useState } from 'react';
import { Star } from 'lucide-react';

export default function StarRating({ value = 0, onRate, disabled = false, size = 'h-5 w-5' }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-0.5" role={onRate ? 'group' : 'img'} aria-label={onRate ? 'Your star rating' : `Average rating: ${Number(value).toFixed(1)} out of 5 stars`} onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= (hover || Math.round(value));
        if (!onRate) return <Star key={star} aria-hidden="true" className={`${size} ${filled ? 'text-amber-500 fill-amber-400' : 'text-slate-300'}`} />;
        return (
          <button
            key={star}
            type="button"
            disabled={disabled}
            aria-pressed={star === value}
            onClick={() => { setHover(0); onRate(star); }}
            onMouseEnter={() => !disabled && setHover(star)}
            className="cursor-pointer rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:cursor-wait"
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