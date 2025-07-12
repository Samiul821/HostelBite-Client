import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import useAuth from "../../Hooks/useAuth";
import toast from "react-hot-toast";
import { FaStar, FaHeart } from "react-icons/fa";
import { useTheme } from "../../Hooks/useTheme";
import { motion } from "framer-motion";
import ReviewForm from "./ReviewForm";
import ReviewList from "./ReviewList";

const MealDetails = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const { isDark } = useTheme();

  const [meal, setMeal] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userPackage, setUserPackage] = useState(null);
  const [requested, setRequested] = useState(false);

  // Fetch Meal
  useEffect(() => {
    axiosSecure
      .get(`/meals/${id}`)
      .then((res) => {
        setMeal(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load meal");
        setLoading(false);
      });
  }, [id, refresh, axiosSecure]);

  // Fetch user package
  useEffect(() => {
    if (user?.email) {
      axiosSecure
        .get(`/user/package?email=${user.email}`)
        .then((res) => setUserPackage(res.data.badge))
        .catch((err) => console.error(err));
    }
  }, [user, axiosSecure]);

  // Like Handler
  const handleLike = () => {
    if (!user) return toast.error("Login required to like");
    axiosSecure
      .patch(`/meals/${id}/like`)
      .then(() => {
        toast.success("Thanks for your like!");
        setRefresh(!refresh);
      })
      .catch(() => toast.error("Failed to like"));
  };

  // Request Handler
  const handleRequest = () => {
    if (!user) return toast.error("Login required to request");

    const requestData = {
      userEmail: user.email,
      mealId: id,
      status: "pending",
      requestedAt: new Date(),
    };

    axiosSecure
      .post("/meal-requests", requestData)
      .then(() => {
        toast.success("Meal requested!");
        setRequested(true); // <-- একবার রিকোয়েস্ট সফল হলে true করে দিবে
      })
      .catch(() => toast.error("Request failed"));
  };

  if (loading) return <p className="text-center">Loading...</p>;
  if (!meal) return <p className="text-center">Meal not found.</p>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`max-w-4xl mx-auto p-6 rounded-xl transition-colors duration-300 ${
        isDark ? "bg-gray-900 text-white" : "bg-white text-gray-800"
      }`}
    >
      {/* Meal Banner */}
      <div className="relative">
        <img
          src={meal.image}
          alt={meal.title}
          className="rounded-lg w-full h-80 object-cover"
        />
        <button
          onClick={handleLike}
          className={`absolute top-4 right-4 p-2 rounded-full shadow ${
            isDark ? "bg-gray-800" : "bg-white"
          }`}
          title="Like"
        >
          <FaHeart className="text-pink-500 text-xl" />
        </button>
      </div>

      {/* Info Section */}
      <div className="mt-6 space-y-3">
        <h2 className="text-3xl font-bold">{meal.title}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Posted on {new Date(meal.post_time).toLocaleDateString()}
        </p>
        <p className="text-lg">{meal.description}</p>

        <div className="text-sm">
          <strong>Ingredients:</strong> {meal.ingredients}
        </div>

        <div className="flex items-center gap-4 mt-4">
          <div>
            <strong>Distributor:</strong> <span>{meal.distributor_name}</span>
          </div>
          <div>
            <strong>Email:</strong> <span>{meal.distributor_email}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <span className="flex items-center gap-1 text-lg text-yellow-500">
            <FaStar /> {meal.rating || 0}
          </span>
          <span className="text-xl font-semibold text-indigo-600 dark:text-indigo-400">
            ৳ {meal.price}
          </span>
        </div>

        <button
          onClick={handleRequest}
          disabled={!userPackage || requested} // requested true হলে disabled হবে
          className={`btn btn-sm mt-3 ${
            userPackage && !requested
              ? "btn-primary"
              : "btn-disabled opacity-60 cursor-not-allowed"
          }`}
        >
          {!userPackage
            ? "Subscription Required"
            : requested
            ? "Request Sent"
            : "Request Meal"}
        </button>

        {!userPackage && (
          <p className="text-xs text-red-400 mt-1">
            * You need a membership to request this meal.
          </p>
        )}
      </div>

      {/* Review Section */}
      <div className="mt-10">
        <h3 className="text-2xl font-semibold mb-4">
          Reviews ({meal.reviews_count})
        </h3>
        <ReviewForm mealId={id} onReviewSubmit={() => setRefresh(!refresh)} />
        <ReviewList mealId={id} />
      </div>
    </motion.div>
  );
};

export default MealDetails;
