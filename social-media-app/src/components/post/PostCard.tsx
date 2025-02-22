import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/common/Button';
import { Avatar } from '../../components/common/Avatar';
//import { useAuth } from '../hooks/useAuth';

interface Author {
  id: string;
  name: string;
  avatar?: string;
}

interface Comment {
  id: string;
  content: string;
  author: Author;
  createdAt: string;
}

interface Post {
  id: string;
  content: string;
  image?: string;
  createdAt: string;
  author: Author;
  likes: number;
  comments: Comment[];
  liked: boolean;
}

interface PostCardProps {
  post: Post;
  onLike: (id: string) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  onComment: (id: string, content: string) => Promise<void>;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onLike,
  onDelete,
  onComment
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLiking, setIsLiking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const isAuthor = user?.id === post.author.id;

  const handleLike = async () => {
    try {
      setIsLiking(true);
      await onLike(post.id);
    } catch (error) {
      console.error('Error liking post:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        setIsDeleting(true);
        await onDelete(post.id);
      } catch (error) {
        console.error('Error deleting post:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim()) return;

    try {
      setIsSubmittingComment(true);
      await onComment(post.id, commentContent);
      setCommentContent('');
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Post Header */}
      <div className="p-4 flex items-center justify-between border-b">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${post.author.id}`}>
            <Avatar
              src={post.author.avatar}
              alt={post.author.name}
              size="medium"
            />
          </Link>
          <div>
            <Link
              to={`/profile/${post.author.id}`}
              className="font-medium text-gray-900 hover:text-primary"
            >
              {post.author.name}
            </Link>
            <p className="text-sm text-gray-500">{formatDate(post.createdAt)}</p>
          </div>
        </div>
        
        {isAuthor && (
          <div className="flex gap-2">
            <Button
              onClick={() => navigate(`/post/edit/${post.id}`)}
              variant="outline"
              className="text-sm"
            >
              Edit
            </Button>
            <Button
              onClick={handleDelete}
              variant="secondary"
              className="text-sm"
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        )}
      </div>

      {/* Post Content */}
      <div className="p-4">
        <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>
        {post.image && (
          <img
            src={post.image}
            alt="Post content"
            className="mt-4 rounded-lg w-full object-cover max-h-96"
          />
        )}
      </div>

      {/* Post Actions */}
      <div className="px-4 py-3 border-t flex items-center gap-6">
        <button
          onClick={handleLike}
          disabled={isLiking}
          className={`flex items-center gap-2 text-sm ${
            post.liked ? 'text-primary' : 'text-gray-600'
          } hover:text-primary transition-colors`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill={post.liked ? 'currentColor' : 'none'}
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
          <span>{post.likes} {post.likes === 1 ? 'Like' : 'Likes'}</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors"
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
          <span>{post.comments.length} {post.comments.length === 1 ? 'Comment' : 'Comments'}</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="border-t">
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
            {post.comments.map((comment) => (
              <div key={comment.id} className="p-4 border-b last:border-b-0">
                <div className="flex items-start gap-3">
                  <Link to={`/profile/${comment.author.id}`}>
                    <Avatar
                      src={comment.author.avatar}
                      alt={comment.author.name}
                      size="small"
                    />
                  </Link>
                  <div className="flex-1">
                    <div className="bg-gray-50 rounded-lg px-4 py-2">
                      <Link
                        to={`/profile/${comment.author.id}`}
                        className="font-medium text-gray-900 hover:text-primary"
                      >
                        {comment.author.name}
                      </Link>
                      <p className="text-gray-800 text-sm">{comment.content}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate(comment.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};