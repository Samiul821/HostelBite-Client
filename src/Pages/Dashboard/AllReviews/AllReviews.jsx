import React from "react";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { FaEye, FaTrash } from "react-icons/fa";
import { useTheme } from "../../../Hooks/useTheme";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const AllReviews = () => {
  const axiosSecure = useAxiosSecure();
  const { isDark } = useTheme();
  const queryClient = useQueryClient();

  // Fetch all reviews with meal info
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

  // Delete handler with query invalidation
  const handleDelete = async (reviewId) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This review will be deleted permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await axiosSecure.delete(`/reviews/${reviewId}`);
        if (res.data.deletedCount > 0) {
          Swal.fire("Deleted!", "Review deleted successfully.", "success");
          queryClient.invalidateQueries(["allReviews"]); // refetch
        }
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to delete review.", "error");
      }
    }
  };

  if (isLoading) {
    return <p className="text-center text-lg mt-20">Loading reviews...</p>;
  }

  if (isError) {
    return (
      <p className="text-center text-red-500 mt-20">
        Error: {error?.message || "Something went wrong"}
      </p>
    );
  }

  return (
    <div
      className={`p-6 min-h-screen ${isDark ? "text-white" : "text-gray-800"}`}
    >
      <h2 className="text-3xl font-bold mb-6 text-center">All Reviews</h2>

      {reviewGroups.length === 0 ? (
        <p className="text-center text-gray-500">No reviews found.</p>
      ) : (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table
            className={`table w-full border ${
              isDark ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <thead
              className={`text-sm uppercase ${
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
                  className={`transition-all hover:scale-[1.01] hover:shadow ${
                    isDark
                      ? "hover:bg-gray-800"
                      : "hover:bg-gradient-to-r from-pink-50 to-orange-50"
                  }`}
                >
                  <td className="p-4 font-semibold">{group.mealTitle}</td>
                  <td className="p-4">{group.likes || 0}</td>
                  <td className="p-4">{group.reviews_count}</td>
                  <td className="p-4 flex gap-3">
                    <Link
                      to={`/meals-details/${group._id}`}
                      className="text-green-500"
                      title="View Meal"
                    >
                      <FaEye />
                    </Link>

                    <button
                      className="text-red-500"
                      title="Delete First Review"
                      onClick={() => handleDelete(group.reviews[0]._id)}
                    >
                      <FaTrash />
                    </button>
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
