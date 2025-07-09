import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaBell, FaBars, FaTimes, FaMoon, FaSun } from "react-icons/fa";
import { useTheme } from "../../../Hooks/useTheme";

const Navbar = ({ user, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { isDark, toggleTheme, colors } = useTheme();

  const navItems = [
    { to: "/", label: "Home" },
    { to: "/meals", label: "Meals" },
    { to: "/upcoming", label: "Upcoming Meals" },
  ];

  const activeClass =
    "text-indigo-500 font-semibold border-b-2 border-indigo-500";

  return (
    <nav
      className={`${colors.background} ${colors.text} px-[3%] lg:px-[10%] py-3 flex items-center justify-between relative shadow-md`}
    >
      {/* Logo */}
      <div className="flex items-center space-x-3 cursor-pointer select-none font-extrabold text-xl">
        <NavLink to="/" className={colors.primary}>
          Hostel
        </NavLink>
        <span className="text-orange-500">Bite</span>
      </div>

      {/* Desktop Menu */}
      <ul className="hidden md:flex space-x-8 items-center font-medium">
        {navItems.map(({ to, label }) => (
          <li key={to}>
            <NavLink
              to={to}
              className={({ isActive }) =>
                `hover:text-indigo-500 transition ${
                  isActive ? activeClass : "text-inherit"
                }`
              }
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Right Side */}
      <div className="flex items-center space-x-4">
        {/* Notification */}
        <button
          aria-label="Notifications"
          className="relative hover:text-orange-500 transition"
        >
          <FaBell size={20} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-600 rounded-full animate-ping" />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="hover:text-orange-400 transition"
          aria-label="Toggle Theme"
        >
          {!isDark ? <FaMoon size={18} /> : <FaSun size={18} />}
        </button>

        {/* Join Us or Profile */}
        {!user ? (
          <NavLink
            to="/join"
            className="btn btn-primary px-4 py-2 rounded font-medium"
            onClick={() => setMenuOpen(false)}
          >
            Join Us
          </NavLink>
        ) : (
          <div className="relative">
            <img
              src={user.photoURL || "https://i.pravatar.cc/40"}
              alt="Profile"
              className="w-9 h-9 rounded-full cursor-pointer border"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            />
            {dropdownOpen && (
              <div
                className={`absolute right-0 mt-2 w-48 rounded shadow-lg z-10 ${
                  isDark ? "bg-gray-800 text-white" : "bg-white text-black"
                }`}
              >
                <div
                  className={`px-4 py-2 border-b font-semibold select-none ${
                    isDark ? "border-gray-700" : "border-gray-200"
                  }`}
                >
                  {user.displayName || "User"}
                </div>
                <button
                  className={`w-full text-left px-4 py-2 transition ${
                    isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"
                  }`}
                  onClick={() => {
                    setDropdownOpen(false);
                    window.location.href = "/dashboard";
                  }}
                >
                  Dashboard
                </button>
                <button
                  className={`w-full text-left px-4 py-2 transition ${
                    isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"
                  }`}
                  onClick={() => {
                    setDropdownOpen(false);
                    onLogout();
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden ml-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle Menu"
        >
          {menuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <ul
          className={`${colors.background} ${colors.text} absolute top-full left-0 w-full flex flex-col space-y-3 p-4 md:hidden z-20 font-medium shadow-md`}
        >
          {navItems.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `block w-full py-2 px-4 rounded transition ${
                    isActive
                      ? "text-indigo-500 font-semibold bg-indigo-100 dark:bg-indigo-900"
                      : "hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`
                }
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </NavLink>
            </li>
          ))}

          <li>
            {!user ? (
              <NavLink
                to="/join"
                className="btn btn-primary block w-full text-center px-4 py-2 rounded font-medium"
                onClick={() => setMenuOpen(false)}
              >
                Join Us
              </NavLink>
            ) : (
              <>
                <div className="border-t pt-2 px-4 font-semibold select-none">
                  {user.displayName || "User"}
                </div>
                <button
                  className="w-full text-left px-4 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                  onClick={() => {
                    window.location.href = "/dashboard";
                    setMenuOpen(false);
                  }}
                >
                  Dashboard
                </button>
                <button
                  className="w-full text-left px-4 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                  onClick={() => {
                    onLogout();
                    setMenuOpen(false);
                  }}
                >
                  Logout
                </button>
              </>
            )}
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
