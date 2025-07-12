import { useState, useEffect, useRef } from "react";
import useAxios from "./useAxios";


const useMeals = (filters) => {
  const [meals, setMeals] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const axiosInstance = useAxios()

  const filtersRef = useRef(filters);

  useEffect(() => {
    setMeals([]);
    setPage(1);
    setHasMore(true);
    setTotal(0);
    filtersRef.current = filters;
  }, [filters]);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const res = await axiosInstance.get("/all-meals", {
          params: { ...filtersRef.current, page, limit: 6 },
        });

        const newMeals = Array.isArray(res.data.meals) ? res.data.meals : [];
        const totalMeals = res.data.total || 0;

        setMeals((prev) => {
          const updatedMeals = page === 1 ? newMeals : [...prev, ...newMeals];
          setHasMore(updatedMeals.length < totalMeals);
          return updatedMeals;
        });

        setTotal(totalMeals);
      } catch (err) {
        console.error("Meal fetch failed:", err);
      }
    };

    fetchMeals();
  }, [page, filters]);

  return { meals, setPage, hasMore };
};

export default useMeals;
