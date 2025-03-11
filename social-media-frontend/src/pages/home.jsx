import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Loader } from "../components/common/Loader";
import Button from "../components/common/Button";
import PostCard from "../components/post/PostCard";
import api from "../services/api";
import toast from "react-hot-toast";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/posts');
        setPosts(response.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setError('Failed to load posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleCreatePost = () => {
    navigate('/create-post');
  };

  const handleLike = async (postId) => {
    try {
      await api.post(`/api/posts/${postId}/like`);
      // Refresh posts after liking
      const response = await api.get('/api/posts');
      setPosts(response.data);
    } catch (error) {
      console.error('Error liking post:', error);
      toast.error('Failed to like post');
    }
  };

  const handleComment = async (postId, content) => {
    try {
      await api.post(`/api/posts/${postId}/comment`, { text: content });
      // Refresh posts after commenting
      const response = await api.get('/api/posts');
      setPosts(response.data);
    } catch (error) {
      console.error('Error commenting on post:', error);
      toast.error('Failed to add comment');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Recent Posts</h1>
        
        {user && (
          <Button 
            onClick={handleCreatePost}
            className="flex items-center gap-2"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" 
                clipRule="evenodd" 
              />
            </svg>
            Create Post
          </Button>
        )}
      </div>
      
      {/* Quick post input */}
      {user && (
        <div 
          onClick={handleCreatePost}
          className="bg-white rounded-lg shadow-md p-4 mb-6 cursor-pointer hover:bg-gray-50"
        >
          <div className="flex items-center gap-3">
            <img 
              src={user.avatar || user.profilePicture || "/default-avatar.png"} 
              alt={user.name || user.username || "User"} 
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1 px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
              <p className="text-gray-500">What's on your mind, {user.name?.split(' ')[0] || user.username?.split(' ')[0] || 'there'}?</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Posts List */}
      {loading ? (
        <div className="flex justify-center py-8">
          <Loader size="large" />
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-700 p-4 rounded-md">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 text-sm underline"
          >
            Try again
          </button>
        </div>
      ) : posts.length > 0 ? (
        <div className="space-y-6">
          {posts.map(post => (
            <PostCard 
              key={post._id} 
              post={post} 
              onLike={handleLike} 
              onComment={handleComment} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>No posts found. Be the first to create a post!</p>
          {user && (
            <Button 
              onClick={handleCreatePost}
              className="mt-4"
            >
              Create Your First Post
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
