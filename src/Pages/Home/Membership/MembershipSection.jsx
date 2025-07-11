import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import useAxios from "../../../Hooks/useAxios";
import { useTheme } from "../../../Hooks/useTheme";

const MembershipSection = () => {
  const { isDark } = useTheme();
  const axios = useAxios();
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    axios
      .get("/packages")
      .then((res) => setPackages(res.data))
      .catch((err) => console.error("Failed to load packages:", err));
  }, [axios]);

  return (
    <section>
      <div className="max-w-7xl mx-auto text-center px-4">
        <h2
          className={`text-3xl md:text-4xl font-bold mb-4 ${
            isDark ? "text-indigo-400" : ""
          }`}
        >
          Upgrade Your Meal Experience
        </h2>
        <p
          className={`max-w-2xl mx-auto mb-10 ${
            isDark ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Choose a premium plan to enjoy exclusive features, better meals, and
          priority service.
        </p>

        <div className="grid gap-8 md:grid-cols-3">
          {packages.map((pkg, idx) => (
            <motion.div
              key={pkg.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.2 }}
              className={`border-2 rounded-2xl shadow-md p-8 flex flex-col items-center transition-colors duration-300
                ${
                  isDark
                    ? `bg-gray-800 ${pkg.colorDark}`
                    : `bg-white ${pkg.colorLight}`
                }
              `}
            >
              <h3 className="text-xl font-semibold mb-2">{pkg.name} Package</h3>
              <p className="text-3xl font-bold mb-4 text-indigo-600">
                ${pkg.price}/mo
              </p>
              <ul
                className={`mb-6 space-y-2 text-sm text-left w-full ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {pkg.features.map((feature, i) => (
                  <li key={i}>✔️ {feature}</li>
                ))}
              </ul>
              <Link
                to={`/checkout/${pkg._id}`}
                className="mt-auto bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                Get Started
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MembershipSection;
