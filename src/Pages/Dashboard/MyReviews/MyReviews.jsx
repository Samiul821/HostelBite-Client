import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { FaHeart, FaEdit, FaTrash, FaEye } from "react-icons/fa";
import useAuth from "../../../Hooks/useAuth";
import { useTheme } from "../../../Hooks/useTheme";
import Swal from "sweetalert2";
import MealModal from "./MealModal";
import EditReviewModal from "./EditReviewModal";

const MyReviews = () => {
  const [reviews, setReviews] = useState([]);
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null);

  const openEditModal = (review) => {
    setEditingReview(review);
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditingReview(null);
  };

  const handleViewMeal = (id) => {
    axiosSecure.get(`/meals/${id}`).then((res) => {
      setSelectedMeal(res.data);
      setModalOpen(true);
    });
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedMeal(null);
  };

  useEffect(() => {
    if (!user?.email) return;
    axiosSecure.get(`/my-reviews?email=${user.email}`).then((res) => {
      setReviews(res.data);
    });
  }, [user?.email, axiosSecure]);

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This review will be deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/reviews/${id}`).then((res) => {
          if (res.data.deletedCount > 0) {
            setReviews((prev) => prev.filter((r) => r._id !== id));
            Swal.fire("Deleted!", "Your review has been deleted.", "success");
          }
        });
      }
    });
  };

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
            {reviews.map((review) => (
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
                  <FaHeart className="text-red-500" />{" "}
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
            ))}
            {reviews.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-500">
                  No reviews found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <MealModal
        isOpen={modalOpen}
        closeModal={closeModal}
        meal={selectedMeal}
      />
      <EditReviewModal
        isOpen={editModalOpen}
        reviewData={editingReview}
        onClose={closeEditModal}
        onUpdate={() => {
          // Re-fetch reviews
          axiosSecure.get(`/my-reviews?email=${user.email}`).then((res) => {
            setReviews(res.data);
          });
        }}
      />
    </div>
  );
};

export default MyReviews;
