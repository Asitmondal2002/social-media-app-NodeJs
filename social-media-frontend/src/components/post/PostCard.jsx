import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Button from '../common/Button';
import Avatar from '../common/Avatar';
import api from '../../services/api';
import toast from 'react-hot-toast';

const PostCard = ({ post, onLike, onComment }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLiking, setIsLiking] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [localPost, setLocalPost] = useState(post);

  // Make sure we have the user data from the post
  const postUser = localPost.user || {};
  const userName = postUser.username || postUser.name || "Anonymous";
  const userAvatar = postUser.profilePicture || postUser.avatar;
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Handle like
  const handleLike = async (e) => {
    e.stopPropagation(); // Prevent navigating to full post
    
    try {
      setIsLiking(true);
      
      // Call the API to like/unlike the post
      const response = await api.post(`/api/posts/${localPost._id}/like`);
      
      // Update the local post state with the new likes count
      setLocalPost(prev => ({
        ...prev,
        likes: prev.liked ? 
          prev.likes.filter(id => id !== user.id) : 
          [...prev.likes, user.id],
        liked: !prev.liked
      }));
      
      toast.success(response.data.message);
      
      // Call the parent component's onLike function if provided
      if (onLike) {
        onLike(localPost._id);
      }
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
      const response = await api.post(`/api/posts/${localPost._id}/comment`, { 
        text: commentContent 
      });
      
      // Update the local post state with the new comment
      setLocalPost(response.data);
      
      setCommentContent('');
      toast.success('Comment added!');
      
      // Call the parent component's onComment function if provided
      if (onComment) {
        onComment(localPost._id, commentContent);
      }
    } catch (error) {
      console.error('Error commenting on post:', error);
      toast.error('Failed to add comment');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // Navigate to full post view
  const navigateToFullPost = () => {
    navigate(`/post/${localPost._id}`);
  };

  // Determine the correct image URL
  const getImageUrl = () => {
    if (!localPost.image) return null;
    
    // If the image is already a full URL, use it
    if (localPost.image.startsWith('http')) {
      return localPost.image;
    }
    
    // If it's a relative path, prepend the API base URL
    return `${api.defaults.baseURL}${localPost.image}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Post Header */}
      <div className="p-4 flex items-center justify-between border-b">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${postUser._id}`} onClick={(e) => e.stopPropagation()}>
            <Avatar
              src={userAvatar}
              alt={userName}
              size="medium"
            />
          </Link>
          <div>
            <Link
              to={`/profile/${postUser._id}`}
              className="font-medium text-gray-900 hover:text-primary"
              onClick={(e) => e.stopPropagation()}
            >
              {userName}
            </Link>
            <p className="text-sm text-gray-500">{formatDate(localPost.createdAt)}</p>
          </div>
        </div>
      </div>

      {/* Post Content - Clickable to view full post */}
      <div 
        className="p-4 cursor-pointer hover:bg-gray-50" 
        onClick={navigateToFullPost}
      >
        <p className="text-gray-800 whitespace-pre-wrap">{localPost.content}</p>
        
        {/* Image with proper URL handling */}
        {localPost.image && (
          <div className="mt-3">
            <img 
              src={`http://localhost:5000${localPost.image}`} 
              alt="Post" 
              className="w-full rounded-lg object-cover max-h-96"
              onError={(e) => {
                console.error('Image failed to load:', localPost.image);
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}
      </div>

      {/* Post Actions */}
      <div className="px-4 py-3 border-t flex items-center gap-6">
        <button
          onClick={handleLike}
          disabled={isLiking}
          className={`flex items-center gap-2 text-sm ${
            localPost.liked ? 'text-blue-500' : 'text-gray-600'
          } hover:text-blue-500 transition-colors`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill={localPost.liked ? 'currentColor' : 'none'}
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <span>{localPost.likes?.length || 0} {localPost.likes?.length === 1 ? 'Like' : 'Likes'}</span>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent navigating to full post
            setShowComments(!showComments);
          }}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-500 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <span>{localPost.comments?.length || 0} {localPost.comments?.length === 1 ? 'Comment' : 'Comments'}</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="border-t" onClick={(e) => e.stopPropagation()}>
          {/* Comment Form */}
          <form onSubmit={handleSubmitComment} className="p-4 border-b">
            <div className="flex gap-3">
              <Avatar src={user?.avatar} alt={user?.name || ''} size="small" />
              <input
                type="text"
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:border-primary"
                disabled={isSubmittingComment}
              />
              <Button
                type="submit"
                disabled={!commentContent.trim() || isSubmittingComment}
                className="text-sm"
              >
                {isSubmittingComment ? 'Posting...' : 'Post'}
              </Button>
            </div>
          </form>

          {/* Comments List */}
          <div className="max-h-96 overflow-y-auto">
            {localPost.comments && localPost.comments.length > 0 ? (
              localPost.comments.map((comment, index) => (
                <div key={comment._id || index} className="p-4 border-b last:border-b-0">
                  <div className="flex items-start gap-3">
                    <Link to={`/profile/${comment.user?._id || '#'}`} onClick={(e) => e.stopPropagation()}>
                      <Avatar
                        src={comment.user?.profilePicture || comment.user?.avatar}
                        alt={comment.user?.username || comment.user?.name || "Anonymous"}
                        size="small"
                      />
                    </Link>
                    <div className="flex-1">
                      <div className="bg-gray-50 rounded-lg px-4 py-2">
                        <Link
                          to={`/profile/${comment.user?._id || '#'}`}
                          className="font-medium text-gray-900 hover:text-primary"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {comment.user?.username || comment.user?.name || "Anonymous"}
                        </Link>
                        <p className="text-gray-800 text-sm">{comment.text || comment.content}</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(comment.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                No comments yet. Be the first to comment!
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard; 