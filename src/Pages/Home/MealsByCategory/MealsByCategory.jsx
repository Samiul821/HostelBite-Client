import { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import useAxios from "../../../Hooks/useAxios";
import MealCard from "./MealCard";
import { useTheme } from "../../../Hooks/useTheme";

const MealsByCategory = () => {
  const [meals, setMeals] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const axios = useAxios();
  const { isDark } = useTheme();

  const categories = ["Breakfast", "Lunch", "Dinner", "All"];

  // Fetch all meals once
  useEffect(() => {
    axios
      .get("/meals")
      .then((res) => setMeals(res.data))
      .catch((err) => console.error("Fetch meals failed:", err));
  }, [axios]);

  const filtered = activeTab === "All"
    ? meals
    : meals.filter((m) => m.category === activeTab);

  return (
    <section className="">
      <h2 className="text-3xl font-bold text-center mb-8">
        Meals by Category
      </h2>

      {/* Tabs */}
      <div className="flex justify-center flex-wrap gap-4 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`px-5 py-2 rounded-full font-semibold transition ${
              activeTab === cat
                ? "bg-gradient-to-r from-orange-400 to-pink-500 text-white shadow"
                : isDark
                ? "bg-gray-700 text-gray-200"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Meals Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.slice(0, 4).map((meal) => (
            <MealCard key={meal._id} meal={meal} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400 mt-10">
          No meals found in this category.
        </p>
      )}
    </section>
  );
};

export default MealsByCategory;
