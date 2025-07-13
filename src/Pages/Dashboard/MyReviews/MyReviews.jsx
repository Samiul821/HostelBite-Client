import React, { useState } from "react";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { FaHeart, FaEdit, FaTrash, FaEye } from "react-icons/fa";
import useAuth from "../../../Hooks/useAuth";
import { useTheme } from "../../../Hooks/useTheme";
import Swal from "sweetalert2";
import MealModal from "./MealModal";
import EditReviewModal from "./EditReviewModal";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const MyReviews = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const { isDark } = useTheme();
  const queryClient = useQueryClient();

  const [selectedMeal, setSelectedMeal] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null);

  // ✅ Fetch reviews using TanStack Query
  const {
    data: reviews = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["myReviews", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/my-reviews?email=${user.email}`);
      return res.data;
    },
  });

  const openEditModal = (review) => {
    setEditingReview(review);
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditingReview(null);
  };

  const handleViewMeal = async (id) => {
    try {
      const res = await axiosSecure.get(`/meals/${id}`);
      setSelectedMeal(res.data);
      setModalOpen(true);
    } catch (err) {
      console.error("Failed to fetch meal:", err);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedMeal(null);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This review will be deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await axiosSecure.delete(`/reviews/${id}`);
        if (res.data?.deletedCount > 0) {
          Swal.fire("Deleted!", "Your review has been deleted.", "success");
          queryClient.invalidateQueries({
            queryKey: ["myReviews", user?.email],
          });
        } else {
          Swal.fire("Failed!", "Review not found or already deleted.", "error");
        }
      } catch (err) {
        console.error(err);
        Swal.fire("Error!", "Something went wrong!", "error");
      }
    }
  };

  const handleReviewUpdate = () => {
    queryClient.invalidateQueries({ queryKey: ["myReviews", user?.email] });
  };

  if (isLoading) {
    return <p className="text-center mt-10 text-lg">Loading your reviews...</p>;
  }

  if (isError) {
    return (
      <p className="text-center mt-10 text-red-500">
        Error: {error.message || "Failed to load reviews"}
      </p>
    );
  }

  return (
    <div
      className={`p-4 min-h-screen ${isDark ? " text-white" : "text-gray-800"}`}
    >
      <h2 className="text-3xl font-bold mb-6 text-center">My Reviews</h2>

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
              <th className="p-4 text-left">Review</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <tr
                  key={review._id}
                  className={`transition-all duration-200 hover:scale-[1.01] hover:shadow-lg ${
                    isDark
                      ? "hover:bg-gray-800"
                      : "hover:bg-gradient-to-r hover:from-pink-50 hover:to-orange-50"
                  }`}
                >
                  <td className="p-4 font-semibold">
                    {review.mealDetails?.title}
                  </td>
                  <td className="p-4 flex items-center gap-1">
                    <FaHeart className="text-red-500" />
                    {review.mealDetails?.likes || 0}
                  </td>
                  <td className="p-4">{review.review}</td>
                  <td className="p-4 flex gap-4 text-lg">
                    <button
                      onClick={() => openEditModal(review)}
                      title="Edit"
                      className="text-blue-500"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(review._id)}
                      title="Delete"
                      className="text-red-500 hover:text-red-600 transition"
                    >
                      <FaTrash />
                    </button>
                    <button
                      onClick={() => handleViewMeal(review.mealId)}
                      title="View Meal"
                      className="text-green-500 hover:text-green-600 transition"
                    >
                      <FaEye />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-500">
                  No reviews found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Meal View Modal */}
      <MealModal
        isOpen={modalOpen}
        closeModal={closeModal}
        meal={selectedMeal}
      />

      {/* Edit Review Modal */}
      <EditReviewModal
        isOpen={editModalOpen}
        reviewData={editingReview}
        onClose={closeEditModal}
        onUpdate={handleReviewUpdate}
      />
    </div>
  );
};

export default MyReviews;
