import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { FaUserShield } from "react-icons/fa";
import Swal from "sweetalert2";
import { useTheme } from "../../../Hooks/useTheme";

const ManageUsers = () => {
  const [search, setSearch] = useState("");
  const axiosSecure = useAxiosSecure();
  const { isDark } = useTheme();
  const queryClient = useQueryClient();

  // Fetch users with search param
  const {
    data: users = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["users", search],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users?search=${search}`);
      return res.data;
    },
    keepPreviousData: true, // smoother UI when searching
  });

  // Mutation to toggle admin role
  const mutation = useMutation({
    mutationFn: ({ id, newRole }) =>
      axiosSecure.patch(`/users/role/${id}`, { role: newRole }),
    onSuccess: (_, variables) => {
      // Update users cache manually for instant UI update
      queryClient.setQueryData(["users", search], (oldUsers = []) =>
        oldUsers.map((user) =>
          user._id === variables.id
            ? { ...user, role: variables.newRole }
            : user
        )
      );
      Swal.fire(
        "Updated!",
        `User has been ${
          variables.newRole === "admin" ? "made admin" : "removed from admin"
        }.`,
        "success"
      );
    },
    onError: () => {
      Swal.fire("Error!", "Failed to update user role.", "error");
    },
  });

  const toggleAdmin = (id, currentRole) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    const actionText = newRole === "admin" ? "Make Admin" : "Remove Admin";

    Swal.fire({
      title: `Are you sure?`,
      text: `Do you want to ${actionText.toLowerCase()} this user?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, ${actionText}!`,
      background: isDark ? "#1f2937" : "#fff",
      color: isDark ? "#fff" : "#000",
    }).then((result) => {
      if (result.isConfirmed) {
        mutation.mutate({ id, newRole });
      }
    });
  };

  return (
    <div className={`p-6 ${isDark ? "text-gray-200" : "text-gray-900"}`}>
      <h2 className="text-3xl font-bold mb-6 text-center">Manage Users</h2>

      <div className="mb-4 max-w-sm mx-auto">
        <input
          type="text"
          placeholder="Search by name or email..."
          className={`w-full p-3 rounded-lg border ${
            isDark
              ? "border-gray-700 bg-gray-800 text-gray-200"
              : "border-gray-300 bg-white text-gray-900"
          }`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading ? (
        <p className="text-center">Loading users...</p>
      ) : isError ? (
        <p className="text-center text-red-500">Failed to load users.</p>
      ) : (
        <div className="overflow-x-auto">
          <table
            className={`w-full table-auto border shadow-md ${
              isDark ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <thead
              className={`${
                isDark
                  ? "bg-gray-800 text-gray-300"
                  : "bg-gradient-to-r from-purple-100 to-indigo-100"
              }`}
            >
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Subscription</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr
                    key={user._id}
                    className={`transition ${
                      isDark
                        ? "hover:bg-gray-700"
                        : "hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50"
                    }`}
                  >
                    <td className="p-3">{user.name}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3 capitalize">{user.badge || "Free"}</td>
                    <td className="p-3 capitalize">
                      {user.role === "admin" ? (
                        <span className="text-green-400 font-bold">Admin</span>
                      ) : (
                        "User"
                      )}
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => toggleAdmin(user._id, user.role)}
                        className={`${
                          user.role === "admin"
                            ? "bg-red-600 hover:bg-red-700"
                            : "bg-blue-600 hover:bg-blue-700"
                        } text-white px-3 py-1 rounded flex items-center gap-1`}
                        disabled={mutation.isLoading}
                      >
                        <FaUserShield />
                        {user.role === "admin" ? "Remove Admin" : "Make Admin"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-400">
                    No users found.
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

export default ManageUsers;
