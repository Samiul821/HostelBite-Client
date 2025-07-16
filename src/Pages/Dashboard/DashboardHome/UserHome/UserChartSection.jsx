import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
import { useTheme } from "../../../../Hooks/useTheme";

const COLORS = ["#6366f1", "#10b981", "#facc15"];

const UserChartSection = () => {
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
    return <p className="text-center py-10">Loading Charts...</p>;
  }

  const pieData = [
    { name: "Meal Requests", value: user.totalRequests },
    { name: "Delivered", value: user.deliveredMeals },
    { name: "Liked Meals", value: user.likedMeals },
  ];

  const barData = [
    {
      name: "You",
      Requests: user.totalRequests,
      Delivered: user.deliveredMeals,
      Liked: user.likedMeals,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-10">
      {/* Pie Chart */}
      <div
        className={`p-6 rounded-xl shadow ${
          isDark ? "bg-gray-800 text-white" : "bg-base-200"
        }`}
      >
        <h3 className="text-xl font-bold text-center mb-4">
          Your Meal Overview
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart */}
      <div
        className={`p-6 rounded-xl shadow ${
          isDark ? "bg-gray-800 text-white" : "bg-base-200"
        }`}
      >
        <h3 className="text-xl font-bold text-center mb-4">Your Meal Stats</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="Requests" fill="#6366f1" />
            <Bar dataKey="Delivered" fill="#10b981" />
            <Bar dataKey="Liked" fill="#facc15" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default UserChartSection;
