import React, { useEffect, useState } from "react";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { useTheme } from "../../../Hooks/useTheme";
import toast from "react-hot-toast";
import Modal from "react-modal";
import { useForm } from "react-hook-form";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const imageHostingKey = import.meta.env.VITE_IMAGEBB_KEY;
const imageUploadUrl = `https://api.imgbb.com/1/upload?key=${imageHostingKey}`;

const MyProfile = () => {
  const { user, updateUser } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { isDark } = useTheme();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    if (user?.email) {
      axiosSecure
        .get(`/user/profile?email=${user.email}`)
        .then((res) => {
          setProfile(res.data);
          reset({
            name: res.data.name,
            badge: res.data.badge,
          });
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          toast.error("Failed to load profile");
          setLoading(false);
        });
    }
  }, [user, axiosSecure, reset]);

  const onSubmit = async (data) => {
    try {
      let imageUrl = profile.profileImage;

      if (data.image?.[0]) {
        const formData = new FormData();
        formData.append("image", data.image[0]);
        const imgRes = await axios.post(imageUploadUrl, formData);
        imageUrl = imgRes?.data?.data?.url;
      }

      // 1. Firebase update
      await updateUser(data.name, imageUrl);

      // 2. MongoDB update
      const res = await axiosSecure.patch("/user/update", {
        email: user.email,
        name: data.name,
        profileImage: imageUrl,
        badge: data.badge,
      });

      if (res.data.modifiedCount > 0) {
        toast.success("Profile updated!");
        setProfile((prev) => ({
          ...prev,
          name: data.name,
          profileImage: imageUrl,
          badge: data.badge,
        }));
        setModalIsOpen(false);
      } else {
        toast.error("No changes made");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    }
  };

  if (loading) return <p className="text-center">Loading profile...</p>;
  if (!profile) return <p className="text-center">No profile found.</p>;

  return (
    <div
      className={`max-w-md mx-auto p-6 rounded-xl shadow-lg transition-all ${
        isDark ? "bg-gray-900 text-white" : "bg-white text-gray-800"
      }`}
    >
      <h2 className="text-3xl font-bold mb-6 text-center">My Profile</h2>

      <div className="flex flex-col items-center space-y-4">
        <img
          src={profile.profileImage || "https://via.placeholder.com/150"}
          alt={profile.name || "User Image"}
          className="w-32 h-32 rounded-full object-cover border-4 border-pink-500 shadow"
        />
        <h3 className="text-xl font-semibold">{profile.name || "No Name"}</h3>
        <p className="text-sm opacity-80">{profile.email}</p>

        <span
          className={`px-4 py-1 rounded-full font-semibold text-sm ${
            profile.badge === "Gold"
              ? "bg-yellow-400 text-yellow-900"
              : "bg-orange-200 text-orange-800"
          }`}
        >
          {profile.badge}
        </span>

        <button
          onClick={() => setModalIsOpen(true)}
          className="btn btn-outline btn-sm mt-4"
        >
          Update Profile
        </button>
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        className={`max-w-md w-full p-6 rounded-lg shadow-xl outline-none mx-4 ${
          isDark ? "bg-gray-800 text-white" : "bg-white text-gray-800"
        }`}
        overlayClassName="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center"
      >
        <h3 className="text-xl font-bold mb-4 text-center">Update Profile</h3>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block font-medium">Name</label>
            <input
              {...register("name", { required: "Name is required" })}
              className="input input-bordered w-full"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          {/* Badge */}
          <div>
            <label className="block font-medium">Badge</label>
            <select
              {...register("badge", { required: "Badge is required" })}
              className="select select-bordered w-full"
              defaultValue={profile.badge}
            >
              <option value="Bronze">Bronze</option>
              <option value="Gold">Gold</option>
            </select>
            {errors.badge && (
              <p className="text-red-500 text-sm">{errors.badge.message}</p>
            )}
          </div>

          {/* Image */}
          <div>
            <label className="block font-medium">New Profile Image</label>
            <input
              {...register("image")}
              type="file"
              accept="image/*"
              className="file-input file-input-bordered w-full"
            />
          </div>

          <div className="flex justify-end gap-4 mt-4">
            <button
              type="button"
              onClick={() => setModalIsOpen(false)}
              className="btn btn-ghost"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MyProfile;
