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

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const ChartSection = () => {
  const axiosSecure = useAxiosSecure();
  const { isDark } = useTheme();

  const { data: stats = {}, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin-dashboard-stats");
      return res.data;
    },
  });

  if (isLoading) {
    return <p className="text-center py-10">Loading Charts...</p>;
  }

  const pieData = [
    { name: "Meals", value: stats.totalMeals },
    { name: "Users", value: stats.totalUsers },
    { name: "Reviews", value: stats.totalReviews },
    { name: "Served Meals", value: stats.totalServed },
  ];

  const barData = [
    {
      name: "Stats",
      Meals: stats.totalMeals,
      Users: stats.totalUsers,
      Reviews: stats.totalReviews,
      Served: stats.totalServed,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-10">
      {/* Pie Chart */}
      <div className="bg-base-200 p-6 rounded-xl shadow">
        <h3 className="text-xl font-bold text-center mb-4">
          Overview Pie Chart
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
              fill="#8884d8"
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
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart */}
      <div className="bg-base-200 p-6 rounded-xl shadow">
        <h3 className="text-xl font-bold text-center mb-4">Stats Bar Chart</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="Meals" fill="#8884d8" />
            <Bar dataKey="Users" fill="#82ca9d" />
            <Bar dataKey="Reviews" fill="#ffc658" />
            <Bar dataKey="Served" fill="#ff8042" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartSection;
