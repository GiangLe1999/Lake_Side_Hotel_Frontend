import { Star, Send, User, CheckCircle } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const roomData = {
  id: 1,
  type: "Deluxe Ocean View Suite",
  description:
    "Experience luxury living with panoramic ocean views from our premium suite featuring modern amenities and elegant design.",
  price: 299,
  area: 45,
  beds: 2,
  rating: 4.8,
  reviewCount: 124,
  reviews: [
    {
      id: 1,
      name: "Sarah Johnson",
      rating: 5,
      date: "2 days ago",
      comment:
        "Absolutely stunning room with incredible ocean views. The service was exceptional and the amenities were top-notch.",
    },
    {
      id: 2,
      name: "Michael Chen",
      rating: 5,
      date: "1 week ago",
      comment:
        "Perfect for our honeymoon! The room was spacious, clean, and the bed was so comfortable. Highly recommend!",
    },
    {
      id: 3,
      name: "Emma Davis",
      rating: 4,
      date: "2 weeks ago",
      comment:
        "Great location and beautiful room. The only minor issue was the wifi speed, but everything else was perfect.",
    },
  ],
};

// Validation schema
const reviewSchema = yup.object({
  title: yup
    .string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters"),
  rating: yup
    .number()
    .required("Please select a rating")
    .min(1, "Rating must be at least 1 star")
    .max(5, "Rating cannot exceed 5 stars"),
  comment: yup
    .string()
    .required("Comment is required")
    .min(10, "Comment must be at least 10 characters")
    .max(1000, "Comment cannot exceed 1000 characters"),
});

const StarRating = ({ rating, onRatingChange, error }) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`w-7 h-7 transition-colors duration-150 ${
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

const Reviews = () => {
  const [reviews, setReviews] = useState(roomData.reviews);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(reviewSchema),
    defaultValues: {
      title: "",
      email: "",
      rating: 0,
      comment: "",
    },
  });

  const watchedRating = watch("rating");
  const commentValue = watch("comment");

  const onSubmit = async (data) => {
    const newReview = {
      id: reviews.length + 1,
      title: data.title,
      rating: data.rating,
      date: "Just now",
      comment: data.comment,
    };

    setReviews([newReview, ...reviews]);
  };

  const handleRatingChange = (rating) => {
    setValue("rating", rating, { shouldValidate: true });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSubmit(onSubmit)(e);
  };

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
                    i < Math.floor(roomData.rating)
                      ? "text-amber-400 fill-current"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="font-medium text-gray-900">{roomData.rating}</span>
            <span className="text-gray-500 text-sm">
              ({roomData.reviewCount} reviews)
            </span>
          </div>
        </div>
      </div>

      <div className="p-8 pt-4">
        {/* Existing Reviews */}
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="pt-6 pb-12 border-b border-[#f0f1f3]"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-700 font-medium">
                    {review.title?.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {review.title}
                    </h4>
                    <p className="text-sm text-gray-500">{review.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating
                          ? "text-amber-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="ml-1 text-sm font-medium text-gray-700">
                    {review.rating}
                  </span>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">{review.comment}</p>
            </div>
          ))}
        </div>

        {/* Review Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-8 pt-12">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              Share Your Experience
            </h3>

            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Title Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    {...register("title")}
                    type="text"
                    placeholder="Enter your title"
                    className={`main-input ${
                      errors.title
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.title && (
                    <p className="mt-1 text-red-500 text-sm">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating *
                  </label>
                  <StarRating
                    rating={watchedRating}
                    onRatingChange={handleRatingChange}
                    error={errors.rating?.message}
                  />
                </div>
              </div>

              {/* Comment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Review *
                </label>
                <textarea
                  {...register("comment")}
                  rows={4}
                  placeholder="Share your experience about the room, service, and what you liked..."
                  className={`main-input resize-none ${
                    errors.comment
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  }`}
                />
                {errors.comment && (
                  <p className="mt-1 text-red-500 text-sm">
                    {errors.comment.message}
                  </p>
                )}
                <div className="mt-1 text-xs text-gray-500 text-right">
                  {commentValue?.length || 0}/1000 characters
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-3 main-btn disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Submit Review
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Success Message */}
        {showSuccessMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-3 text-green-800">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="font-medium">
                Thank you! Your review has been submitted successfully.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;
