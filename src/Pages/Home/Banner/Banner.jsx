import { motion } from "framer-motion";

const Banner = () => {
  return (
    <section className="relative mt-16 rounded-xl w-full h-[65vh] md:h-[70vh] overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1920&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center items-center text-center h-full px-6 text-white">
        <motion.h1
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold mb-4 font-poppins"
        >
          Discover Delicious Meals Every Day
        </motion.h1>

        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-lg md:text-xl mb-6 max-w-2xl"
        >
          From breakfast to dinner — explore a variety of meals made for your
          hostel lifestyle.
        </motion.p>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="w-full max-w-md flex flex-col sm:flex-row gap-2 sm:gap-0"
        >
          <input
            type="text"
            placeholder="Search meals..."
            className="flex-grow px-4 py-3 rounded-lg sm:rounded-l-lg sm:rounded-r-none bg-white text-gray-800 placeholder-gray-500 focus:outline-none"
          />
          <button className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-lg sm:rounded-r-lg sm:rounded-l-none text-white font-semibold transition">
            Search
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Banner;
