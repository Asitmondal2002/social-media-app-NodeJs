import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import toast from 'react-hot-toast';

// Define a type for friend objects
interface Friend {
  id: string;
  name: string;
  avatar?: string;
}

const Friends: React.FC = () => {
  const { user } = useAuth();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return; // ✅ Ensure user is defined before calling fetchFriends
    fetchFriends();
  }, [user]);

  const fetchFriends = async () => {
    if (!user) return; // ✅ Extra safeguard to avoid API call if user is null

    try {
      const response = await api.get<Friend[]>(`/users/${user.id}/friends`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setFriends(response.data);
    } catch (error) {
      toast.error('Failed to fetch friends.');
    } finally {
      setLoading(false);
    }
  };

  const handleUnfriend = async (friendId: string) => {
    if (!user) return; // ✅ Prevent making API call if user is null

    try {
      await api.delete(`/users/${user.id}/friends/${friendId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setFriends(friends.filter(friend => friend.id !== friendId));
      toast.success('Unfriended successfully!');
    } catch (error) {
      toast.error('Failed to unfriend.');
    }
  };

  if (loading) return <p>Loading friends...</p>;

  return (
    <div className="friends-container">
      <h2>My Friends</h2>
      {friends.length > 0 ? (
        <ul className="friends-list">
          {friends.map((friend) => (
            <li key={friend.id} className="friend-item">
              <img src={friend.avatar || '/default-avatar.png'} alt={friend.name} className="friend-avatar" />
              <div>
                <p>{friend.name}</p>
                <button className="unfriend-btn" onClick={() => handleUnfriend(friend.id)}>Unfriend</button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>You have no friends yet.</p>
      )}
    </div>
  );
};

export default Friends;
