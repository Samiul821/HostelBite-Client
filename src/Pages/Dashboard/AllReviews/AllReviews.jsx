import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { FaEye, FaTrash } from "react-icons/fa";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { useTheme } from "../../../Hooks/useTheme";
import { Helmet } from "react-helmet-async";

const AllReviews = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { isDark } = useTheme();

  // TanStack Query to fetch all reviews
  const {
    data: reviewGroups = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["allReviews"],
    queryFn: async () => {
      const res = await axiosSecure.get("/all-reviews");
      return res.data;
    },
  });

  // Delete single review and invalidate cache
  const handleDelete = async (reviewId) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This review will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      background: isDark ? "#1f2937" : "#fff",
      color: isDark ? "#fff" : "#000",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await axiosSecure.delete(`/reviews/${reviewId}`);
        if (res.data.deletedCount > 0) {
          Swal.fire("Deleted!", "Review deleted successfully.", "success");
          queryClient.invalidateQueries({ queryKey: ["allReviews"] });
        }
      } catch (error) {
        console.error("Delete failed:", error);
        Swal.fire("Error", "Failed to delete review.", "error");
      }
    }
  };

  if (isLoading)
    return (
      <div className="text-center text-lg mt-20 animate-pulse">
        Loading reviews...
      </div>
    );

  if (isError)
    return (
      <div className="text-center text-red-500 mt-20">
        Error: {error.message || "Something went wrong!"}
      </div>
    );

  return (
    <div
      className={`p-6 min-h-screen transition-colors duration-300 ${
        isDark ? "text-white" : "text-gray-800"
      }`}
    >
      <Helmet>
        <title>HostelBite | All Reviews</title>
      </Helmet>

      <h2 className="text-3xl font-bold mb-6 text-center">All Reviews</h2>

      {reviewGroups.length === 0 ? (
        <p className="text-center text-gray-500">No reviews found.</p>
      ) : (
        <div className="overflow-x-auto shadow-lg rounded-lg">
          <table
            className={`table w-full border text-sm ${
              isDark ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <thead
              className={`uppercase ${
                isDark
                  ? "bg-gray-800 text-gray-300"
                  : "bg-gradient-to-r from-orange-100 to-pink-100 text-gray-800"
              }`}
            >
              <tr>
                <th className="p-4 text-left">Meal</th>
                <th className="p-4 text-left">Likes</th>
                <th className="p-4 text-left">Total Reviews</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviewGroups.map((group) => (
                <tr
                  key={group._id}
                  className={`transition hover:scale-[1.01] hover:shadow ${
                    isDark
                      ? "hover:bg-gray-800"
                      : "hover:bg-gradient-to-r from-pink-50 to-orange-50"
                  }`}
                >
                  <td className="p-4 font-semibold">{group.mealTitle}</td>
                  <td className="p-4">{group.likes || 0}</td>
                  <td className="p-4">{group.reviews_count}</td>
                  <td className="p-4 flex gap-3 items-center">
                    <Link
                      to={`/meals-details/${group._id}`}
                      className="text-green-500 hover:text-green-600"
                      title="View Meal"
                    >
                      <FaEye size={16} />
                    </Link>

                    {group.reviews?.length > 0 && (
                      <button
                        onClick={() => handleDelete(group.reviews[0]._id)}
                        className="text-red-500 hover:text-red-600"
                        title="Delete First Review"
                      >
                        <FaTrash size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllReviews;
