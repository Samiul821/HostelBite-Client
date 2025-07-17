import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../../../Hooks/useTheme";

const ErrorPage = () => {
  const { isDark } = useTheme();

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center px-4 text-center ${
        isDark ? "bg-gray-900 text-white" : "bg-white text-gray-800"
      }`}
    >
      <motion.img
        src="https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif"
        alt="404 Illustration"
        className="w-full max-w-md rounded-2xl"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      />

      <motion.h1
        className="text-4xl md:text-6xl font-bold mt-6"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        404 - Page Not Found
      </motion.h1>

      <p
        className={`mt-4 max-w-md ${
          isDark ? "text-gray-300" : "text-gray-500"
        }`}
      >
        Sorry, the page you are looking for doesn’t exist or has been moved.
      </p>

      <Link
        to="/"
        className="mt-6 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default ErrorPage;
