import React from "react";
import { useForm } from "react-hook-form";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../Hooks/useAuth";
import { useMutation } from "@tanstack/react-query";

const Login = () => {
  const { signIn, googleSignIn, facebookSignIn } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const navigate = useNavigate();

  // Email-password login mutation (React Query v4+ style)
  const loginMutation = useMutation({
    mutationFn: ({ email, password }) => signIn(email, password),
    onSuccess: () => {
      reset();
      navigate("/");
    },
    onError: (error) => {
      alert("Login Failed: " + error.message);
    },
  });

  const handleEmailLogin = (data) => {
    loginMutation.mutate(data);
  };

  // Google login হ্যান্ডলার
  const handleGoogleLogin = () => {
    googleSignIn()
      .then(() => navigate("/"))
      .catch((err) => alert("Google login failed: " + err.message));
  };

  // Facebook login হ্যান্ডলার
  const handleFacebookLogin = () => {
    facebookSignIn()
      .then(() => navigate("/"))
      .catch((err) => alert("Facebook login failed: " + err.message));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-8">
        <h2 className="text-3xl font-bold text-indigo-600 mb-6 text-center">
          Login
        </h2>

        <form onSubmit={handleSubmit(handleEmailLogin)} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            {...register("email", { required: "Email is required" })}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}

          <input
            type="password"
            placeholder="Password"
            {...register("password", { required: "Password is required" })}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}

          <button
            type="submit"
            disabled={loginMutation.isLoading}
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-500 transition font-semibold"
          >
            {loginMutation.isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="my-6 text-center text-gray-500">OR</div>

        <div className="space-y-4">
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center space-x-3 border border-gray-300 rounded py-2 hover:bg-gray-100 transition"
          >
            <FaGoogle className="text-red-500" />{" "}
            <span>Continue with Google</span>
          </button>

          <button
            onClick={handleFacebookLogin}
            className="w-full flex items-center justify-center space-x-3 border border-gray-300 rounded py-2 hover:bg-gray-100 transition"
          >
            <FaFacebook className="text-blue-600" />{" "}
            <span>Continue with Facebook</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
