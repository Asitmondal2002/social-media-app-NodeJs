import axios from "axios";
import toast from "react-hot-toast";

// Base API configuration
const api = axios.create({
  baseURL:
    import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!error.response) {
      toast.error("Network error. Please check your internet connection.");
      return Promise.reject(error);
    }

    const { status, data } = error.response;

    if (status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
      toast.error("Session expired. Please login again.");
    } else if (status === 403) {
      toast.error("You do not have permission to perform this action.");
    } else if (status === 404) {
      toast.error("Resource not found.");
    } else if (status === 422 && data.errors) {
      Object.values(data.errors).forEach((errorMessages) => {
        errorMessages.forEach((message) => toast.error(message));
      });
    } else if (status === 500) {
      toast.error("Server error. Please try again later.");
    }

    return Promise.reject(error);
  }
);

// API endpoints
export const endpoints = {
  auth: {
    login: "/auth/login",
    signup: "/auth/signup",
    logout: "/auth/logout",
    changePassword: "/auth/change-password",
  },
  users: {
    profile: "/users/profile",
    updateProfile: "/users/profile",
    getUser: (userId) => `/users/${userId}`,
    follow: (userId) => `/users/${userId}/follow`,
    unfollow: (userId) => `/users/${userId}/unfollow`,
    search: "/users/search",
  },
  posts: {
    create: "/posts",
    list: "/posts",
    feed: "/posts/feed",
    single: (postId) => `/posts/${postId}`,
    update: (postId) => `/posts/${postId}`,
    delete: (postId) => `/posts/${postId}`,
    like: (postId) => `/posts/${postId}/like`,
    unlike: (postId) => `/posts/${postId}/unlike`,
  },
  comments: {
    create: (postId) => `/posts/${postId}/comments`,
    list: (postId) => `/posts/${postId}/comments`,
    update: (postId, commentId) => `/posts/${postId}/comments/${commentId}`,
    delete: (postId, commentId) => `/posts/${postId}/comments/${commentId}`,
  },
};

// API service methods
export const apiService = {
  auth: {
    login: (data) => api.post(endpoints.auth.login, data),
    signup: (data) => api.post(endpoints.auth.signup, data),
    logout: () => api.post(endpoints.auth.logout),
    changePassword: (data) => api.put(endpoints.auth.changePassword, data),
  },
  users: {
    getProfile: () => api.get(endpoints.users.profile),
    updateProfile: (data) =>
      api.put(endpoints.users.updateProfile, data, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    getUser: (userId) => api.get(endpoints.users.getUser(userId)),
    follow: (userId) => api.post(endpoints.users.follow(userId)),
    unfollow: (userId) => api.post(endpoints.users.unfollow(userId)),
    search: (query) => api.get(`${endpoints.users.search}?q=${query}`),
  },
  posts: {
    create: (data) =>
      api.post(endpoints.posts.create, data, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    list: (page = 1, limit = 10) =>
      api.get(`${endpoints.posts.list}?page=${page}&limit=${limit}`),
    getFeed: (page = 1, limit = 10) =>
      api.get(`${endpoints.posts.feed}?page=${page}&limit=${limit}`),
    getSingle: (postId) => api.get(endpoints.posts.single(postId)),
    update: (postId, data) =>
      api.put(endpoints.posts.update(postId), data, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    delete: (postId) => api.delete(endpoints.posts.delete(postId)),
    like: (postId) => api.post(endpoints.posts.like(postId)),
    unlike: (postId) => api.post(endpoints.posts.unlike(postId)),
  },
  comments: {
    create: (postId, content) =>
      api.post(endpoints.comments.create(postId), { content }),
    list: (postId, page = 1, limit = 10) =>
      api.get(`${endpoints.comments.list(postId)}?page=${page}&limit=${limit}`),
    update: (postId, commentId, content) =>
      api.put(endpoints.comments.update(postId, commentId), { content }),
    delete: (postId, commentId) =>
      api.delete(endpoints.comments.delete(postId, commentId)),
  },
};

export default api;
