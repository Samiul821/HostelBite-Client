import { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { FaBell, FaBars, FaTimes, FaMoon, FaSun } from "react-icons/fa";
import { useTheme } from "../../../Hooks/useTheme";
import useAuth from "../../../Hooks/useAuth";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { isDark, toggleTheme, colors } = useTheme();
  const { user } = useAuth();

  const dropdownRef = useRef(null);

  // Click outside dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Logout function placeholder
  const onLogout = () => {
    // এখানে তোমার লগআউট লজিক লিখবে
    alert("Logged out!");
  };

  const navItems = [
    { to: "/", label: "Home" },
    { to: "/meals", label: "Meals" },
    { to: "/upcoming", label: "Upcoming Meals" },
  ];

  const activeClass = "text-indigo-600 font-bold border-b-4 border-indigo-600";

  return (
    <nav
      className={`${colors.background} ${colors.text} px-[3%] lg:px-[10%] py-4 flex items-center justify-between shadow-md sticky top-0 z-30`}
    >
      {/* Logo */}
      <div className="flex items-center space-x-4 cursor-pointer select-none font-extrabold text-2xl">
        <NavLink to="/" className={colors.primary}>
          Hostel<span className="text-orange-500">Bite</span>
        </NavLink>
      </div>

      {/* Desktop Menu */}
      <ul className="hidden md:flex space-x-10 items-center font-semibold text-lg">
        {navItems.map(({ to, label }) => (
          <li key={to}>
            <NavLink
              to={to}
              className={({ isActive }) =>
                `hover:text-indigo-600 transition-colors duration-300 ${
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
      <div className="flex items-center space-x-5">
        {/* Notification */}
        <button
          aria-label="Notifications"
          className="relative hover:text-orange-500 transition text-xl"
        >
          <FaBell size={22} />
          <span className="absolute top-0 right-0 w-3 h-3 bg-red-600 rounded-full animate-ping" />
          <span className="absolute top-0 right-0 w-3 h-3 bg-red-600 rounded-full" />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="hover:text-orange-500 transition text-xl"
          aria-label="Toggle Theme"
        >
          {!isDark ? <FaMoon size={20} /> : <FaSun size={20} />}
        </button>

        {/* Join Us or Profile */}
        {!user ? (
          <NavLink
            to="/login"
            className="btn btn-primary px-6 py-2 rounded font-semibold text-lg"
            onClick={() => setMenuOpen(false)}
          >
            Join Us
          </NavLink>
        ) : (
          <div className="relative" ref={dropdownRef}>
            <img
              src={user.photoURL || "https://i.pravatar.cc/40"}
              alt="Profile"
              className="w-10 h-10 rounded-full cursor-pointer border-2 border-indigo-600"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            />

            {/* Dropdown */}
            {dropdownOpen && (
              <div
                className={`absolute right-0 mt-3 w-56 rounded-lg shadow-xl z-50 overflow-hidden ${
                  isDark
                    ? "bg-gray-900 text-gray-200"
                    : "bg-white text-gray-900"
                }`}
                style={{ animation: "fadeInDropdown 0.25s ease-in-out" }}
              >
                <div className="px-6 py-4 border-b border-gray-700 font-semibold select-none">
                  {user.displayName || "User"}
                </div>
                <button
                  className={`w-full text-left px-6 py-3 hover:bg-indigo-600 hover:text-white transition-colors duration-200`}
                  onClick={() => {
                    setDropdownOpen(false);
                    window.location.href = "/dashboard";
                  }}
                >
                  Dashboard
                </button>
                <button
                  className={`w-full text-left px-6 py-3 hover:bg-indigo-600 hover:text-white transition-colors duration-200`}
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
          className="md:hidden ml-3 text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle Menu"
        >
          {menuOpen ? <FaTimes size={26} /> : <FaBars size={26} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <>
          <div
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 bg-black bg-opacity-30 z-40"
          />
          <ul
            className={`${colors.background} ${colors.text} fixed top-0 left-0 w-64 h-full flex flex-col space-y-6 p-6 z-50 font-semibold shadow-lg transform transition-transform duration-300 ease-in-out`}
          >
            {navItems.map(({ to, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    `block py-3 px-4 rounded transition-colors duration-300 ${
                      isActive
                        ? "text-indigo-600 bg-indigo-100 dark:bg-indigo-900"
                        : "hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`
                  }
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </NavLink>
              </li>
            ))}

            <li className="mt-auto">
              {!user ? (
                <NavLink
                  to="/join"
                  className="btn btn-primary block w-full text-center px-4 py-3 rounded font-semibold"
                  onClick={() => setMenuOpen(false)}
                >
                  Join Us
                </NavLink>
              ) : (
                <>
                  <div className="border-t pt-4 px-4 font-semibold select-none">
                    {user.displayName || "User"}
                  </div>
                  <button
                    className="w-full text-left px-4 py-3 rounded hover:bg-gray-200 dark:hover:bg-gray-700 mt-2"
                    onClick={() => {
                      window.location.href = "/dashboard";
                      setMenuOpen(false);
                    }}
                  >
                    Dashboard
                  </button>
                  <button
                    className="w-full text-left px-4 py-3 rounded hover:bg-gray-200 dark:hover:bg-gray-700 mt-1"
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
        </>
      )}

      {/* Dropdown fade-in animation CSS */}
      <style>
        {`
          @keyframes fadeInDropdown {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </nav>
  );
};

export default Navbar;
