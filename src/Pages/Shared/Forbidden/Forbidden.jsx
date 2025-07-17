import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../../../Hooks/useTheme";

const Forbidden = () => {
  const { isDark } = useTheme();

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen text-center px-4 ${
        isDark ? " text-white" : " text-gray-800"
      }`}
    >
      <motion.img
        src="https://i.ibb.co/YT4Hn3kZ/download-22.jpg"
        alt="403 Forbidden"
        className="max-w-sm w-full rounded-xl"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      />

      <motion.h2
        className="text-3xl font-bold mt-6 mb-2"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        403 - Forbidden
      </motion.h2>

      <motion.p
        className={`mb-4 ${isDark ? "text-gray-300" : "text-gray-600"}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        You don’t have permission to access this page.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Link
          to="/dashboard"
          className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Go Back to Dashboard
        </Link>
      </motion.div>
    </div>
  );
};

export default Forbidden;
