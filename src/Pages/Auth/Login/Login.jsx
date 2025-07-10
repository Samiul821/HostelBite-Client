import { useState } from "react";

import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../../../Hooks/useTheme";
import useAuth from "../../../Hooks/useAuth";
import toast from "react-hot-toast";
import useAxios from "../../../Hooks/useAxios";

const Login = () => {
  const { isDark } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, googleSignIn, facebookSignIn, passwordReset } = useAuth();
  const axiosInstance = useAxios();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleSignIn = (data) => {
    console.log(data);
    signIn(data.email, data.password)
      .then((result) => {
        const user = result.user;
        toast.success("User logged in successfully!");
        navigate("/");

        console.log(user);
      })
      .catch((error) => {
        toast.error("Failed to log in. Please check your credentials.");
        console.log("Error logging in:", error);
      });
  };

  const handleGoogleSignIn = () => {
    googleSignIn()
      .then(async (reslut) => {
        const user = reslut.user;
        navigate("/");

        console.log("Google Sign In User:", user);
        const userInfo = {
          name: user.name,
          email: user.email,
          role: "user",
          badge: "Bronze",
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
        };

        const res = await axiosInstance.post("/users", userInfo);
        console.log("user update info", res.data);

        toast.success("Logged in successfully with Google!");
      })
      .catch((error) => {
        console.error("Google Sign In Error:", error);
        toast.error("Failed to log in with Google. Please try again.");
      });
  };

  const handleFacebookSignIn = () => {
    facebookSignIn()
      .then(async (result) => {
        const user = result.user;
        navigate("/");

        console.log("Facebook Sign In User:", user);
        const userInfo = {
          name: user.displayName || "Unnamed",
          email: user.email,
          role: "user",
          badge: "Bronze",
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
        };

        const res = await axiosInstance.post("/users", userInfo);
        console.log("user update info", res.data);

        toast.success("Logged in successfully with Facebook!");
      })
      .catch((error) => {
        console.error("Facebook Sign In Error:", error);
        toast.error("Failed to log in with Facebook. Please try again.");
      });
  };

  const handlePasswordReset = () => {
    const email = prompt("Please enter your email address:");
    if (email) {
      passwordReset(email)
        .then(() => {
          toast.success("Password reset email sent");
        })
        .catch(() => {
          toast.error("Error sending password reset email");
        });
    } else {
      toast.error("Email address is required");
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-[3%] lg:px-[10%] py-10 transition-colors duration-300 ${
        isDark
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
          : "bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100"
      }`}
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`w-full max-w-4xl rounded-3xl shadow-2xl p-8 md:p-10 lg:p-12 flex flex-col-reverse md:flex-row gap-8 items-center relative overflow-hidden transition-colors duration-300 ${
          isDark
            ? "bg-gray-800 text-gray-200 border border-gray-600"
            : "bg-white backdrop-blur-md bg-opacity-70"
        }`}
      >
        {/* Left Side - Form */}
        <div className="w-full md:w-1/2">
          <h2
            className={`text-3xl sm:text-4xl font-bold mb-6 text-center md:text-left font-poppins ${
              isDark ? "text-white" : "text-gray-800"
            }`}
          >
            Welcome Back
          </h2>

          <form onSubmit={handleSubmit(handleSignIn)} className="space-y-6">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className={`block mb-1 text-sm font-medium ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Email Address
              </label>
              <input
                type="email"
                {...register("email", { required: true })}
                placeholder="you@example.com"
                className={`w-full px-4 py-3 rounded-xl border text-sm placeholder-gray-400 transition focus:outline-none focus:ring-4 ${
                  isDark
                    ? "bg-gray-900 border-gray-600 text-white focus:ring-indigo-500"
                    : "bg-white border-gray-300 text-gray-900 focus:ring-indigo-400"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">Email is required</p>
              )}
            </div>

            {/* Password */}
            <div className="relative">
              <label
                className={`block mb-1 text-sm font-medium ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", { required: true })}
                placeholder="••••••••"
                className={`w-full px-4 py-3 pr-12 rounded-xl border text-sm placeholder-gray-400 transition focus:outline-none focus:ring-4 ${
                  isDark
                    ? "bg-gray-900 border-gray-600 text-white focus:ring-indigo-500"
                    : "bg-white border-gray-300 text-gray-900 focus:ring-indigo-400"
                }`}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-9 cursor-pointer text-gray-500"
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible size={20} />
                ) : (
                  <AiOutlineEye size={20} />
                )}
              </span>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  Password is required
                </p>
              )}
            </div>

            {/* Remember & Forgot */}
            <div
              className={`flex items-center justify-between text-sm ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="accent-indigo-600 w-5 h-5 rounded-md"
                />
                <span>Remember me</span>
              </label>
              <button
                type="button"
                onClick={handlePasswordReset}
                className="text-indigo-500 hover:underline focus:outline-none"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl shadow-md focus:outline-none focus:ring-4 focus:ring-indigo-300"
            >
              Sign In
            </motion.button>
          </form>

          {/* Google Sign In */}
          <div className="mt-6 flex flex-col gap-4">
            <motion.button
              onClick={handleGoogleSignIn}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className={`w-full flex items-center justify-center gap-3 font-semibold py-3 rounded-xl shadow-sm transition focus:outline-none focus:ring-4 ${
                isDark
                  ? "bg-gray-700 text-gray-200 border border-gray-600 hover:bg-gray-600 focus:ring-indigo-500"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 focus:ring-indigo-200"
              }`}
            >
              <FcGoogle size={22} />
              Sign in with Google
            </motion.button>

            {/* Facebook Sign In */}
            <motion.button
              onClick={handleFacebookSignIn}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className={`w-full flex items-center justify-center gap-3 font-semibold py-3 rounded-xl shadow-sm transition text-blue-700 border border-gray-300 hover:bg-gray-100 focus:outline-none focus:ring-4 ${
                isDark
                  ? "bg-gray-700 hover:bg-gray-600 focus:ring-indigo-500"
                  : "bg-white"
              }`}
            >
              <FaFacebook size={22} />
              Sign in with Facebook
            </motion.button>
          </div>

          {/* Signup Link */}
          <p
            className={`text-center mt-6 text-sm ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Don&apos;t have an account?{" "}
            <Link
              to="/signup"
              className="text-indigo-500 font-semibold hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>

        {/* Right Side Placeholder (optional image or graphic) */}
        <div className="w-full md:w-1/2 hidden md:flex items-center justify-center">
          <div
            className={`w-full h-60 rounded-2xl flex items-center justify-center text-4xl font-bold ${
              isDark
                ? "bg-gray-700 text-gray-200"
                : "bg-indigo-100 text-indigo-600"
            }`}
          >
            HostelBite
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
