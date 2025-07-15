import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const AdminMealChart = () => {
  const axiosSecure = useAxiosSecure();

  const { data: stats = [], isLoading } = useQuery({
    queryKey: ["admin-meal-stats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin-meal-stats");
      return res.data;
    },
  });

  const labels = stats.map((item) => item._id);
  const counts = stats.map((item) => item.count);

  const data = {
    labels,
    datasets: [
      {
        label: "Meals Added",
        data: counts,
        backgroundColor: "rgba(99, 102, 241, 0.8)", // indigo-500
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  if (isLoading) return <p className="text-center mt-6">Loading chart...</p>;

  return (
    <div className="mt-10">
      <h3 className="text-xl font-semibold text-center mb-4">
        Meals Added by Category
      </h3>
      <Bar data={data} options={options} />
    </div>
  );
};

export default AdminMealChart;
