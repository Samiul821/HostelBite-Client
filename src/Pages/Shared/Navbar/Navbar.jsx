// File: components/shared/Navbar.jsx

import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaBell, FaBars, FaTimes, FaMoon, FaSun } from "react-icons/fa";
import { useTheme } from "../../../Hooks/useTheme";
import useAuth from "../../../Hooks/useAuth";
import toast from "react-hot-toast";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { isDark, toggleTheme, colors } = useTheme();
  const { user, logOut } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const navItems = [
    { to: "/", label: "Home" },
    { to: "/meals", label: "Meals" },
    { to: "/upcoming", label: "Upcoming Meals" },
  ];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const onLogout = () => {
    logOut()
      .then(() => {
        toast.success("Logged out successfully!");
        navigate("/");
      })
      .catch(() => toast.error("Logout failed!"));
  };

  const activeClass = "text-indigo-600 font-bold border-b-4 border-indigo-600";

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-30 shadow-md px-[3%] lg:px-[10%] py-4 flex items-center justify-between ${colors.background} ${colors.text}`}
    >
      {/* Logo */}
      <NavLink to="/" className="text-2xl font-extrabold">
        Hostel<span className="text-orange-500">Bite</span>
      </NavLink>

      {/* Desktop Nav */}
      <ul className="hidden md:flex space-x-10 text-lg font-semibold">
        {navItems.map(({ to, label }) => (
          <li key={to}>
            <NavLink
              to={to}
              className={({ isActive }) =>
                `hover:text-indigo-600 transition-colors duration-200 ${
                  isActive ? activeClass : ""
                }`
              }
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Right Panel */}
      <div className="flex items-center gap-4">
        {/* Notification Icon */}
        <div className="relative text-xl hover:text-orange-500 transition">
          <FaBell />
          <span className="absolute top-0 right-0 w-3 h-3 bg-red-600 rounded-full animate-ping" />
          <span className="absolute top-0 right-0 w-3 h-3 bg-red-600 rounded-full" />
        </div>

        {/* Theme Switch */}
        <button onClick={toggleTheme} className="text-xl">
          {isDark ? <FaSun /> : <FaMoon />}
        </button>

        {/* Auth Buttons */}
        {!user ? (
          <NavLink
            to="/login"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-md font-semibold"
          >
            Join Us
          </NavLink>
        ) : (
          <div className="relative" ref={dropdownRef}>
            <img
              src={user.photoURL || "https://i.pravatar.cc/40"}
              className="w-10 h-10 rounded-full cursor-pointer border-2 border-indigo-600"
              alt="User"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            />
            {dropdownOpen && (
              <div
                className={`absolute right-0 mt-2 w-56 rounded-md shadow-xl overflow-hidden z-50 ${
                  isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"
                }`}
                style={{ animation: "fadeInDropdown 0.25s ease-in-out" }}
              >
                <div className="px-6 py-4 border-b border-gray-300 font-semibold">
                  {user.displayName || "User"}
                </div>

                <button
                  className="block w-full text-left px-6 py-3 hover:bg-indigo-600 hover:text-white"
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate("/dashboard");
                  }}
                >
                  Dashboard
                </button>

                <button
                  className="block w-full text-left px-6 py-3 hover:bg-indigo-600 hover:text-white"
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate("/profile");
                  }}
                >
                  Profile
                </button>

                <button
                  className="block w-full text-left px-6 py-3 hover:bg-indigo-600 hover:text-white"
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate("/orders");
                  }}
                >
                  My Orders
                </button>

                <button
                  className="block w-full text-left px-6 py-3 hover:bg-indigo-600 hover:text-white"
                  onClick={onLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}

        {/* Mobile Menu Icon */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <>
          <div
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 bg-black bg-opacity-40 z-40"
          ></div>
          <ul
            className={`fixed top-0 left-0 w-64 h-full bg-white dark:bg-gray-900 text-black dark:text-white z-50 shadow-lg p-6 space-y-6 font-semibold`}
          >
            {navItems.map(({ to, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
                      isActive ? activeClass : ""
                    }`
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
            <li className="mt-6 border-t pt-4">
              {!user ? (
                <NavLink
                  to="/login"
                  className="bg-indigo-600 text-white px-4 py-2 rounded block text-center"
                  onClick={() => setMenuOpen(false)}
                >
                  Join Us
                </NavLink>
              ) : (
                <>
                  <p className="px-4 pt-2 pb-1">{user.displayName}</p>
                  <button
                    onClick={() => {
                      navigate("/dashboard");
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => {
                      onLogout();
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                  >
                    Logout
                  </button>
                </>
              )}
            </li>
          </ul>
        </>
      )}

      {/* Dropdown Animation CSS */}
      <style>
        {`
          @keyframes fadeInDropdown {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </nav>
  );
};

export default Navbar;
