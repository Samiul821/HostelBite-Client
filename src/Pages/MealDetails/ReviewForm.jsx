import { useForm } from "react-hook-form";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import toast from "react-hot-toast";
import { useTheme } from "../../Hooks/useTheme";

const ReviewForm = ({ mealId, onReviewSubmit }) => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { isDark } = useTheme();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    if (!user) return toast.error("Login required to post a review");

    const reviewData = {
      mealId,
      userEmail: user.email,
      userName: user.displayName,
      userImage: user.photoURL,
      review: data.review,
      createdAt: new Date(),
    };

    try {
      await axiosSecure.post("/reviews", reviewData);
      toast.success("Review posted!");
      reset();
      onReviewSubmit(); // trigger refresh in parent
    } catch (err) {
      console.error(err);
      toast.error("Failed to post review");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mb-6">
      <textarea
        {...register("review", { required: "Review is required" })}
        className={`textarea w-full min-h-[100px] transition duration-300 ${
          isDark
            ? "textarea-bordered bg-gray-800 text-white border-gray-600 placeholder-gray-400"
            : "textarea-bordered bg-white text-gray-800"
        }`}
        placeholder="Write your review..."
      />
      {errors.review && (
        <p className="text-red-500 text-sm mt-1">{errors.review.message}</p>
      )}

      <div className="text-right mt-2">
        <button
          type="submit"
          className={`btn btn-sm ${isDark ? "btn-accent" : "btn-primary"}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Posting..." : "Post Review"}
        </button>
      </div>
    </form>
  );
};

export default ReviewForm;
