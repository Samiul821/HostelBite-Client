import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/useAuth";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";

const imageHostingKey = import.meta.env.VITE_IMAGEBB_KEY;
const imageUploadUrl = `https://api.imgbb.com/1/upload?key=${imageHostingKey}`;

const UpdateMeal = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Fetch single meal data using tanstack query
  const { data: meal, isLoading } = useQuery({
    queryKey: ["meal", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/meals/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  // Reset form with fetched meal data
  useEffect(() => {
    if (meal) {
      reset(meal);
    }
  }, [meal, reset]);

  // Submit handler
  const onSubmit = async (data) => {
    try {
      let imageUrl = meal.image;

      if (data.image && data.image.length > 0) {
        const formData = new FormData();
        formData.append("image", data.image[0]);

        const res = await fetch(imageUploadUrl, {
          method: "POST",
          body: formData,
        });

        const result = await res.json();
        if (result.success) {
          imageUrl = result.data.display_url;
        }
      }

      const updatedMeal = {
        ...data,
        image: imageUrl,
        price: parseFloat(data.price),
        distributor_name: user.displayName,
        distributor_email: user.email,
      };

      const response = await axiosSecure.put(`/meals/${id}`, updatedMeal);

      if (response.data.modifiedCount > 0) {
        Swal.fire("Success!", "Meal updated successfully", "success");
        navigate("/dashboard/allMeals");
      }
    } catch (error) {
      console.error("Update failed:", error);
      Swal.fire("Error", "Failed to update meal", "error");
    }
  };

  if (isLoading) return <p className="text-center mt-20">Loading...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Helmet>
        <title>HostelBite | Update Meal</title>
      </Helmet>

      <div className="max-w-3xl w-full p-8 rounded-lg shadow-lg bg-gradient-to-r from-blue-50 via-white to-pink-50 text-gray-800">
        <h2 className="text-3xl font-bold mb-6 text-center">Update Meal</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {step === 1 && (
            <>
              <div>
                <label className="font-semibold">Meal Title</label>
                <input
                  {...register("title", { required: "Title is required" })}
                  type="text"
                  className="input input-bordered w-full"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="font-semibold">Category</label>
                <select
                  {...register("category", {
                    required: "Category is required",
                  })}
                  className="select select-bordered w-full"
                >
                  <option value="">Select category</option>
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                </select>
                {errors.category && (
                  <p className="text-red-500 text-sm">
                    {errors.category.message}
                  </p>
                )}
              </div>

              <div>
                <label className="font-semibold">
                  Upload New Image (optional)
                </label>
                <input
                  {...register("image")}
                  type="file"
                  accept="image/*"
                  className="file-input file-input-bordered w-full"
                />
              </div>

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
                  className="btn btn-primary px-8"
                >
                  Next
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <label className="font-semibold">Ingredients</label>
                <textarea
                  {...register("ingredients", {
                    required: "Ingredients are required",
                  })}
                  className="textarea textarea-bordered w-full"
                ></textarea>
                {errors.ingredients && (
                  <p className="text-red-500 text-sm">
                    {errors.ingredients.message}
                  </p>
                )}
              </div>

              <div>
                <label className="font-semibold">Description</label>
                <textarea
                  {...register("description", {
                    required: "Description is required",
                  })}
                  className="textarea textarea-bordered w-full"
                ></textarea>
                {errors.description && (
                  <p className="text-red-500 text-sm">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div>
                <label className="font-semibold">Price (৳)</label>
                <input
                  {...register("price", { required: "Price is required" })}
                  type="number"
                  step="0.01"
                  className="input input-bordered w-full"
                />
                {errors.price && (
                  <p className="text-red-500 text-sm">{errors.price.message}</p>
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
                <button type="submit" className="btn btn-primary px-8">
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

export default UpdateMeal;
