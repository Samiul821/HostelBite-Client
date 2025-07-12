import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { useTheme } from "../../../Hooks/useTheme";
import { motion } from "framer-motion";

const MealCard = ({ meal }) => {
  const { isDark } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ scale: 1.03 }}
      className={`rounded-xl overflow-hidden shadow-lg transition-all duration-300 
        ${
          isDark
            ? "bg-gradient-to-tr from-gray-900 to-gray-800 text-white"
            : "bg-gradient-to-tr from-white to-pink-50 text-gray-800"
        }`}
    >
      {/* Image */}
      <img
        src={meal.image}
        alt={meal.title}
        className="w-full h-48 object-cover rounded-t-xl"
      />

      {/* Content */}
      <div className="p-4 space-y-2">
        <h3 className="text-xl font-bold line-clamp-1">{meal.title}</h3>

        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-1 text-yellow-500">
            <FaStar />
            <span className={isDark ? "text-gray-200" : "text-gray-600"}>
              {meal.rating || 0}
            </span>
          </span>
          <span className="font-semibold text-orange-500">৳ {meal.price}</span>
        </div>

        <Link
          to={`/meals-details/${meal._id}`}
          className="inline-block mt-2 w-full text-center py-2 rounded font-semibold
            bg-gradient-to-r from-orange-400 to-pink-500 text-white hover:opacity-90 transition"
        >
          View Details
        </Link>
      </div>
    </motion.div>
  );
};

export default MealCard;
