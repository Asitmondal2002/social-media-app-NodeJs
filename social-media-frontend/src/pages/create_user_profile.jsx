import { useState, useCallback } from "react";
import { useAuth } from "../hooks/useAuth";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const CreateUserProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    bio: "",
    avatar: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = useCallback((e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const validateAvatar = (url) => {
    return url.match(/\.(jpeg|jpg|png|gif|webp)$/i);
  };

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (formData.avatar && !validateAvatar(formData.avatar)) {
        toast.error("Invalid avatar URL. Use a valid image link.");
        return;
      }

      setIsLoading(true);
      try {
        await api.post("/users/profile", formData);
        toast.success("Profile created successfully!");
        navigate("/profile");
      } catch (error) {
        console.error("Error creating profile:", error);
        const errorMessage =
          error?.response?.data?.message || "Failed to create profile";
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [formData, navigate]
  );

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h2 className="text-2xl font-bold mb-4">Create Your Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your name"
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          placeholder="Tell us about yourself"
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="avatar"
          value={formData.avatar}
          onChange={handleChange}
          placeholder="Avatar URL"
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className={`w-full p-2 rounded ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 text-white"
          }`}
          disabled={isLoading}
        >
          {isLoading ? "Creating..." : "Create Profile"}
        </button>
      </form>
    </div>
  );
};

export default CreateUserProfile;
