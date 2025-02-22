import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

// Define the profile interface
interface Profile {
  id: string;
  name: string;
  avatar?: string;
  followers?: string[];
  following?: string[];
}

const OtherProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [user, setUser] = useState<Profile | null>(null);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get<Profile>(`/api/profile/${id}`);
        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    const fetchUser = async () => {
      try {
        const response = await axios.get<Profile>('/api/auth/me');
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchProfile();
    fetchUser();
  }, [id]);

  useEffect(() => {
    if (user && profile) {
      setIsFollowing(user.following?.includes(profile.id) || false);
    }
  }, [user, profile]);

  const handleFollow = async () => {
    if (!profile || !user) return;

    try {
      await axios.post(`/api/profile/${profile.id}/follow`);
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error('Error following/unfollowing:', error);
    }
  };

  if (!profile) {
    return <p>Loading profile...</p>;
  }

  return (
    <div className="profile-container">
      <h2>{profile.name}</h2>
      <img src={profile.avatar || '/default-avatar.png'} alt={profile.name} />
      <p>Followers: {profile.followers?.length || 0}</p>
      <p>Following: {profile.following?.length || 0}</p>

      {user && profile && user.id !== profile.id && (
        <button onClick={handleFollow}>
          {isFollowing ? 'Unfollow' : 'Follow'}
        </button>
      )}
    </div>
  );
};

export default OtherProfile;
