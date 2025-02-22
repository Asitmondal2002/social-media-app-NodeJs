// Home.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

interface Post {
  id: number;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  user: {
    id: number;
    name: string;
    avatar?: string;
  };
}

const Home: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await api.get('/posts', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setPosts(response.data);
    } catch (error) {
      toast.error('Failed to load posts.');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId: number) => {
    try {
      await api.post(`/posts/${postId}/like`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setPosts(posts.map(post =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      ));
      toast.success('Liked!');
    } catch (error) {
      toast.error('Failed to like post.');
    }
  };

  return (
    <div className="home-container">
      <h2>Home Feed</h2>
      {loading ? <p>Loading posts...</p> : (
        posts.length > 0 ? (
          <ul className="posts-list">
            {posts.map(post => (
              <li key={post.id} className="post-item">
                <div className="post-header">
                  <img 
                    src={post.user.avatar || '/default-avatar.png'} 
                    alt={post.user.name} 
                    className="post-avatar" 
                  />
                  <Link to={`/profile/${post.user.id}`} className="post-author">
                    {post.user.name}
                  </Link>
                </div>
                <p className="post-content">{post.content}</p>
                {post.image && <img src={post.image} alt="Post" className="post-image" />}
                <div className="post-actions">
                  <button onClick={() => handleLike(post.id)}>❤️ {post.likes}</button>
                  <Link to={`/post/${post.id}`}>💬 {post.comments} Comments</Link>
                </div>
              </li>
            ))}
          </ul>
        ) : <p>No posts yet. Start following people to see updates!</p>
      )}
    </div>
  );
};

export default Home;  // Keep the default export