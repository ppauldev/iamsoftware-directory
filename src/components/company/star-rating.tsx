import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
}

export function StarRating({ rating, maxRating = 5 }: StarRatingProps) {
  // Ensure rating is between 0 and maxRating
  const normalizedRating = Math.min(Math.max(0, rating), maxRating);

  // Create an array of stars
  const stars = Array.from({ length: maxRating }, (_, i) => {
    const filled = i < Math.floor(normalizedRating);
    const halfFilled = !filled && i < Math.ceil(normalizedRating) && normalizedRating % 1 !== 0;

    return (
      <Star
        key={i}
        className={`w-4 h-4 ${filled
            ? 'text-yellow-500 fill-yellow-500'
            : halfFilled
              ? 'text-yellow-500 fill-yellow-500 half-filled'
              : 'text-muted-foreground'
          }`}
      />
    );
  });

  return (
    <div className="flex items-center gap-1" title={`Rating: ${normalizedRating.toFixed(1)} out of ${maxRating}`}>
      {stars}
      <span className="ml-1 text-xs text-muted-foreground">
        {normalizedRating.toFixed(1)}
      </span>
    </div>
  );
} 