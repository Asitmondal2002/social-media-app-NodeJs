import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import toast from 'react-hot-toast';

// Base API configuration
const api: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types for API responses
export interface ApiResponse<T = any> {
  data: T;
  message: string;
  success: boolean;
}

export interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError<ErrorResponse>) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      // If token refresh fails or user is not authenticated
      localStorage.removeItem('token');
      window.location.href = '/login';
      toast.error('Session expired. Please login again.');
      return Promise.reject(error);
    }

    // Handle 403 Forbidden errors
    if (error.response?.status === 403) {
      toast.error('You do not have permission to perform this action');
      return Promise.reject(error);
    }

    // Handle 404 Not Found errors
    if (error.response?.status === 404) {
      toast.error('Resource not found');
      return Promise.reject(error);
    }

    // Handle 422 Validation errors
    if (error.response?.status === 422) {
      const errors = error.response.data.errors;
      if (errors) {
        Object.values(errors).forEach((errorMessages) => {
          errorMessages.forEach((message) => toast.error(message));
        });
      }
      return Promise.reject(error);
    }

    // Handle 500 Server errors
    if (error.response?.status === 500) {
      toast.error('Server error. Please try again later.');
      return Promise.reject(error);
    }

    // Handle network errors
    if (!error.response) {
      toast.error('Network error. Please check your internet connection.');
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

// API endpoints interface
export const endpoints = {
  auth: {
    login: '/auth/login',
    signup: '/auth/signup',
    logout: '/auth/logout',
    refreshToken: '/auth/refresh-token',
    changePassword: '/auth/change-password',
  },
  users: {
    profile: '/users/profile',
    updateProfile: '/users/profile',
    getUser: (userId: string) => `/users/${userId}`,
    follow: (userId: string) => `/users/${userId}/follow`,
    unfollow: (userId: string) => `/users/${userId}/unfollow`,
    followers: (userId: string) => `/users/${userId}/followers`,
    following: (userId: string) => `/users/${userId}/following`,
    search: '/users/search',
  },
  posts: {
    create: '/posts',
    list: '/posts',
    feed: '/posts/feed',
    single: (postId: string) => `/posts/${postId}`,
    update: (postId: string) => `/posts/${postId}`,
    delete: (postId: string) => `/posts/${postId}`,
    like: (postId: string) => `/posts/${postId}/like`,
    unlike: (postId: string) => `/posts/${postId}/unlike`,
  },
  comments: {
    create: (postId: string) => `/posts/${postId}/comments`,
    list: (postId: string) => `/posts/${postId}/comments`,
    update: (postId: string, commentId: string) => `/posts/${postId}/comments/${commentId}`,
    delete: (postId: string, commentId: string) => `/posts/${postId}/comments/${commentId}`,
  },
};

// API service methods
export const apiService = {
  // Auth methods
  auth: {
    login: (data: { email: string; password: string }) => 
      api.post<ApiResponse>(endpoints.auth.login, data),
    
    signup: (data: { name: string; email: string; password: string }) =>
      api.post<ApiResponse>(endpoints.auth.signup, data),
    
    logout: () => api.post<ApiResponse>(endpoints.auth.logout),
    
    changePassword: (data: { oldPassword: string; newPassword: string }) =>
      api.put<ApiResponse>(endpoints.auth.changePassword, data),
  },

  // User methods
  users: {
    getProfile: () => api.get<ApiResponse>(endpoints.users.profile),
    
    updateProfile: (data: FormData) =>
      api.put<ApiResponse>(endpoints.users.updateProfile, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
    
    getUser: (userId: string) => api.get<ApiResponse>(endpoints.users.getUser(userId)),
    
    follow: (userId: string) => api.post<ApiResponse>(endpoints.users.follow(userId)),
    
    unfollow: (userId: string) => api.post<ApiResponse>(endpoints.users.unfollow(userId)),
    
    search: (query: string) => api.get<ApiResponse>(`${endpoints.users.search}?q=${query}`),
  },

  // Post methods
  posts: {
    create: (data: FormData) =>
      api.post<ApiResponse>(endpoints.posts.create, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
    
    list: (page = 1, limit = 10) =>
      api.get<ApiResponse>(`${endpoints.posts.list}?page=${page}&limit=${limit}`),
    
    getFeed: (page = 1, limit = 10) =>
      api.get<ApiResponse>(`${endpoints.posts.feed}?page=${page}&limit=${limit}`),
    
    getSingle: (postId: string) =>
      api.get<ApiResponse>(endpoints.posts.single(postId)),
    
    update: (postId: string, data: FormData) =>
      api.put<ApiResponse>(endpoints.posts.update(postId), data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
    
    delete: (postId: string) =>
      api.delete<ApiResponse>(endpoints.posts.delete(postId)),
    
    like: (postId: string) =>
      api.post<ApiResponse>(endpoints.posts.like(postId)),
    
    unlike: (postId: string) =>
      api.post<ApiResponse>(endpoints.posts.unlike(postId)),
  },

  // Comment methods
  comments: {
    create: (postId: string, content: string) =>
      api.post<ApiResponse>(endpoints.comments.create(postId), { content }),
    
    list: (postId: string, page = 1, limit = 10) =>
      api.get<ApiResponse>(`${endpoints.comments.list(postId)}?page=${page}&limit=${limit}`),
    
    update: (postId: string, commentId: string, content: string) =>
      api.put<ApiResponse>(endpoints.comments.update(postId, commentId), { content }),
    
    delete: (postId: string, commentId: string) =>
      api.delete<ApiResponse>(endpoints.comments.delete(postId, commentId)),
  },
};

export default api;