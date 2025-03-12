// UserProfile.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // If using react-router
import api from "../../services/api";

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get userId from URL params or context/props
  const { userId } = useParams(); // If using react-router

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Check if userId is valid before making the request
        if (!userId) {
          throw new Error("User ID is missing or undefined");
        }

        const response = await getUserProfile(userId);
        setProfile(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setError("Failed to load user profile");
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!profile) return <div>No profile data found</div>;

  return (
    <div className="user-profile">
      <h2>{profile.name || "User"}</h2>
      {/* Rest of your profile UI */}
    </div>
  );
};

export default UserProfile;
