// API Base URL
export const API_BASE_URL = 'https://your-api-url.com/api';

// Authentication
export const ACCESS_TOKEN_KEY = 'access_token';
export const REFRESH_TOKEN_KEY = 'refresh_token';
export const USER_PROFILE_KEY = 'user_profile';

// Default User Avatar (For users who haven't set an avatar)
export const DEFAULT_AVATAR_URL = '/assets/default-avatar.png';

// Post Limits & Pagination
export const POSTS_PER_PAGE = 10;
export const COMMENTS_PER_PAGE = 5;

// Routes (For easy navigation)
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  PROFILE: '/profile',
  OTHER_PROFILE: (userId: string) => `/profile/${userId}`,
  CREATE_POST: '/post/create',
  EDIT_PROFILE: '/profile/edit',
  FRIENDS: '/friends',
  SEARCH: '/search',
  CHANGE_PASSWORD: '/change-password',
};

// API Endpoints
export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth/login`,
  SIGNUP: `${API_BASE_URL}/auth/signup`,
  USER_PROFILE: (userId: string) => `${API_BASE_URL}/users/${userId}`,
  UPDATE_PROFILE: `${API_BASE_URL}/users/update`,
  CREATE_POST: `${API_BASE_URL}/posts/create`,
  DELETE_POST: (postId: string) => `${API_BASE_URL}/posts/${postId}/delete`,
  UPDATE_POST: (postId: string) => `${API_BASE_URL}/posts/${postId}/update`,
  GET_FRIENDS: `${API_BASE_URL}/friends`,
  SEARCH_USERS: (query: string) => `${API_BASE_URL}/users/search?q=${query}`,
  ADD_COMMENT: (postId: string) => `${API_BASE_URL}/posts/${postId}/comments/add`,
};

// Notification Messages
export const MESSAGES = {
  LOGIN_SUCCESS: 'Login successful! Redirecting...',
  SIGNUP_SUCCESS: 'Signup successful! Redirecting...',
  POST_CREATED: 'Post created successfully!',
  POST_UPDATED: 'Post updated successfully!',
  POST_DELETED: 'Post deleted successfully!',
  COMMENT_ADDED: 'Comment added successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  PASSWORD_CHANGED: 'Password changed successfully!',
  ERROR_OCCURRED: 'An error occurred. Please try again later.',
};

// Theme Modes
export const THEME_MODES = {
  LIGHT: 'light',
  DARK: 'dark',
};

