import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useAuth } from "../hooks/useAuth";
import api from "../services/api";
import toast from "react-hot-toast";

const Friends = () => {
  const { user } = useAuth();
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchFriends();
  }, [user]);

  const fetchFriends = async () => {
    if (!user) return;

    try {
      const { data } = await api.get(`/users/${user.id}/friends`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setFriends(data);
    } catch (error) {
      toast.error("Failed to fetch friends.");
    } finally {
      setLoading(false);
    }
  };

  const handleUnfriend = async (friendId) => {
    if (!user) return;

    try {
      await api.delete(`/users/${user.id}/friends/${friendId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setFriends((prevFriends) =>
        prevFriends.filter((friend) => friend.id !== friendId)
      );
      toast.success("Unfriended successfully!");
    } catch (error) {
      toast.error("Failed to unfriend.");
    }
  };

  if (loading) return <p className="text-gray-600">Loading friends...</p>;

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold text-gray-700 mb-4">My Friends</h2>
      {friends.length > 0 ? (
        <ul className="space-y-4">
          {friends.map((friend) => (
            <li
              key={friend.id}
              className="flex items-center bg-gray-100 p-4 rounded-lg"
            >
              <img
                src={friend.avatar || "/default-avatar.png"}
                alt={friend.name}
                className="w-12 h-12 rounded-full mr-4"
              />
              <div className="flex-1">
                <p className="text-gray-800 font-medium">{friend.name}</p>
              </div>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                onClick={() => handleUnfriend(friend.id)}
              >
                Unfriend
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">You have no friends yet.</p>
      )}
    </div>
  );
};

// Optional: Define PropTypes
Friends.propTypes = {
  user: PropTypes.object,
};

export default Friends;
