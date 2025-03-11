import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import Input from '../common/Input';
import { Loader } from '../common/Loader';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';
import api from '../../services/api';

const CreatePost = () => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast.error('Post content cannot be empty');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Check if user is authenticated
      if (!user) {
        toast.error('User not found. Please log in.');
        navigate('/login');
        return;
      }

      // Get token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication token not found. Please log in again.');
        navigate('/login');
        return;
      }
      
      // Make the API request to create a post
      await api.post('/api/posts', {
        content
      });

      toast.success('Post created successfully!');
      setContent('');
      navigate('/'); // Redirect to home page
    } catch (error) {
      console.error('Error creating post:', error);
      
      if (error.response) {
        // Handle specific error responses
        if (error.response.status === 401) {
          toast.error('Your session has expired. Please log in again.');
          navigate('/login');
        } else {
          toast.error(error.response.data.message || 'Failed to create post');
        }
      } else {
        toast.error('Failed to create post. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Create a New Post</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            rows={4}
          />
        </div>
        
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting || !content.trim()}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader size="small" /> Posting...
              </span>
            ) : (
              'Create Post'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost; 