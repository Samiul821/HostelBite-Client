import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { FaHeart, FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import MealDetailsModal from "./MealDetailsModal ";

import { useTheme } from "../../../Hooks/useTheme";
import { Helmet } from "react-helmet-async";

const AllMeals = () => {
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("");
  const [order, setOrder] = useState("desc");
  const limit = 10;

  const { isDark } = useTheme();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);

  const handleViewMeal = (meal) => {
    setSelectedMeal(meal);
    setIsModalOpen(true);
  };

  // Fetch meals query
  const { data, isLoading, isError } = useQuery({
    queryKey: ["all-meals", page, sortBy, order],
    queryFn: async () => {
      let url = `/all-meals?page=${page}&limit=${limit}`;
      if (sortBy) url += `&sortBy=${sortBy}&order=${order}`;
      const res = await axiosSecure.get(url);
      return res.data;
    },
    keepPreviousData: true,
  });

  // Delete meal mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => axiosSecure.delete(`/meals/${id}`),
    onSuccess: (_id, id) => {
      Swal.fire("Deleted!", "Meal has been deleted.", "success");
      // Refetch meals after delete
      queryClient.invalidateQueries(["all-meals"]);
    },
    onError: () => {
      Swal.fire("Error!", "Failed to delete meal.", "error");
    },
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Meal will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id);
      }
    });
  };

  // Sorting toggle
  const handleSortChange = (field) => {
    if (sortBy === field) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setOrder("desc");
    }
  };

  // Calculate total pages safely
  const totalMeals = data?.total || 0;
  const meals = data?.meals || [];
  const totalPages = Math.ceil(totalMeals / limit);

  return (
    <div className={`p-4 ${isDark ? " text-white" : " text-gray-900"}`}>
   
      <Helmet>
        <title>HostelBite | All Meals</title>
      </Helmet>

      <h2 className="text-2xl font-semibold mb-4">All Meals</h2>

      <div className="mb-4 flex gap-4">
        <button
          onClick={() => handleSortChange("likes")}
          className={`px-4 py-2 rounded border ${
            sortBy === "likes"
              ? isDark
                ? "bg-blue-700 text-white"
                : "bg-blue-600 text-white"
              : isDark
              ? "bg-gray-700 text-gray-300"
              : "bg-gray-200 text-gray-700"
          }`}
          disabled={isLoading}
        >
          Sort by Likes{" "}
          {sortBy === "likes" ? (order === "asc" ? "↑" : "↓") : ""}
        </button>
        <button
          onClick={() => handleSortChange("reviews_count")}
          className={`px-4 py-2 rounded border ${
            sortBy === "reviews_count"
              ? isDark
                ? "bg-blue-700 text-white"
                : "bg-blue-600 text-white"
              : isDark
              ? "bg-gray-700 text-gray-300"
              : "bg-gray-200 text-gray-700"
          }`}
          disabled={isLoading}
        >
          Sort by Reviews{" "}
          {sortBy === "reviews_count" ? (order === "asc" ? "↑" : "↓") : ""}
        </button>
      </div>

      {isLoading ? (
        <p className="text-center">Loading meals...</p>
      ) : isError ? (
        <p className="text-center text-red-500">Failed to load meals.</p>
      ) : meals.length === 0 ? (
        <p className="text-center p-4">No meals found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table
            className={`table w-full border ${
              isDark ? "border-gray-600" : "border-gray-300"
            }`}
          >
            <thead
              className={
                isDark ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-900"
              }
            >
              <tr>
                <th className="p-2 text-left">Title</th>
                <th className="p-2 text-left">Likes</th>
                <th className="p-2 text-left">Reviews Count</th>
                <th className="p-2 text-left">Rating</th>
                <th className="p-2 text-left">Distributor</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody
              className={
                isDark ? "bg-gray-700 text-gray-200" : "bg-white text-gray-900"
              }
            >
              {meals.map((meal) => (
                <tr
                  key={meal._id}
                  className={isDark ? "hover:bg-gray-600" : "hover:bg-gray-50"}
                >
                  <td className="p-2">{meal.title}</td>
                  <td className="p-2 flex items-center gap-1">
                    <FaHeart className="text-red-500" /> {meal.likes || 0}
                  </td>
                  <td className="p-2">{meal.reviews_count || 0}</td>
                  <td className="p-2">{meal.rating || 0}</td>
                  <td className="p-2">{meal.distributor_name || "-"}</td>
                  <td className="p-2 flex gap-3">
                    <Link
                      to={`/dashboard/update-meal/${meal._id}`}
                      className={`${
                        isDark ? "text-blue-400" : "text-blue-600"
                      } hover:underline`}
                      title="Update Meal"
                    >
                      <FaEdit />
                    </Link>
                    <button
                      onClick={() => handleDelete(meal._id)}
                      className="text-red-600 hover:underline"
                      title="Delete Meal"
                      disabled={deleteMutation.isLoading}
                    >
                      <FaTrash />
                    </button>
                    <button
                      onClick={() => handleViewMeal(meal)}
                      className={`${
                        isDark ? "text-green-400" : "text-green-600"
                      } hover:underline`}
                      title="View Meal"
                    >
                      <FaEye />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="mt-4 flex justify-center gap-2">
        <button
          disabled={page <= 1 || isLoading}
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          className={`px-3 py-1 border rounded disabled:opacity-50 ${
            isDark
              ? "border-gray-600 text-gray-300"
              : "border-gray-300 text-gray-700"
          }`}
        >
          Prev
        </button>
        <span
          className={`px-3 py-1 border rounded ${
            isDark
              ? "border-gray-600 text-gray-300"
              : "border-gray-300 text-gray-700"
          }`}
        >
          Page {page} / {totalPages}
        </span>
        <button
          disabled={page >= totalPages || isLoading}
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          className={`px-3 py-1 border rounded disabled:opacity-50 ${
            isDark
              ? "border-gray-600 text-gray-300"
              : "border-gray-300 text-gray-700"
          }`}
        >
          Next
        </button>
      </div>

      <MealDetailsModal
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        meal={selectedMeal}
      />
    </div>
  );
};

export default AllMeals;
