import { useState } from 'react';
import { Star } from 'lucide-react';

const SIZES = { sm: 'w-3.5 h-3.5', md: 'w-5 h-5', lg: 'w-7 h-7' };

// Read-only by default. Pass onChange to make it an input — hovering then
// previews the value you'd commit, which is what makes star pickers feel right.
export default function StarRating({ value = 0, onChange, size = 'md', className = '' }) {
  const [hovered, setHovered] = useState(0);
  const interactive = typeof onChange === 'function';
  const shown = hovered || value;

  return (
    <div
      className={`inline-flex items-center gap-0.5 ${className}`}
      onMouseLeave={() => interactive && setHovered(0)}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= shown;
        const StarIcon = (
          <Star
            className={`${SIZES[size]} transition-all duration-150 ${
              filled ? 'text-amber-400 fill-amber-400' : 'text-slate-300 dark:text-slate-600'
            } ${interactive && hovered === star ? 'scale-125' : ''}`}
          />
        );

        if (!interactive) return <span key={star}>{StarIcon}</span>;

        return (
          <button
            key={star}
            type="button"
            aria-label={`${star} star${star > 1 ? 's' : ''}`}
            onMouseEnter={() => setHovered(star)}
            onClick={() => onChange(star)}
            className="rounded transition-transform focus:outline-none focus:ring-2 focus:ring-brand-500/40"
          >
            {StarIcon}
          </button>
        );
      })}
    </div>
  );
}
