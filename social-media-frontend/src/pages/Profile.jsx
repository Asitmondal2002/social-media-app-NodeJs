import React from 'react';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';
import Avatar from '../components/common/Avatar';

const Profile = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Please log in to view your profile</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center gap-6">
          <Avatar src={user.avatar} alt={user.name || 'User'} size="large" />
          <div>
            <h1 className="text-2xl font-bold">{user.name || 'User'}</h1>
            <p className="text-gray-600">{user.email}</p>
            {user.bio && <p className="mt-2">{user.bio}</p>}
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <Button variant="outline">Edit Profile</Button>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4">Your Posts</h2>
      <p className="text-center py-8 text-gray-500">
        You haven't created any posts yet.
      </p>
    </div>
  );
};

export default Profile; 