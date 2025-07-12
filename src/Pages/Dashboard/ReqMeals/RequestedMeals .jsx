import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { FaHeart } from "react-icons/fa";
import useAuth from "../../../Hooks/useAuth";
import { useTheme } from "../../../Hooks/useTheme";
import Swal from "sweetalert2";

const RequestedMeals = () => {
  const [requestedMeals, setRequestedMeals] = useState([]);
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const { isDark } = useTheme();
  console.log(requestedMeals);

  useEffect(() => {
    if (!user?.email) return;
    axiosSecure.get(`/requested-meals?email=${user.email}`).then((res) => {
      console.log("Requested Meals API response:", res.data);
      setRequestedMeals(res.data);
    });
  }, [axiosSecure, user?.email]);

  const handleCancel = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to cancel this requested meal!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, cancel it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/requested-meals/${id}`).then((res) => {
          if (res.data.deletedCount > 0) {
            setRequestedMeals((prev) => prev.filter((meal) => meal._id !== id));
            Swal.fire(
              "Cancelled!",
              "Your requested meal has been cancelled.",
              "success"
            );
          } else {
            Swal.fire(
              "Error!",
              "Failed to cancel the requested meal.",
              "error"
            );
          }
        });
      }
    });
  };

  return (
    <div
      className={`p-4 ${
        isDark ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"
      }`}
    >
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
            {requestedMeals.map((meal) => (
              <tr
                key={meal._id}
                className={`hover:${isDark ? "bg-gray-700" : "bg-gray-50"}`}
              >
                <td className="p-3">{meal.mealDetails?.title || "No title"}</td>
                <td className="p-3 flex items-center gap-1">
                  <FaHeart className="text-red-500" />{" "}
                  {meal.mealDetails?.likes || 0}
                </td>
                <td className="p-3">{meal.mealDetails?.reviews_count || 0}</td>
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
            ))}

            {requestedMeals.length === 0 && (
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
      </div>
    </div>
  );
};

export default RequestedMeals;
