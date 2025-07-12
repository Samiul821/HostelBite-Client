import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { FaHeart, FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import MealDetailsModal from "./MealDetailsModal ";

const AllMeals = () => {
  const [meals, setMeals] = useState([]);
  const [totalMeals, setTotalMeals] = useState(0);
  const [sortBy, setSortBy] = useState("");
  const [order, setOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const limit = 10;

  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);

  const handleViewMeal = (meal) => {
    setSelectedMeal(meal);
    setIsModalOpen(true);
  };

  // Fetch meals from server
  const fetchMeals = () => {
    let url = `/all-meals?page=${page}&limit=${limit}`;

    if (sortBy) {
      url += `&sortBy=${sortBy}&order=${order}`;
    }

    axiosSecure
      .get(url)
      .then((res) => {
        setMeals(res.data.meals);
        setTotalMeals(res.data.total);
      })
      .catch((err) => {
        console.error("Fetch meals error:", err);
      });
  };

  useEffect(() => {
    fetchMeals();
  }, [page, sortBy, order]);

  // Handle delete meal
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
        axiosSecure
          .delete(`/meals/${id}`)
          .then((res) => {
            if (res.data.deletedCount > 0) {
              Swal.fire("Deleted!", "Meal has been deleted.", "success");
              fetchMeals();
            }
          })
          .catch((err) => {
            Swal.fire("Error!", "Failed to delete meal.", "error");
          });
      }
    });
  };

  // Handle sorting change
  const handleSortChange = (field) => {
    if (sortBy === field) {
      // Toggle order
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setOrder("desc");
    }
  };

  // Pagination controls (basic example)
  const totalPages = Math.ceil(totalMeals / limit);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">All Meals</h2>

      <div className="mb-4 flex gap-4">
        <button
          onClick={() => handleSortChange("likes")}
          className={`px-4 py-2 rounded border ${
            sortBy === "likes" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Sort by Likes{" "}
          {sortBy === "likes" ? (order === "asc" ? "↑" : "↓") : ""}
        </button>
        <button
          onClick={() => handleSortChange("reviews_count")}
          className={`px-4 py-2 rounded border ${
            sortBy === "reviews_count"
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
          }`}
        >
          Sort by Reviews{" "}
          {sortBy === "reviews_count" ? (order === "asc" ? "↑" : "↓") : ""}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="table w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Title</th>
              <th className="p-2 text-left">Likes</th>
              <th className="p-2 text-left">Reviews Count</th>
              <th className="p-2 text-left">Rating</th>
              <th className="p-2 text-left">Distributor</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {meals.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-4">
                  No meals found.
                </td>
              </tr>
            ) : (
              meals.map((meal) => (
                <tr key={meal._id} className="hover:bg-gray-50">
                  <td className="p-2">{meal.title}</td>
                  <td className="p-2 flex items-center gap-1">
                    <FaHeart className="text-red-500" /> {meal.likes || 0}
                  </td>
                  <td className="p-2">{meal.reviews_count || 0}</td>
                  <td className="p-2">{meal.rating || 0}</td>
                  <td className="p-2">{meal.distributor_name || "-"}</td>
                  <td className="p-2 flex gap-3">
                    <button
                      onClick={() => navigate(`/update-meal/${meal._id}`)}
                      className="text-blue-600 hover:underline"
                      title="Update Meal"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(meal._id)}
                      className="text-red-600 hover:underline"
                      title="Delete Meal"
                    >
                      <FaTrash />
                    </button>
                    <button
                      onClick={() => handleViewMeal(meal)}
                      className="text-green-600 hover:underline"
                      title="View Meal"
                    >
                      <FaEye />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-center gap-2">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="px-3 py-1 border rounded">
          Page {page} / {totalPages}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          className="px-3 py-1 border rounded disabled:opacity-50"
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
