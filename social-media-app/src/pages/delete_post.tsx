import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

interface DeletePostProps {
  postId?: string; // Optional postId prop
  onClose?: () => void; // Optional close function
}

const DeletePost: React.FC<DeletePostProps> = ({ postId, onClose }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { postId: paramPostId } = useParams<{ postId: string }>();

  const finalPostId = postId || paramPostId; // Use either prop or URL param

  if (!finalPostId) {
    return <div>Error: Post ID is missing!</div>;
  }

  const handleDelete = async () => {
    try {
      await api.delete(`/posts/${finalPostId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      toast.success('Post deleted successfully!');
      navigate('/'); // Redirect to homepage
      onClose?.(); // Call onClose if it exists
    } catch (error) {
      const errorMessage =
        (error as any)?.response?.data?.message || 'Failed to delete post.';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="delete-post-modal">
      <h2>Are you sure you want to delete this post?</h2>
      <div className="actions">
        <button onClick={handleDelete} className="delete-btn">
          Delete
        </button>
        <button onClick={onClose} className="cancel-btn">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default DeletePost;
