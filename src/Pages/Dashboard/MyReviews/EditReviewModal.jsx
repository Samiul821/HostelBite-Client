import { useForm } from "react-hook-form";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { FaTimes } from "react-icons/fa";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { useTheme } from "../../../Hooks/useTheme";

const EditReviewModal = ({ isOpen, onClose, reviewData, onUpdate }) => {
  const axiosSecure = useAxiosSecure();
  const { isDark } = useTheme();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    if (reviewData) {
      reset({ review: reviewData.review });
    }
  }, [reviewData, reset]);

  const onSubmit = async (data) => {
    try {
      const res = await axiosSecure.patch(`/reviews/${reviewData._id}`, {
        review: data.review,
      });

      if (res.data.modifiedCount > 0) {
        toast.success("Review updated!");
        onUpdate(); // Refresh review list
        onClose(); // Close modal
      } else {
        toast.error("Nothing changed!");
      }
    } catch (err) {
      toast.error("Update failed!");
      console.error(err);
    }
  };

  if (!isOpen || !reviewData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        className={`rounded-lg w-full max-w-md mx-auto p-6 relative shadow-xl ${
          isDark
            ? "bg-gradient-to-br from-gray-900 to-gray-800 text-white"
            : "bg-gradient-to-br from-white to-pink-50 text-gray-900"
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-lg text-gray-400 hover:text-red-500"
        >
          <FaTimes />
        </button>

        <h2 className="text-xl font-semibold mb-4">Edit Your Review</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <textarea
            {...register("review", { required: "Review is required" })}
            className="textarea textarea-bordered w-full min-h-[100px] mb-2"
          ></textarea>
          {errors.review && (
            <p className="text-sm text-red-500">{errors.review.message}</p>
          )}

          <div className="text-right">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-sm btn-primary"
            >
              {isSubmitting ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditReviewModal;
