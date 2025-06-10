import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import StarRating from "./StarRating";
import { reviewSchema } from "../../../../utils/review-schema";
import { addReview } from "../../../../service/review-service";
import { Loading } from "../../../common/Loading";
import { Send, CheckCircle } from "lucide-react";
import { useAuth } from "../../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const AddReviewForm = ({ roomId }) => {
  const queryClient = useQueryClient();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const { mutate: addReviewMutation, isPending: addReviewPending } =
    useMutation({
      mutationFn: addReview,
      onSuccess: (response) => {
        const success = response?.status === 201;
        if (success) {
          reset();
          setShowSuccessMessage(true);

          // Invalidate query review list:
          queryClient.invalidateQueries({
            queryKey: ["reviewList"],
          });
        }
      },
      onError: (err) => {
        toast.error(`Unable to submit your review: ${err.message}`);
      },
    });

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
    if (!user) return navigate("/login");

    const newReview = {
      roomId: roomId,
      title: data.title,
      rating: data.rating,
      comment: data.comment,
    };

    addReviewMutation(newReview);
  };

  const handleRatingChange = (rating) => {
    setValue("rating", rating, { shouldValidate: true });
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-6 pt-12">
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
              disabled={addReviewPending}
              className="px-4 py-3 main-btn disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {addReviewPending ? (
                <Loading />
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
    </>
  );
};

export default AddReviewForm;
