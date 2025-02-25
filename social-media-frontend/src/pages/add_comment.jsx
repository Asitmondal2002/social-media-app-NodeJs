import { useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api"; // Ensure correct import path
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";

const AddComment = ({ onCommentAdded }) => {
  const { user } = useAuth();
  const { postId } = useParams();
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  if (!postId) {
    return <div>Error: Post ID is missing!</div>;
  }

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setLoading(true);
    try {
      const response = await api.post(`/posts/${postId}/comments`, {
        text: comment,
        userId: user?.id,
      });

      setComment("");
      toast.success("Comment added successfully!");
      if (onCommentAdded) {
        onCommentAdded(response.data);
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Failed to add comment.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-comment">
      <form onSubmit={handleCommentSubmit}>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write a comment..."
          required
        ></textarea>
        <button type="submit" disabled={loading}>
          {loading ? "Posting..." : "Add Comment"}
        </button>
      </form>
    </div>
  );
};

export default AddComment;
