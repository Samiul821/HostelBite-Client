import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { useTheme } from "../../../Hooks/useTheme";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

const UpcomingMeals = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { isDark } = useTheme();

  // Fetch upcoming meals sorted by likes DESC
  const { data: meals = [], isLoading } = useQuery({
    queryKey: ["upcoming-meals"],
    queryFn: async () => {
      const res = await axiosSecure.get("/upcoming-meals");
      return res.data.sort((a, b) => b.likes - a.likes);
    },
  });

  // Publish meal mutation
  const publishMutation = useMutation({
    mutationFn: (id) => axiosSecure.post(`/publish-meal/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["upcoming-meals"]);
      Swal.fire({
        icon: "success",
        title: "Meal published!",
        timer: 1500,
        showConfirmButton: false,
      });
    },
    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: "Failed to publish meal",
        text: error.response?.data?.message || error.message || "Server error",
      });
    },
  });

  return (
    <div
      className={`p-6 rounded-lg shadow-md ${
        isDark ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      } max-w-7xl mx-auto`}
    >
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight mb-4 md:mb-0">
          Upcoming Meals
        </h1>
        <Link
          to="/dashboard/add-upcoming-meal"
          className="inline-block px-6 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition"
        >
          Add Upcoming Meal
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <svg
            className="animate-spin h-8 w-8 text-indigo-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            ></path>
          </svg>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-300 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead
              className={`${
                isDark ? "bg-gray-800" : "bg-indigo-50"
              } text-indigo-900`}
            >
              <tr>
                {["Title", "Likes", "Category", "Price", "Actions"].map(
                  (header) => (
                    <th
                      key={header}
                      scope="col"
                      className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody
              className={`divide-y divide-gray-200 ${
                isDark ? "bg-gray-700 text-white" : "bg-white"
              }`}
            >
              {meals.map((meal) => (
                <tr
                  key={meal._id}
                  className="hover:bg-indigo-100 dark:hover:bg-indigo-700 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {meal.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {meal.likes}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {meal.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                    ৳{meal.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      disabled={publishMutation.isLoading || meal.likes < 10}
                      title={
                        meal.likes < 10
                          ? "Minimum 10 likes required to publish"
                          : ""
                      }
                      onClick={() => publishMutation.mutate(meal._id)}
                      className={`inline-flex items-center px-3 py-1 rounded-md text-white font-semibold transition ${
                        publishMutation.isLoading
                          ? "bg-gray-400 cursor-not-allowed"
                          : meal.likes < 10
                          ? "bg-gray-500 cursor-not-allowed"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      {publishMutation.isLoading ? "Publishing..." : "Publish"}
                    </button>
                  </td>
                </tr>
              ))}
              {meals.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center text-gray-500 italic"
                  >
                    No upcoming meals found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UpcomingMeals;
