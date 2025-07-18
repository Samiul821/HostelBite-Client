import { useState } from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import axios from "axios";
import toast from "react-hot-toast";
import { useTheme } from "../../../Hooks/useTheme";
import { Helmet } from "react-helmet-async";

const imageHostingKey = import.meta.env.VITE_IMAGEBB_KEY;
const imageUploadUrl = `https://api.imgbb.com/1/upload?key=${imageHostingKey}`;

const AddMeal = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { isDark } = useTheme();

  const [step, setStep] = useState(1);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
  });

  const step1Fields = watch(["title", "category", "image"]);
  const isStep1Valid =
    step1Fields[0] &&
    step1Fields[1] &&
    step1Fields[2] &&
    step1Fields[2].length > 0;

  const step2Fields = watch(["ingredients", "description", "price"]);
  const isStep2Valid =
    step2Fields[0] &&
    step2Fields[1] &&
    step2Fields[2] &&
    !isNaN(step2Fields[2]) &&
    Number(step2Fields[2]) > 0;

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("image", data.image[0]);
      const imgUploadRes = await axios.post(imageUploadUrl, formData);
      const imageUrl = imgUploadRes?.data?.data?.url;

      if (!imageUrl) return toast.error("Image upload failed!");

      const mealData = {
        title: data.title,
        category: data.category,
        image: imageUrl,
        ingredients: data.ingredients,
        description: data.description,
        price: parseFloat(data.price),
        post_time: new Date(),
        distributor_name: user.displayName,
        distributor_email: user.email,
        rating: 0,
        likes: 0,
        reviews_count: 0,
      };

      const res = await axiosSecure.post("/meals", mealData);
      if (res.data?.insertedId) {
        toast.success("Meal added successfully!");
        reset();
        setStep(1);
      } else {
        toast.error("Failed to add meal");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div
      className={`min-h-screen w-full flex items-center justify-center px-4 ${
        isDark ? " text-white" : " text-gray-900"
      }`}
    >
      <Helmet>
        <title>Add Meal - HostelBite</title>
      </Helmet>

      <div
        className={`max-w-3xl w-full mx-auto p-8 rounded-lg shadow-lg
      ${
        isDark
          ? "bg-gray-800 border border-gray-700"
          : "bg-gradient-to-r from-blue-50 via-white to-pink-50 border border-gray-200"
      }`}
      >
        <h2 className="text-3xl font-bold mb-6 text-center">Add New Meal</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {step === 1 && (
            <>
              {/* Title */}
              <div>
                <label className="font-semibold block mb-1">Meal Title</label>
                <input
                  {...register("title", { required: "Title is required" })}
                  type="text"
                  placeholder="Enter meal title"
                  className={`input input-bordered w-full ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-300"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="font-semibold block mb-1">Category</label>
                <select
                  {...register("category", {
                    required: "Category is required",
                  })}
                  className={`select select-bordered w-full ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                >
                  <option value="" className={isDark ? "bg-gray-700" : ""}>
                    Select category
                  </option>
                  <option>Breakfast</option>
                  <option>Lunch</option>
                  <option>Dinner</option>
                </select>
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.category.message}
                  </p>
                )}
              </div>

              {/* Image */}
              <div>
                <label className="font-semibold block mb-1">Upload Image</label>
                <input
                  {...register("image", { required: "Image is required" })}
                  type="file"
                  accept="image/*"
                  className={`file-input file-input-bordered w-full ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                />
                {errors.image && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.image.message}
                  </p>
                )}
              </div>

              {/* Distributor Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="font-semibold block mb-1">
                    Distributor Name
                  </label>
                  <input
                    value={user.displayName}
                    readOnly
                    className={`input input-bordered w-full cursor-not-allowed ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-gray-100 border-gray-300 text-gray-900"
                    }`}
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">
                    Distributor Email
                  </label>
                  <input
                    value={user.email}
                    readOnly
                    className={`input input-bordered w-full cursor-not-allowed ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-gray-100 border-gray-300 text-gray-900"
                    }`}
                  />
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={!isStep1Valid}
                  className={`btn px-8 ${
                    isStep1Valid
                      ? "btn-primary"
                      : "btn-disabled cursor-not-allowed"
                  }`}
                >
                  Next
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              {/* Ingredients */}
              <div>
                <label className="font-semibold block mb-1">Ingredients</label>
                <textarea
                  {...register("ingredients", {
                    required: "Ingredients are required",
                  })}
                  placeholder="Comma-separated ingredients"
                  className={`textarea textarea-bordered w-full ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-300"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                ></textarea>
                {errors.ingredients && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.ingredients.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="font-semibold block mb-1">Description</label>
                <textarea
                  {...register("description", {
                    required: "Description is required",
                  })}
                  placeholder="Short description of the meal"
                  className={`textarea textarea-bordered w-full ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-300"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                ></textarea>
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* Price */}
              <div>
                <label className="font-semibold block mb-1">Price (৳)</label>
                <input
                  {...register("price", { required: "Price is required" })}
                  type="number"
                  step="0.01"
                  placeholder="Enter price"
                  className={`input input-bordered w-full ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-300"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                />
                {errors.price && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.price.message}
                  </p>
                )}
              </div>

              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className={`btn btn-outline px-8 ${
                    isDark ? "border-gray-500 text-gray-300" : ""
                  }`}
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={!isStep2Valid}
                  className={`btn px-8 ${
                    isStep2Valid
                      ? "btn-primary"
                      : "btn-disabled cursor-not-allowed"
                  }`}
                >
                  Submit
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddMeal;
