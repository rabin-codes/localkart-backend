import React from 'react';
import { Star } from 'lucide-react';

export const RatingComponent = ({ rating, reviews, size = 'md', showText = true }) => {
  const sizes = {
    sm: { star: 14, text: 'text-xs' },
    md: { star: 18, text: 'text-sm' },
    lg: { star: 24, text: 'text-base' },
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={sizes[size].star}
            className={
              i < Math.floor(rating)
                ? 'fill-yellow-400 text-yellow-400'
                : i < rating
                ? 'fill-yellow-200 text-yellow-400'
                : 'text-gray-300'
            }
          />
        ))}
      </div>
      {showText && (
        <span className={`${sizes[size].text} text-gray-600`}>
          {rating} ({reviews} reviews)
        </span>
      )}
    </div>
  );
};
