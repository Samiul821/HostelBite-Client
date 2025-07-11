import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { FaBars, FaHome, FaSignOutAlt, FaTachometerAlt, FaUtensils } from "react-icons/fa";
import { useTheme } from "../Hooks/useTheme";
import useAuth from "../Hooks/useAuth";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isDark, colors } = useTheme();
  const { logOut, user } = useAuth();

  const handleLogout = () => {
    logOut().then(() => {
      // Optional: toast.success('Logged out');
    });
  };

  const navItems = [
    { name: "Main Site", to: "/", icon: <FaHome /> },
    { name: "Dashboard Home", to: "/dashboard", icon: <FaTachometerAlt /> },
    // admin route
    { name: "Add Meal", to: "/dashboard/add-meal", icon: <FaUtensils /> },
    {name: "Manege Users", to: "/dashboard/manege-users",icon: <FaUtensils /> },
    {name: "All Meals", to: "/dashboard/all-meals",icon: <FaUtensils /> },
    {name: "All Reviews", to: "/dashboard/all-reviews",icon: <FaUtensils /> },
    {name: "Serve Meals", to: "/dashboard/serve-meals",icon: <FaUtensils /> },
    {name: "Serve Meals", to: "/dashboard/serve-meals",icon: <FaUtensils /> },
    {name: "Upcoming Meals", to: "/dashboard/upcoming-meals",icon: <FaUtensils /> },
    {name: "Admin Profile", to: "/dashboard/admin-profile",icon: <FaUtensils /> },
  ];

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
            {navItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2 rounded transition ${
                      isActive
                        ? "bg-indigo-600 text-white font-semibold"
                        : "hover:bg-indigo-100 dark:hover:bg-gray-700"
                    }`
                  }
                >
                  {item.icon}
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Logout Bottom Fixed */}
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
