import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { useTheme } from "../../../Hooks/useTheme";
import AdminMealChart from "./AdminMealChart";

const AdminProfile = () => {
  const axiosSecure = useAxiosSecure();
  const { isDark } = useTheme();

  const { data: admin = {}, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin-stats");
      return res.data;
    },
  });

  if (isLoading) {
    return <p className="text-center py-10">Loading admin info...</p>;
  }

  return (
    <div
      className={`p-6 min-h-screen ${isDark ? "text-white" : "text-gray-800"}`}
    >
      <div className="max-w-xl mx-auto bg-base-200 rounded-xl shadow p-6 flex flex-col items-center text-center">
        <img
          src={admin.image}
          alt="Admin"
          className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-indigo-500"
        />
        <h2 className="text-2xl font-bold mb-1">{admin.name}</h2>
        <p className="text-sm text-gray-400 mb-2">{admin.email}</p>
        <p className="text-sm font-medium mb-4 text-green-500 uppercase tracking-wide">
          Role: {admin.role}
        </p>
        <p className="text-lg font-semibold">
          Total Meals Added:{" "}
          <span className="text-indigo-600">{admin.mealsAdded}</span>
        </p>
      </div>

      {/* Chart Below */}
      <div className="max-w-3xl mx-auto mt-10">
        <AdminMealChart />
      </div>
    </div>
  );
};

export default AdminProfile;
