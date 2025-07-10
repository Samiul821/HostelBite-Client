import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { useTheme } from "../../../Hooks/useTheme";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import useAxios from "../../../Hooks/useAxios";
import useAuth from "../../../Hooks/useAuth";
import toast from "react-hot-toast";

const SignUp = () => {
  const { isDark } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [uploading, setUploading] = useState(false);
  const axiosInstance = useAxios();
  const navigate = useNavigate();
  const { createUser, updateUser, googleSignIn, facebookSignIn, setUser } =
    useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "my_unsigned");

    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dpsrlv5bf/image/upload",
        formData
      );
      return res.data.secure_url;
    } catch (error) {
      console.error("Image upload failed:", error);
      return null;
    }
  };

  const onSubmit = async (data) => {
    if (data.image && data.image.length > 0) {
      setUploading(true);

      try {
        const uploadedImageUrl = await handleImageUpload(data.image[0]);
        if (!uploadedImageUrl) {
          toast.error("Failed to upload image. Please try again.");
          setUploading(false);
          return;
        }

        // Create user with email & password
        const createdUser = await createUser(data.email, data.password);

        // Update Firebase user profile
        await updateUser({
          displayName: data.name,
          photoURL: uploadedImageUrl,
        });

        // Prepare user info for backend
        const userInfo = {
          name: data.name,
          email: data.email,
          role: "user",
          badge: "Bronze",
          profileImage: uploadedImageUrl,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
        };

        // Save user info to backend DB
        await axiosInstance.post("/users", userInfo);

        setUser(createdUser.user);

        toast.success("User created successfully!");
      } catch (error) {
        console.error("Signup error:", error);
        if (error.code === "auth/email-already-in-use") {
          toast.error("This email is already registered.");
        } else {
          toast.error("Signup failed. Please try again.");
        }
      } finally {
        setUploading(false);
      }
    } else {
      toast.error("Please upload a profile image.");
    }
  };

  const handleGoogleSignIn = () => {
    googleSignIn()
      .then(async (reslut) => {
        const user = reslut.user;
        navigate("/");

        console.log("Google Sign In User:", user);
        const userInfo = {
          name: user.displayName,
          email: user.email,
          role: "user",
          badge: "Bronze",
          profileImage: user.photoURL,
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

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-[3%] lg:px-[10%] py-10 transition-colors duration-300 ${
        isDark
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
          : "bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100"
      }`}
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`w-full max-w-3xl rounded-3xl shadow-2xl p-8 md:p-10 lg:p-12 flex flex-col gap-8 items-center transition-colors duration-300 ${
          isDark
            ? "bg-gray-800 text-gray-200 border border-gray-600"
            : "bg-white backdrop-blur-md bg-opacity-70"
        }`}
      >
        <h2
          className={`text-3xl sm:text-4xl font-bold text-center font-poppins ${
            isDark ? "text-white" : "text-gray-800"
          }`}
        >
          Create Your Account
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
          {/* Full Name */}
          <div>
            <label
              className={`block mb-1 text-sm font-medium ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Full Name
            </label>
            <input
              type="text"
              {...register("name", { required: true })}
              placeholder="Your full name"
              className={`w-full px-4 py-3 rounded-xl border text-sm placeholder-gray-400 transition focus:outline-none focus:ring-4 ${
                isDark
                  ? "bg-gray-900 border-gray-600 text-white focus:ring-indigo-500"
                  : "bg-white border-gray-300 text-gray-900 focus:ring-indigo-400"
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">Name is required</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label
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
              placeholder="Create a password"
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
              <p className="text-red-500 text-sm mt-1">Password is required</p>
            )}
          </div>

          {/* Profile Image Upload */}
          <div>
            <label
              className={`block mb-1 text-sm font-medium ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Upload Profile Image
            </label>
            <input
              type="file"
              accept="image/*"
              {...register("image", { required: true })}
              className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:border-0 file:rounded-lg file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200 transition"
            />
            {errors.image && (
              <p className="text-red-500 text-sm mt-1">
                Profile image is required
              </p>
            )}
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={uploading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl shadow-md focus:outline-none focus:ring-4 focus:ring-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? "Uploading..." : "Sign Up"}
          </motion.button>
        </form>

        {/* Social Buttons */}
        <div className="w-full mt-6 flex flex-col gap-4">
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
            Sign up with Google
          </motion.button>

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
            Sign up with Facebook
          </motion.button>
        </div>

        <p
          className={`text-center text-sm ${
            isDark ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-500 font-semibold hover:underline"
          >
            Login here
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default SignUp;
