import axiosInstance from '../utils/axiosConfig';
import { Post } from '../types/post'; // Ensure Post type exists

const API_URL = '/posts'; // Base API path for posts

// Fetch all posts
export const fetchPosts = async () => {
  const response = await axiosInstance.get<Post[]>(API_URL);
  return response.data;
};

// Fetch a single post by ID
export const fetchPostById = async (postId: string) => {
  const response = await axiosInstance.get<Post>(`${API_URL}/${postId}`);
  return response.data;
};

// Create a new post
export const createPost = async (postData: Partial<Post>) => {
  const response = await axiosInstance.post<Post>(API_URL, postData);
  return response.data;
};

// Update an existing post
export const updatePost = async (postId: string, updatedData: Partial<Post>) => {
  const response = await axiosInstance.put<Post>(`${API_URL}/${postId}`, updatedData);
  return response.data;
};

// Delete a post
export const deletePost = async (postId: string) => {
  const response = await axiosInstance.delete(`${API_URL}/${postId}`);
  return response.data;
};

// Like a post
export const likePost = async (postId: string) => {
  const response = await axiosInstance.post(`${API_URL}/${postId}/like`);
  return response.data;
};

// Comment on a post
export const commentOnPost = async (postId: string, commentData: { text: string }) => {
  const response = await axiosInstance.post(`${API_URL}/${postId}/comment`, commentData);
  return response.data;
};
