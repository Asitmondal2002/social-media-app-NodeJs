import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AddPost = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !image) {
      toast.error('Post cannot be empty!');
      return;
    }

    if (!user) {
      toast.error('User not found. Please log in.');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('content', content);
      if (image) {
        formData.append('image', image);
      }
      formData.append('userId', user.id.toString());

      await api.post('/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Post created successfully!');
      navigate('/');
    } catch (error: unknown) {
      const errorMessage =
        (error as any)?.response?.data?.message || 'Failed to create post';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-post-container">
      <h2>Create a New Post</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        ></textarea>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <button type="submit" disabled={loading}>
          {loading ? 'Posting...' : 'Post'}
        </button>
      </form>
    </div>
  );
};

export default AddPost;
