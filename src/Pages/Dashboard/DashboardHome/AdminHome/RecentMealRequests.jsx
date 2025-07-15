import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
import { useTheme } from "../../../../Hooks/useTheme";

const RecentMealRequests = () => {
  const axiosSecure = useAxiosSecure();
  const { isDark } = useTheme();

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ["recent-meal-requests"],
    queryFn: async () => {
      const res = await axiosSecure.get("/recent-meal-requests");
      return res.data;
    },
  });

  if (isLoading) {
    return <p className="text-center py-10">Loading recent requests...</p>;
  }

  return (
    <div className="bg-base-200 p-6 rounded-xl shadow mt-10">
      <h3 className="text-xl font-bold mb-4">📥 Recent Meal Requests</h3>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead className={isDark ? "bg-gray-800 text-gray-200" : "bg-gray-100"}>
            <tr>
              <th>Meal</th>
              <th>User</th>
              <th>Email</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req._id}>
                <td>{req.title || "N/A"}</td>
                <td>{req.userName || "Anonymous"}</td>
                <td>{req.userEmail}</td>
                <td>
                  <span
                    className={`badge ${
                      req.status === "delivered" ? "badge-success" : "badge-warning"
                    }`}
                  >
                    {req.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentMealRequests;
