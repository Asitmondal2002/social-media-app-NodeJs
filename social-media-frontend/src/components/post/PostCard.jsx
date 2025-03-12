import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { FaHeart, FaRegHeart, FaComment, FaShare } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import axios from 'axios';
import toast from 'react-hot-toast';

const PostCard = ({ post, showFullContent = false, isFullPost = false }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentPost, setCurrentPost] = useState(post);
  const [isLiking, setIsLiking] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // Format the date using date-fns
  const formattedDate = formatDistanceToNow(new Date(currentPost.createdAt), { addSuffix: true });

  // Truncate content if not showing full content
  const displayContent = showFullContent 
    ? currentPost.content 
    : currentPost.content.length > 150 
      ? `${currentPost.content.substring(0, 150)}...` 
      : currentPost.content;

  // Handle like
  const handleLike = async (e) => {
    e.preventDefault(); // Prevent navigation if inside a Link
    
    if (!user) {
      toast.error('You must be logged in to like posts');
      navigate('/login');
      return;
    }
    
    if (isLiking) return; // Prevent multiple clicks
    
    try {
      setIsLiking(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        `http://localhost:5000/api/posts/${currentPost._id}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setCurrentPost(response.data);
    } catch (error) {
      console.error('Error liking post:', error);
      toast.error('Failed to like post');
    } finally {
      setIsLiking(false);
    }
  };

  // Handle comment submission
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent navigating to full post
    
    if (!commentContent.trim()) return;

    try {
      setIsSubmittingComment(true);
      
      // Call the API to add a comment
      const response = await axios.post(
        `http://localhost:5000/api/posts/${currentPost._id}/comment`,
        { text: commentContent },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      // Update the current post state with the new comment
      setCurrentPost(response.data);
      
      setCommentContent('');
      toast.success('Comment added!');
    } catch (error) {
      console.error('Error commenting on post:', error);
      toast.error('Failed to add comment');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Post header with user info */}
      <div className="p-4 flex items-center border-b border-gray-100">
        <Link to={`/profile/${currentPost.user._id}`} className="flex items-center">
          <img 
            src={currentPost.user.profilePicture 
              ? `http://localhost:5000${currentPost.user.profilePicture}` 
              : 'https://via.placeholder.com/40'} 
            alt={currentPost.user.username} 
            className="w-10 h-10 rounded-full object-cover mr-3 border-2 border-blue-100"
          />
          <div>
            <h3 className="font-semibold text-gray-800 hover:text-blue-600 transition-colors">{currentPost.user.username}</h3>
            <p className="text-xs text-gray-500">{formattedDate}</p>
          </div>
        </Link>
      </div>
      
      {/* Post content */}
      <div className="px-4 py-3">
        <p className="text-gray-800 mb-3 leading-relaxed">{displayContent}</p>
        
        {!showFullContent && currentPost.content.length > 150 && (
          <Link to={`/post/${currentPost._id}`} className="text-blue-500 hover:underline font-medium">
            Read more
          </Link>
        )}
        
        {/* Post image */}
        {currentPost.image && (
          <div className="mt-3">
            <img 
              src={`http://localhost:5000${currentPost.image}`} 
              alt="Post" 
              className="w-full rounded-lg object-cover max-h-96 shadow-sm"
              onError={(e) => {
                console.error('Image failed to load:', currentPost.image);
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}
      </div>
      
      {/* Post actions */}
      <div className="px-4 py-3 border-t border-gray-100 flex justify-between bg-gray-50">
        <div className="flex space-x-6">
          {/* Like button */}
          <button 
            onClick={handleLike}
            className={`flex items-center space-x-1 ${currentPost.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'} transition-colors duration-200`}
            disabled={isLiking}
          >
            {currentPost.isLiked ? (
              <FaHeart className="text-red-500" />
            ) : (
              <FaRegHeart />
            )}
            <span className="font-medium">{currentPost.likes ? currentPost.likes.length : 0}</span>
          </button>
          
          {/* Comment button */}
          <Link to={`/post/${currentPost._id}`} className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors duration-200">
            <FaComment />
            <span className="font-medium">{currentPost.comments ? currentPost.comments.length : 0}</span>
          </Link>
          
          {/* Share button */}
          <button className="flex items-center space-x-1 text-gray-500 hover:text-green-500 transition-colors duration-200">
            <FaShare />
          </button>
        </div>
        
        {/* View full post button (if not already on full post) */}
        {!isFullPost && (
          <Link 
            to={`/post/${currentPost._id}`} 
            className="text-blue-500 hover:text-blue-700 font-medium transition-colors duration-200"
          >
            View full post
          </Link>
        )}
      </div>
    </div>
  );
};

export default PostCard; 