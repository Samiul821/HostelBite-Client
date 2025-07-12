import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaHome,
  FaSignOutAlt,
  FaTachometerAlt,
  FaPlus,
  FaUsersCog,
  FaListAlt,
  FaStar,
  FaUtensilSpoon,
  FaCalendarAlt,
  FaUserShield,
} from "react-icons/fa";
import { useTheme } from "../Hooks/useTheme";
import useAuth from "../Hooks/useAuth";
import useUserRole from "../Hooks/useUserRole";
import toast from "react-hot-toast";
import LoadingSpinner from "../Pages/Shared/LoadingSpinner/LoadingSpinner";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isDark, colors } = useTheme();
  const { logOut } = useAuth();
  const { role, roleLoading } = useUserRole();
  const navigate = useNavigate();

  const handleLogout = () => {
    logOut()
      .then(() => {
        toast.success("Logged out successfully!");
        navigate("/", { replace: true });
      })
      .catch((error) => {
        toast.error("Failed to log out. Please try again.");
        console.error("Logout error:", error);
      });
  };

  if (roleLoading) return <LoadingSpinner></LoadingSpinner>;

  return (
    <div className={`flex h-screen ${colors.background} ${colors.text}`}>
      {/* Sidebar */}
      <aside
        className={`fixed h-full md:static z-20 w-64 bg-opacity-90 shadow-lg transition-transform transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 ${
          isDark ? "bg-gray-800" : "bg-white"
        } flex flex-col justify-between`}
      >
        <div>
          <div className="p-6 font-bold text-xl border-b border-gray-300">
            Hostel<span className="text-orange-500">Bite</span>
          </div>
          <ul className="p-4 space-y-3">
            {/* Common Navigation */}
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded transition ${
                    isActive
                      ? "bg-indigo-600 text-white font-semibold"
                      : "hover:bg-indigo-100 dark:hover:bg-gray-700"
                  }`
                }
              >
                <FaHome />
                Main Site
              </NavLink>
            </li>
            <li>
              <NavLink
              end
                to="/dashboard"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded transition ${
                    isActive
                      ? "bg-indigo-600 text-white font-semibold"
                      : "hover:bg-indigo-100 dark:hover:bg-gray-700"
                  }`
                }
              >
                <FaTachometerAlt />
                Dashboard Home
              </NavLink>
            </li>
            {/* User Only Routes */}
             {role === "user" && (
              <>
                <li>
                  <NavLink
                    to="/dashboard/req-meals"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-2 rounded transition ${
                        isActive
                          ? "bg-indigo-600 text-white font-semibold"
                          : "hover:bg-indigo-100 dark:hover:bg-gray-700"
                      }`
                    }
                  >
                    <FaPlus />
                    Requested Meals
                  </NavLink>
                </li>
                 <li>
                  <NavLink
                    to="/dashboard/my-reviews"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-2 rounded transition ${
                        isActive
                          ? "bg-indigo-600 text-white font-semibold"
                          : "hover:bg-indigo-100 dark:hover:bg-gray-700"
                      }`
                    }
                  >
                    <FaPlus />
                    My Reviews
                  </NavLink>
                </li>
                 <li>
                  <NavLink
                    to="/dashboard/pay-history"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-2 rounded transition ${
                        isActive
                          ? "bg-indigo-600 text-white font-semibold"
                          : "hover:bg-indigo-100 dark:hover:bg-gray-700"
                      }`
                    }
                  >
                    <FaPlus />
                    Payment History
                  </NavLink>
                </li>
                 <li>
                  <NavLink
                    to="/dashboard/my-profile"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-2 rounded transition ${
                        isActive
                          ? "bg-indigo-600 text-white font-semibold"
                          : "hover:bg-indigo-100 dark:hover:bg-gray-700"
                      }`
                    }
                  >
                    <FaPlus />
                    My Profile
                  </NavLink>
                </li>
              </>
             )}

            {/* Admin Only Routes */}
            {role === "admin" && (
              <>
                <li>
                  <NavLink
                    to="/dashboard/add-meal"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-2 rounded transition ${
                        isActive
                          ? "bg-indigo-600 text-white font-semibold"
                          : "hover:bg-indigo-100 dark:hover:bg-gray-700"
                      }`
                    }
                  >
                    <FaPlus />
                    Add Meal
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dashboard/manege-users"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-2 rounded transition ${
                        isActive
                          ? "bg-indigo-600 text-white font-semibold"
                          : "hover:bg-indigo-100 dark:hover:bg-gray-700"
                      }`
                    }
                  >
                    <FaUsersCog />
                    Manage Users
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dashboard/all-meals"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-2 rounded transition ${
                        isActive
                          ? "bg-indigo-600 text-white font-semibold"
                          : "hover:bg-indigo-100 dark:hover:bg-gray-700"
                      }`
                    }
                  >
                    <FaListAlt />
                    All Meals
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dashboard/all-reviews"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-2 rounded transition ${
                        isActive
                          ? "bg-indigo-600 text-white font-semibold"
                          : "hover:bg-indigo-100 dark:hover:bg-gray-700"
                      }`
                    }
                  >
                    <FaStar />
                    All Reviews
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dashboard/serve-meals"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-2 rounded transition ${
                        isActive
                          ? "bg-indigo-600 text-white font-semibold"
                          : "hover:bg-indigo-100 dark:hover:bg-gray-700"
                      }`
                    }
                  >
                    <FaUtensilSpoon />
                    Serve Meals
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dashboard/upcoming-meals"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-2 rounded transition ${
                        isActive
                          ? "bg-indigo-600 text-white font-semibold"
                          : "hover:bg-indigo-100 dark:hover:bg-gray-700"
                      }`
                    }
                  >
                    <FaCalendarAlt />
                    Upcoming Meals
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dashboard/admin-profile"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-2 rounded transition ${
                        isActive
                          ? "bg-indigo-600 text-white font-semibold"
                          : "hover:bg-indigo-100 dark:hover:bg-gray-700"
                      }`
                    }
                  >
                    <FaUserShield />
                    Admin Profile
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-300">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 px-4 py-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-800 transition"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar for Mobile */}
        <header
          className={`md:hidden flex items-center justify-between p-4 shadow ${
            isDark ? "bg-gray-900" : "bg-white"
          }`}
        >
          <div className="font-bold text-xl ">
            Hostel<span className="text-orange-500">Bite</span>
          </div>
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            <FaBars size={20} />
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
