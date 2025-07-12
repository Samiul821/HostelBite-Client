import { useEffect, useState } from "react";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { FaUserShield } from "react-icons/fa";
import Swal from "sweetalert2";
import { useTheme } from "../../../Hooks/useTheme"; // import useTheme

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const axiosSecure = useAxiosSecure();
  const { isDark } = useTheme(); // get isDark

  useEffect(() => {
    axiosSecure.get(`/users?search=${search}`).then((res) => {
      setUsers(res.data);
    });
  }, [search, axiosSecure]);

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
      background: isDark ? "#1f2937" : "#fff", // SweetAlert dark bg
      color: isDark ? "#fff" : "#000",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure
          .patch(`/users/role/${id}`, { role: newRole })
          .then((res) => {
            if (res.data.modifiedCount > 0) {
              setUsers((prev) =>
                prev.map((user) =>
                  user._id === id ? { ...user, role: newRole } : user
                )
              );
              Swal.fire(
                "Updated!",
                `User has been ${actionText.toLowerCase()}ed.`,
                "success"
              );
            }
          });
      }
    });
  };

  return (
    <div className={`p-6 ${isDark ? " text-gray-200" : " text-gray-900"}`}>
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
            {users.map((user) => (
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
                  >
                    <FaUserShield />
                    {user.role === "admin" ? "Remove Admin" : "Make Admin"}
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-400">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
