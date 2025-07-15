import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
import { useTheme } from "../../../../Hooks/useTheme";
import { FaUtensils, FaUsers, FaStar, FaCheckCircle } from "react-icons/fa";

const StatisticsCards = () => {
  const axiosSecure = useAxiosSecure();
  const { isDark } = useTheme();

  const { data: stats = {}, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin-dashboard-stats");
      return res.data;
    },
  });

  if (isLoading) {
    return <p className="text-center py-10">Loading statistics...</p>;
  }

  const cards = [
    {
      title: "Total Meals",
      value: stats.totalMeals,
      icon: <FaUtensils className="text-3xl text-indigo-500" />,
    },
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: <FaUsers className="text-3xl text-green-500" />,
    },
    {
      title: "Total Reviews",
      value: stats.totalReviews,
      icon: <FaStar className="text-3xl text-yellow-500" />,
    },
    {
      title: "Meals Served",
      value: stats.totalServed,
      icon: <FaCheckCircle className="text-3xl text-blue-500" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
      {cards.map((card, i) => (
        <div
          key={i}
          className={`rounded-lg p-6 shadow-md flex items-center gap-4 transition hover:shadow-xl ${
            isDark ? "bg-gray-800 text-white" : "bg-white text-gray-800"
          }`}
        >
          <div>{card.icon}</div>
          <div>
            <h4 className="text-lg font-semibold">{card.title}</h4>
            <p className="text-2xl font-bold">{card.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatisticsCards;
