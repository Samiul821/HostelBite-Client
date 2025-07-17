import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { useTheme } from "../../Hooks/useTheme";

const ReviewList = ({ mealId }) => {
  const axiosSecure = useAxiosSecure();
  const { isDark } = useTheme();
  const [showAll, setShowAll] = useState(false); // 🔄 Toggle state

  const {
    data: reviews = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["reviews", mealId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/reviews/${mealId}`);
      return res.data;
    },
    enabled: !!mealId,
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
        Loading reviews...
      </p>
    );
  }

  if (isError) {
    return (
      <p className="text-sm text-red-500">
        Error: {error.message || "Failed to load reviews"}
      </p>
    );
  }

  if (reviews.length === 0) {
    return (
      <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
        No reviews yet.
      </p>
    );
  }

  const visibleReviews = showAll ? reviews : reviews.slice(0, 1); // 🔄 Only 1 if not showAll

  return (
    <div className="space-y-4">
      {visibleReviews.map((r) => (
        <div
          key={r._id}
          className={`p-4 border rounded-lg transition duration-200 ${
            isDark
              ? "bg-gray-800 border-gray-700 text-gray-200"
              : "bg-white border-gray-200 text-gray-800"
          }`}
        >
          <div className="flex items-center gap-3 mb-2">
            <img
              src={r.userImage}
              alt={r.userName}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold text-sm">{r.userName}</p>
              <p
                className={`text-xs ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {new Date(r.createdAt).toLocaleString()}
              </p>
            </div>
          </div>

          <p className="text-sm leading-relaxed">{r.review}</p>
        </div>
      ))}

      {/* 🔘 Show More / Show Less Button */}
      {reviews.length > 1 && (
        <div className="text-center mt-4">
          <button
            onClick={() => setShowAll(!showAll)}
            className="btn btn-sm btn-outline"
          >
            {showAll ? "Show Less" : "Show More"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewList;
