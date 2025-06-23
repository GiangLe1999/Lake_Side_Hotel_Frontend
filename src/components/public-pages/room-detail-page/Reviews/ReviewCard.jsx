import { Calendar, Mail, Star } from "lucide-react";
import formatDate from "../../../../utils/format-date";
import { maskEmail } from "../../../../utils/mask-email";

const ReviewCard = ({ review }) => {
  const getInitials = (name) => {
    return (
      name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase() || "U"
    );
  };

  return (
    <div className="bg-white border-b border-gray-100 pt-4 pb-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-gray-100 border border-gray-300 rounded-full flex items-center justify-center text-gray-700 font-semibold text-lg shadow-sm">
          {getInitials(review?.user?.fullName)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-semibold text-gray-900 text-base truncate flex items-center gap-2">
              <p className="mr-1">{review?.user?.fullName}</p>

              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < review?.rating
                      ? "text-amber-400 fill-current"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </h4>
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(review?.createdAt)}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
            <Mail className="w-4 h-4 text-blue-500" />
            <span className="truncate">{maskEmail(review?.user?.email)}</span>
          </div>
        </div>
      </div>

      {review?.title && (
        <div className="mt-4">
          <h5 className="font-medium text-gray-900 flex items-center gap-2 text-base">
            {review.title}
          </h5>
        </div>
      )}

      <p
        className="text-gray-600 leading-relaxed mt-2 text-sm"
        style={{ wordBreak: "break-all" }}
      >
        {review?.comment}
      </p>
    </div>
  );
};

export default ReviewCard;
