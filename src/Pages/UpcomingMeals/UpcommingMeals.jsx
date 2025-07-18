import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";
import useAuth from "../../Hooks/useAuth";
import LoadingSpinner from "../Shared/LoadingSpinner/LoadingSpinner";
import { Helmet } from "react-helmet-async";

const UpcommingMeals = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // ✅ GET all upcoming meals
  const { data: meals = [], isLoading } = useQuery({
    queryKey: ["upcoming-meals"],
    queryFn: async () => {
      const res = await axiosSecure.get("/upcoming-meals");
      return res.data;
    },
  });

  const { data: userPackage } = useQuery({
    queryKey: ["userPackage", user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const res = await axiosSecure.get(`/user/package?email=${user.email}`);
      return res.data.badge;
    },
    enabled: !!user?.email,
    refetchOnWindowFocus: false,
  });

  // Like mutation (with auto publish alert)
  const likeMutation = useMutation({
    mutationFn: async (mealId) => {
      const res = await axiosSecure.patch(`/upcoming-meals/like/${mealId}`, {
        userEmail: user.email,
      });
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["upcoming-meals"]);
      if (data.published) {
        Swal.fire(
          "Published!",
          "This meal got 10 likes and is now published!",
          "success"
        );
      } else {
        Swal.fire("Liked!", "You liked this meal ❤️", "success");
      }
    },
    onError: (error) => {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Something went wrong",
        "error"
      );
    },
  });

  const handleLike = (meal) => {
    if (!userPackage) {
      return Swal.fire(
        "Access Denied",
        "Only premium users can like meals",
        "error"
      );
    }
    likeMutation.mutate(meal._id);
  };

  if (isLoading) return <LoadingSpinner />;

  if (!meals || meals.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500 text-xl font-medium">
        No upcoming meals found 😔
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Helmet>
        <title>Upcoming Meals - HostelBite</title>
      </Helmet>

      {meals.map((meal) => (
        <div
          key={meal._id}
          className="bg-base-200 shadow-md rounded-xl p-4 border hover:shadow-lg transition"
        >
          <img
            src={meal.image}
            alt={meal.title}
            className="w-full h-60 object-cover rounded-md mb-4"
          />
          <h2 className="text-xl font-bold mb-1">{meal.title}</h2>
          <p className="text-sm text-gray-500 mb-2">{meal.category}</p>
          <p className="text-sm mb-2">
            <span className="font-medium">Ingredients:</span> {meal.ingredients}
          </p>
          <p className="text-sm mb-2">
            <span className="font-medium">Distributor:</span>{" "}
            {meal.distributor_name}
          </p>
          <p className="font-bold text-indigo-500 mb-2">৳{meal.price}</p>

          <button
            onClick={() => handleLike(meal)}
            disabled={!userPackage}
            className={`btn btn-outline btn-sm ${
              !userPackage ? "cursor-not-allowed opacity-50" : ""
            }`}
          >
            ❤️ {meal.likes || 0}
          </button>
        </div>
      ))}
    </div>
  );
};

export default UpcommingMeals;
