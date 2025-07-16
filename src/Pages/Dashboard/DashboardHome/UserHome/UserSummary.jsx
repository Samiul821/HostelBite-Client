import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
import { useTheme } from "../../../../Hooks/useTheme";
import { FaConciergeBell, FaCheckCircle, FaHeart } from "react-icons/fa";

const UserSummary = () => {
  const axiosSecure = useAxiosSecure();
  const { isDark } = useTheme();

  const { data: user = {}, isLoading } = useQuery({
    queryKey: ["user-summary"],
    queryFn: async () => {
      const res = await axiosSecure.get("/user-summary");
      return res.data;
    },
  });

  if (isLoading) {
    return <p className="text-center py-10">Loading profile...</p>;
  }

  const cards = [
    {
      title: "Meal Requests",
      value: user.totalRequests,
      icon: <FaConciergeBell className="text-3xl text-indigo-500" />,
    },
    {
      title: "Delivered Meals",
      value: user.deliveredMeals,
      icon: <FaCheckCircle className="text-3xl text-green-500" />,
    },
    {
      title: "Liked Meals",
      value: user.likedMeals,
      icon: <FaHeart className="text-3xl text-red-500" />,
    },
  ];

  return (
    <div className={`  ${isDark ? "text-white" : "text-gray-800"}`}>
      <h2 className="text-3xl font-bold text-center mb-8">Your Meal Summary</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {cards.map((card, i) => (
          <div
            key={i}
            className={`rounded-xl p-6 shadow-md flex items-center gap-5 hover:shadow-xl transition-all duration-300 ${
              isDark ? "bg-gray-800 text-white" : "bg-white text-gray-800"
            }`}
          >
            <div>{card.icon}</div>
            <div>
              <h4 className="text-lg font-medium">{card.title}</h4>
              <p className="text-2xl font-bold">{card.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserSummary;
