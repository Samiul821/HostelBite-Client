import { useState, useMemo } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import useMeals from "../../Hooks/useMeals";
import MealCard from "./MealCard";
import { useTheme } from "../../Hooks/useTheme";
import { Helmet } from "react-helmet-async";

const Meals = () => {
  const { isDark } = useTheme();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 9999]);

  const filters = useMemo(
    () => ({
      search,
      category,
      min: priceRange[0],
      max: priceRange[1],
    }),
    [search, category, priceRange]
  );

  const { meals, setPage, hasMore } = useMeals(filters);

  const categories = ["All", "Breakfast", "Lunch", "Dinner"];

  return (
    <section className={`${isDark ? " text-white" : " text-gray-900"} `}>
      <Helmet>
        <title>All Meals - HostelBite</title>
      </Helmet>

      <h2 className="text-3xl font-bold text-center mb-6">All Meals</h2>

      {/* Filters */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search meals..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`input input-bordered w-full sm:w-1/3 ${
            isDark ? "bg-gray-800 text-white" : ""
          }`}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={`select select-bordered ${
            isDark ? "bg-gray-800 text-white" : ""
          }`}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-2">
          <span className="text-sm">৳ Min:</span>
          <input
            type="number"
            min={0}
            value={priceRange[0]}
            onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
            className={`input input-sm input-bordered w-20 ${
              isDark ? "bg-gray-800 text-white" : ""
            }`}
          />
          <span className="text-sm">৳ Max:</span>
          <input
            type="number"
            min={0}
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
            className={`input input-sm input-bordered w-20 ${
              isDark ? "bg-gray-800 text-white" : ""
            }`}
          />
        </div>
      </div>

      {/* Meal Cards with Infinite Scroll */}
      <InfiniteScroll
        dataLength={meals.length}
        next={() => setPage((prev) => prev + 1)}
        hasMore={hasMore}
        loader={<p className="text-center py-4">Loading more meals...</p>}
        endMessage={
          <p className="text-center text-gray-500 dark:text-gray-400">
            You’ve reached the end.
          </p>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {meals.map((meal) => (
            <MealCard key={meal._id} meal={meal} />
          ))}
        </div>
      </InfiniteScroll>
    </section>
  );
};

export default Meals;
