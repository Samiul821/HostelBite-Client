import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { useTheme } from "../../../Hooks/useTheme";
import toast from "react-hot-toast";

// Debounce function
function debounce(func, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
}

const ServeMeals = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 8; // Number of items per page

  const axiosSecure = useAxiosSecure();
  const { isDark } = useTheme();
  const queryClient = useQueryClient();

  // Debounce search input
  const debounceSearchValue = useMemo(
    () =>
      debounce((val) => {
        setDebouncedSearch(val);
        setPage(1); // Reset to page 1 on new search
      }, 500),
    []
  );

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearch(val);
    debounceSearchValue(val);
  };

  // Fetch requested meals with pagination and search
  const { data, isLoading } = useQuery({
    queryKey: ["serve-meals", debouncedSearch, page],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/serve-meals?search=${debouncedSearch}&page=${page}&limit=${limit}`
      );
      return res.data; // expected to return { meals: [...], total: number }
    },
    keepPreviousData: true, // keeps previous data while loading new page
  });

  const requests = data?.meals || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / limit);

  // Serve Meal Mutation
  const { mutate: serveMeal } = useMutation({
    mutationFn: async (id) => {
      return await axiosSecure.patch(`/requested-meals/${id}`, {
        status: "delivered",
      });
    },
    onSuccess: () => {
      toast.success("Meal served successfully!");
      queryClient.invalidateQueries(["serve-meals"]);
    },
    onError: () => {
      toast.error("Failed to serve meal");
    },
  });

  return (
    <div className={`p-6 min-h-screen ${isDark ? "text-white" : "text-gray-800"}`}>
      <h2 className="text-3xl font-bold mb-6 text-center">Serve Requested Meals</h2>

      {/* Search Bar */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search by name or email"
          className="input input-bordered w-full max-w-md"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow rounded-lg">
        <table className="table w-full">
          <thead className={isDark ? "bg-gray-800 text-gray-300" : "bg-base-200"}>
            <tr>
              <th>Meal</th>
              <th>User Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Serve</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="5" className="text-center py-8">
                  Loading...
                </td>
              </tr>
            ) : requests.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-8 text-gray-500">
                  No meal requests found.
                </td>
              </tr>
            ) : (
              requests.map((req) => (
                <tr key={req._id}>
                  <td>{req.mealTitle}</td>
                  <td>{req.userName}</td>
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
                  <td>
                    <button
                      onClick={() => serveMeal(req._id)}
                      disabled={req.status === "delivered"}
                      className={`btn btn-sm ${
                        req.status === "delivered" ? "btn-disabled" : "btn-primary"
                      }`}
                    >
                      Serve
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center gap-3 mt-6">
        <button
          disabled={page === 1 || isLoading}
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          className="btn btn-outline"
        >
          Prev
        </button>
        <span className="flex items-center">
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page === totalPages || isLoading}
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          className="btn btn-outline"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ServeMeals;
