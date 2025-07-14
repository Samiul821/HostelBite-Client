import { useState } from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import axios from "axios";
import toast from "react-hot-toast";

const imageHostingKey = import.meta.env.VITE_IMAGEBB_KEY;
const imageUploadUrl = `https://api.imgbb.com/1/upload?key=${imageHostingKey}`;

const AddMealPage = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

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

  // Watch fields for validation
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
      // Upload image
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
        likes: data.likes,
      };

      const res = await axiosSecure.post("/upcoming-meals", mealData);
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

  // For conditional rendering
  const watchImage = watch("image");

  return (
    <div className="min-h-screen flex items-center ">
      <div className="max-w-3xl mx-auto p-8 rounded-lg shadow-lg bg-gradient-to-r from-blue-50 via-white to-pink-50 text-gray-800">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Add Upcoming Meal
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {step === 1 && (
            <>
              {/* Title */}
              <div>
                <label className="font-semibold">Meal Title</label>
                <input
                  {...register("title", { required: "Title is required" })}
                  type="text"
                  placeholder="Enter meal title"
                  className="input input-bordered w-full"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm">{errors.title.message}</p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="font-semibold">Category</label>
                <select
                  {...register("category", {
                    required: "Category is required",
                  })}
                  className="select select-bordered w-full"
                >
                  <option value="">Select category</option>
                  <option>Breakfast</option>
                  <option>Lunch</option>
                  <option>Dinner</option>
                </select>
                {errors.category && (
                  <p className="text-red-500 text-sm">
                    {errors.category.message}
                  </p>
                )}
              </div>

              {/* Image */}
              <div>
                <label className="font-semibold">Upload Image</label>
                <input
                  {...register("image", { required: "Image is required" })}
                  type="file"
                  accept="image/*"
                  className="file-input file-input-bordered w-full"
                />
                {errors.image && (
                  <p className="text-red-500 text-sm">{errors.image.message}</p>
                )}
              </div>

              {/* Distributor Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold">Distributor Name</label>
                  <input
                    value={user.displayName}
                    readOnly
                    className="input input-bordered w-full bg-gray-100 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="font-semibold">Distributor Email</label>
                  <input
                    value={user.email}
                    readOnly
                    className="input input-bordered w-full bg-gray-100 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="flex justify-end">
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
                <label className="font-semibold">Ingredients</label>
                <textarea
                  {...register("ingredients", {
                    required: "Ingredients are required",
                  })}
                  placeholder="Comma-separated ingredients"
                  className="textarea textarea-bordered w-full"
                ></textarea>
                {errors.ingredients && (
                  <p className="text-red-500 text-sm">
                    {errors.ingredients.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="font-semibold">Description</label>
                <textarea
                  {...register("description", {
                    required: "Description is required",
                  })}
                  placeholder="Short description of the meal"
                  className="textarea textarea-bordered w-full"
                ></textarea>
                {errors.description && (
                  <p className="text-red-500 text-sm">
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* Price */}
              <div>
                <label className="font-semibold">Price (৳)</label>
                <input
                  {...register("price", { required: "Price is required" })}
                  type="number"
                  step="0.01"
                  placeholder="Enter price"
                  className="input input-bordered w-full"
                />
                {errors.price && (
                  <p className="text-red-500 text-sm">{errors.price.message}</p>
                )}
              </div>

              <div>
                <label className="font-semibold">Likes (optional)</label>
                <input
                  {...register("likes", {
                    valueAsNumber: true,
                    min: 0,
                    required: false, 
                  })}
                  type="number"
                  placeholder="Enter likes count (default 0)"
                  className="input input-bordered w-full"
                  defaultValue={0}
                />
                {errors.likes && (
                  <p className="text-red-500 text-sm">{errors.likes.message}</p>
                )}
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="btn btn-outline px-8"
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

export default AddMealPage;
