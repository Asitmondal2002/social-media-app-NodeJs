import React from "react";
import { Link } from "react-router-dom";

// Assuming you have a PostCard component - if not, this includes a simple implementation
const PostCard = ({ post }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center mb-3">
        <img
          src={post.author?.avatar || "/default-avatar.png"}
          alt={post.author?.name || "User"}
          className="w-10 h-10 rounded-full mr-3"
        />
        <div>
          <Link
            to={`/profile/${post.author?.id || "unknown"}`}
            className="font-medium hover:underline"
          >
            {post.author?.name || "Unknown User"}
          </Link>
          <p className="text-xs text-gray-500">
            {new Date(post.createdAt).toLocaleString()}
          </p>
        </div>
      </div>

      <Link to={`/post/${post.id}`}>
        <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
        <p className="text-gray-700 mb-3">{post.content}</p>

        {post.image && (
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-auto rounded-lg mb-3"
          />
        )}
      </Link>

      <div className="flex justify-between text-gray-500 text-sm border-t pt-3">
        <button className="flex items-center">
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
            ></path>
          </svg>
          {post.likes || 0} Likes
        </button>
        <button className="flex items-center">
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
            ></path>
          </svg>
          {post.comments?.length || 0} Comments
        </button>
        <button className="flex items-center">
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            ></path>
          </svg>
          Share
        </button>
      </div>
    </div>
  );
};

// Main PostList component with additional checks
const PostList = ({ posts }) => {
  // Check if posts is an array, and if not, convert to empty array
  const postsArray = Array.isArray(posts) ? posts : [];

  if (postsArray.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <p className="text-gray-500">No posts to display yet.</p>
        <Link
          to="/create-post"
          className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded"
        >
          Create Your First Post
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {postsArray.map((post) => (
        <PostCard key={post.id || Math.random()} post={post} />
      ))}
    </div>
  );
};

export default PostList;
