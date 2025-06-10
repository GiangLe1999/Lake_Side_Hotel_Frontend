import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getRoomReviews } from "../../../../service/review-service";
import Pagination from "../../../common/pagination/Pagination";
import ReviewSkeleton from "./ReviewSkeleton";
import ReviewCard from "./ReviewCard";
import { MessageCircle } from "lucide-react";
import EmptyState from "./EmptyState";

const ReviewList = ({ roomId = 1 }) => {
  const [pageNo, setPageNo] = useState(0);
  const pageSize = 10;

  const {
    data: reviewsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["reviewList", pageNo, roomId],
    queryFn: () => getRoomReviews({ pageNo, pageSize, roomId }),
    enabled: !!roomId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <MessageCircle className="w-8 h-8 text-red-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          An error occurred
        </h3>
        <p className="text-gray-600">
          Unable to load the review list. Please try again later.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return <ReviewSkeleton />;
  }

  if (!reviewsData?.items?.length) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-6">
      {/* Reviews List */}
      <div className="space-y-4">
        {reviewsData.items.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      {/* Pagination */}
      {reviewsData.totalPages > 1 && (
        <Pagination
          pageCount={reviewsData.totalPages}
          currentPage={pageNo}
          onPageChange={setPageNo}
          className="user-ui-pagination"
        />
      )}
    </div>
  );
};

export default ReviewList;
