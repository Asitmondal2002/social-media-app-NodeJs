import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const UpdatePost = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<{ title: string; content: string }>({ title: '', content: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/api/posts/${postId}`);
        setPost(response.data);
      } catch (err) {
        setError('Failed to fetch post details.');
      }
    };

    fetchPost();
  }, [postId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setPost({ ...post, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.put(`/api/posts/${postId}`, post);
      if (response.data.success) {
        navigate(`/post/${postId}`);
      }
    } catch (err) {
      setError('Failed to update post.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="update-post-container">
      <h2>Edit Post</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" name="title" placeholder="Title" value={post.title} onChange={handleChange} required />
        <textarea name="content" placeholder="Content" value={post.content} onChange={handleChange} required />
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Updating...' : 'Update Post'}
        </button>
      </form>
    </div>
  );
};

export default UpdatePost;
