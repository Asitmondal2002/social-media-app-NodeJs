import React from 'react';
import { useParams } from 'react-router-dom';

const Profile = () => {
  const { userId } = useParams();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">User Profile</h1>
      <p>User ID: {userId}</p>
      {/* Add more profile content here */}
    </div>
  );
};

export default Profile; 