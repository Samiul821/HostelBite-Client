import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { FaHeart } from "react-icons/fa";
import useAuth from "../../../Hooks/useAuth";
import { useTheme } from "../../../Hooks/useTheme";
import Swal from "sweetalert2";
import { Helmet } from "react-helmet-async";

const ITEMS_PER_PAGE = 10;

const RequestedMeals = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const { isDark } = useTheme();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: requestedMeals = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["requestedMeals", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/requested-meals?email=${user.email}`);
      return res.data;
    },
  });

  const handleCancel = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You want to cancel this requested meal!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, cancel it!",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await axiosSecure.delete(`/requested-meals/${id}`);
        if (res.data.deletedCount > 0) {
          Swal.fire(
            "Cancelled!",
            "Your requested meal has been cancelled.",
            "success"
          );
          queryClient.invalidateQueries(["requestedMeals", user?.email]);
        } else {
          Swal.fire("Error!", "Failed to cancel the requested meal.", "error");
        }
      } catch (error) {
        Swal.fire("Error!", "Something went wrong.", "error");
      }
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(requestedMeals.length / ITEMS_PER_PAGE);
  const paginatedMeals = requestedMeals.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const changePage = (page) => {
    setCurrentPage(page);
  };

  // UI
  if (isLoading)
    return (
      <p className="text-center mt-10 text-lg">Loading requested meals...</p>
    );
  if (isError)
    return (
      <p className="text-center text-red-500 mt-10">Error: {error.message}</p>
    );

  return (
    <div
      className={`p-4 ${
        isDark ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"
      }`}
    >
      <Helmet>
        <title>HostelBite | Requested Meals</title>
      </Helmet>

      <h2 className="text-2xl font-semibold mb-4">Requested Meals</h2>
      <div className="overflow-x-auto">
        <table
          className={`table w-full border ${
            isDark ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <thead
            className={isDark ? "bg-gray-800 text-gray-200" : "bg-gray-100"}
          >
            <tr>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Likes</th>
              <th className="p-3 text-left">Reviews</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedMeals.length > 0 ? (
              paginatedMeals.map((meal) => (
                <tr
                  key={meal._id}
                  className={`hover:${isDark ? "bg-gray-700" : "bg-gray-50"}`}
                >
                  <td className="p-3">
                    {meal.mealDetails?.title || "No title"}
                  </td>
                  <td className="p-3 flex items-center gap-1">
                    <FaHeart className="text-red-500" />{" "}
                    {meal.mealDetails?.likes || 0}
                  </td>
                  <td className="p-3">
                    {meal.mealDetails?.reviews_count || 0}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        meal.status === "pending"
                          ? "bg-yellow-100 text-yellow-600"
                          : meal.status === "approved"
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {meal.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => handleCancel(meal._id)}
                      className={`hover:underline ${
                        isDark ? "text-red-400" : "text-red-600"
                      }`}
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className={`text-center py-4 ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  No requested meals found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* ✅ Pagination Footer */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6 gap-2">
            {[...Array(totalPages).keys()].map((num) => (
              <button
                key={num}
                onClick={() => changePage(num + 1)}
                className={`px-3 py-1 rounded-md border text-sm ${
                  currentPage === num + 1
                    ? "bg-green-600 text-white"
                    : isDark
                    ? "bg-gray-800 text-gray-300 border-gray-600"
                    : "bg-white text-gray-700 border-gray-300"
                }`}
              >
                {num + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestedMeals;
