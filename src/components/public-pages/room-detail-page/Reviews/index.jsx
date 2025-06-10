import { Star } from "lucide-react";
import ReviewList from "./ReviewList";
import AddReviewForm from "./AddReviewForm";

const Reviews = ({ room }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="px-8 py-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-900">
            Customer Reviews
          </h2>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(room?.avgRating)
                      ? "text-amber-400 fill-current"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="font-medium text-gray-900">
              {room?.avgRating?.toFixed(2)}
            </span>
            <span className="text-gray-500 text-sm">
              ({room?.reviewCount} reviews)
            </span>
          </div>
        </div>
      </div>

      <div className="p-8 pt-4">
        {/* Existing Reviews */}
        <ReviewList roomId={room?.id} />

        {/* Review Form */}
        <AddReviewForm roomId={room?.id} />
      </div>
    </div>
  );
};

export default Reviews;
