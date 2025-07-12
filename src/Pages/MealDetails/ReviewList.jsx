import { useEffect, useState } from "react";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { useTheme } from "../../Hooks/useTheme";

const ReviewList = ({ mealId }) => {
  const axiosSecure = useAxiosSecure();
  const [reviews, setReviews] = useState([]);
  const { isDark } = useTheme();

  useEffect(() => {
    axiosSecure
      .get(`/reviews/${mealId}`)
      .then((res) => setReviews(res.data))
      .catch((err) => console.error("Review fetch failed", err));
  }, [mealId, axiosSecure]);

  if (reviews.length === 0) {
    return (
      <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
        No reviews yet.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((r) => (
        <div
          key={r._id}
          className={`p-4 border rounded-lg transition duration-200 ${
            isDark
              ? "bg-gray-800 border-gray-700 text-gray-200"
              : "bg-white border-gray-200 text-gray-800"
          }`}
        >
          {/* User Info */}
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

          {/* Review Text */}
          <p className="text-sm leading-relaxed">{r.review}</p>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
