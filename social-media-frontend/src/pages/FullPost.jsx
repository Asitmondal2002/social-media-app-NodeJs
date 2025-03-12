import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import PostCard from '../components/post/PostCard';
import { FaArrowLeft } from 'react-icons/fa';
import toast from 'react-hot-toast';

const FullPost = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          toast.error('You must be logged in to view posts');
          navigate('/login');
          return;
        }
        
        const response = await axios.get(`http://localhost:5000/api/posts/${postId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        console.log('Fetched post data:', response.data);
        setPost(response.data);
        setComments(response.data.comments || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Failed to load post. Please try again.');
        toast.error('Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId, navigate]);

  // Handle like functionality
  const handleLike = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        `http://localhost:5000/api/posts/${postId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Update the post with the new likes data
      setPost(response.data);
      toast.success(response.data.isLiked ? 'Post liked!' : 'Post unliked!');
    } catch (err) {
      console.error('Error liking post:', err);
      toast.error('Failed to like post');
    }
  };

  // Handle comment submission
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    if (!newComment.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }
    
    try {
      setSubmittingComment(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        `http://localhost:5000/api/posts/${postId}/comment`,
        { text: newComment.trim() },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setComments(response.data.comments);
      setNewComment('');
      toast.success('Comment added!');
    } catch (err) {
      console.error('Error adding comment:', err);
      toast.error('Failed to add comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-500 text-xl mb-4">{error}</div>
        <button 
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Go Back Home
        </button>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-xl mb-4">Post not found</div>
        <button 
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Go Back Home
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Full Post</h1>
      <p>Post ID: {postId}</p>
      <div className="max-w-3xl mx-auto p-4">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-blue-500 hover:text-blue-700 mb-4 transition-colors"
        >
          <FaArrowLeft className="mr-2" /> Back
        </button>
        
        <div className="mb-6">
          <PostCard 
            post={post} 
            onLike={handleLike}
            showFullContent={true}
            isFullPost={true}
          />
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Comments ({comments.length})</h2>
          
          {/* Comment form */}
          <form onSubmit={handleCommentSubmit} className="mb-6">
            <div className="flex items-start space-x-3">
              <img 
                src={user?.profilePicture ? `http://localhost:5000${user.profilePicture}` : 'https://via.placeholder.com/40'} 
                alt={user?.username || 'User'} 
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={2}
                  required
                />
                <button
                  type="submit"
                  disabled={submittingComment || !newComment.trim()}
                  className={`mt-2 px-4 py-2 rounded-md font-medium text-white ${
                    submittingComment || !newComment.trim() 
                      ? 'bg-blue-300 cursor-not-allowed' 
                      : 'bg-blue-500 hover:bg-blue-600'
                  } transition-colors`}
                >
                  {submittingComment ? 'Posting...' : 'Post Comment'}
                </button>
              </div>
            </div>
          </form>
          
          {/* Comments list */}
          <div className="space-y-4">
            {comments.length > 0 ? (
              comments.map((comment, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 border-b border-gray-100 last:border-0">
                  <img 
                    src={comment.user.profilePicture ? `http://localhost:5000${comment.user.profilePicture}` : 'https://via.placeholder.com/40'} 
                    alt={comment.user.username} 
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-gray-800">{comment.user.username}</h4>
                      <span className="text-xs text-gray-500">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700 mt-1">{comment.text}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No comments yet. Be the first to comment!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullPost; 