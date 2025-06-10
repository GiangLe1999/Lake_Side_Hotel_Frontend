import { useState } from "react";
import { Star } from "lucide-react";

const StarRating = ({ rating, onRatingChange, error, size = "w-5 h-5" }) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`${size} transition-colors duration-150 ${
              star <= (hoverRating || rating)
                ? "text-amber-400"
                : "text-gray-300 hover:text-amber-200"
            }`}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => onRatingChange(star)}
          >
            <Star className="w-full h-full fill-current" />
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-600">
          {rating > 0 && (
            <>
              {rating} star{rating > 1 ? "s" : ""}
              {rating === 5 && " - Excellent!"}
              {rating === 4 && " - Very Good!"}
              {rating === 3 && " - Good"}
              {rating === 2 && " - Fair"}
              {rating === 1 && " - Poor"}
            </>
          )}
        </span>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default StarRating;
