import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import api from "../services/api";
import toast from "react-hot-toast";

const EditProfilePage = () => {
  const { user, updateProfile } = useAuth(); // ✅ Use updateProfile instead of setUser
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    avatar: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        bio: user.bio || "",
        avatar: user.avatar || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("User not found. Please log in again.");
      return;
    }

    try {
      await updateProfile(formData); // ✅ Use updateProfile instead of setUser
      toast.success("Profile updated successfully!");
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Failed to update profile.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="edit-profile-container">
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit} className="edit-profile-form">
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Bio:
          <textarea name="bio" value={formData.bio} onChange={handleChange} />
        </label>
        <label>
          Avatar URL:
          <input
            type="text"
            name="avatar"
            value={formData.avatar}
            onChange={handleChange}
          />
        </label>
        <button type="submit" className="save-btn">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProfilePage;
