import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader } from '../components/common/Loader';
import PostCard from '../components/post/PostCard';
import Button from '../components/common/Button';
import api from '../services/api';
import toast from 'react-hot-toast';

const FullPost = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/posts/${postId}`);
        console.log('Fetched post data:', response.data); // Log the post data
        setPost(response.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching post:', error);
        setError('Failed to load post. It may have been deleted or you may not have permission to view it.');
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId]);

  const handleLike = async () => {
    try {
      const response = await api.post(`/api/posts/${postId}/like`);
      console.log('Like response:', response.data); // Log the like response
      
      // Refresh post data
      const updatedPostResponse = await api.get(`/api/posts/${postId}`);
      setPost(updatedPostResponse.data);
      toast.success('Post liked!');
    } catch (error) {
      console.error('Error liking post:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        toast.error(error.response.data.message || 'Failed to like post');
      } else {
        toast.error('Failed to like post');
      }
    }
  };

  const handleComment = async (postId, content) => {
    try {
      const response = await api.post(`/api/posts/${postId}/comment`, { text: content });
      console.log('Comment response:', response.data); // Log the comment response
      
      // Refresh post data
      const updatedPostResponse = await api.get(`/api/posts/${postId}`);
      setPost(updatedPostResponse.data);
      toast.success('Comment added!');
    } catch (error) {
      console.error('Error commenting on post:', error);
      toast.error('Failed to add comment');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Post Not Found</h2>
          <p className="text-gray-700 mb-6">The post you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto my-8">
      <Button 
        onClick={() => navigate(-1)} 
        className="mb-4"
        variant="outline"
      >
        ← Back
      </Button>
      
      <PostCard 
        post={post} 
        onLike={handleLike} 
        onComment={handleComment} 
      />
    </div>
  );
};

export default FullPost; 