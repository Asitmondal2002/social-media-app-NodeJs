import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const CreateUserProfile = () => {
  const { user } = useAuth(); // Removed setUser since it's not defined in useAuth()
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: '',
    avatar: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/users/profile', formData);
      toast.success('Profile created successfully!');
      navigate('/profile');
    } catch (error: unknown) {
      const errorMessage =
        (error as any)?.response?.data?.message || 'Failed to create profile';
      toast.error(errorMessage);
    }
  };

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
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
          Create Profile
        </button>
      </form>
    </div>
  );
};

export default CreateUserProfile;
