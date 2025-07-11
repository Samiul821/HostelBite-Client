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
      className={`rounded-xl overflow-hidden shadow transition-all duration-300 
        ${isDark
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
        <h3 className="text-xl font-bold line-clamp-1">
          {meal.title}
        </h3>

        {/* Rating & Price */}
        <div className={`flex items-center justify-between text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
          <span className="flex items-center gap-1">
            <FaStar className="text-yellow-500" />
            {meal.rating || 0}
          </span>
          <span className="font-semibold text-primary">৳ {meal.price}</span>
        </div>

        {/* View Details Button */}
        <Link
          to={`/meal/${meal._id}`}
          className="inline-block mt-2 w-full text-center py-2 rounded font-medium
            bg-gradient-to-r from-orange-400 to-pink-500 text-white hover:opacity-90 transition"
        >
          View Details
        </Link>
      </div>
    </motion.div>
  );
};

export default MealCard;
