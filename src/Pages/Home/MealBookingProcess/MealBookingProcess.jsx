import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTheme } from "../../../Hooks/useTheme";

const steps = [
  {
    title: "1️⃣ Choose Your Meal",
    description: "Browse upcoming meals and pick your favorite.",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
  },
  {
    title: "2️⃣ Request & Confirm",
    description: "Request the meal and confirm before the deadline.",
    image:
      "https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=400&q=80",
  },
  {
    title: "3️⃣ Enjoy Your Food!",
    description: "Get notified when your meal is ready and enjoy!",
    image:
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=400&q=80",
  },
];

export default function MealBookingProcess() {
  const { isDark } = useTheme();

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <h2
        className={`text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-12 ${
          isDark ? "text-white" : "text-gray-900"
        }`}
      >
        🍽️ How to Book a Meal
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
        {steps.map((step, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.3 }}
            viewport={{ once: true }}
            className={`p-8 sm:p-10 rounded-xl border duration-300 text-center flex flex-col items-center max-w-md mx-auto ${
              isDark
                ? "border-gray-600 hover:border-blue-400"
                : "border-gray-300 hover:border-blue-600"
            }`}
            style={{
              background: isDark
                ? "linear-gradient(135deg, #2c3e50 0%, #4ca1af 100%)"
                : "linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)",
              color: isDark ? "#f0f0f0" : "#333",
              boxShadow: isDark
                ? "0 8px 16px rgba(0, 0, 0, 0.7)"
                : "0 8px 16px rgba(0, 0, 0, 0.12)",
            }}
          >
            <img
              src={step.image}
              alt={step.title}
              className="w-28 h-28 sm:w-36 sm:h-36 object-cover rounded-full mb-6 shadow-lg border-4 border-white"
            />
            <p className="text-2xl sm:text-3xl font-semibold mb-4">
              {step.title}
            </p>
            <p className="text-base sm:text-lg">{step.description}</p>
          </motion.div>
        ))}
      </div>

      <div className="text-center mt-14">
        <Link to="/meals">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-primary btn-wide text-base sm:text-lg px-8 sm:px-10 py-3 sm:py-4"
          >
            Request Meal Now
          </motion.button>
        </Link>
      </div>
    </motion.section>
  );
}
