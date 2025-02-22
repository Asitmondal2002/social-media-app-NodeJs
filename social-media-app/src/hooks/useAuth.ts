import { useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  createdAt: string;
  followers?: number;
  following?: number;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface SignupCredentials extends LoginCredentials {
  name: string;
  confirmPassword: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

export const useAuth = () => {
  const navigate = useNavigate();
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const { user, setUser, isLoading, setIsLoading } = context;

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      const { user, token } = response.data;

      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      setUser(user);
      toast.success('Welcome back!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [navigate, setUser, setIsLoading]);

  const signup = useCallback(async (credentials: SignupCredentials) => {
    try {
      setIsLoading(true);
      if (credentials.password !== credentials.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      const response = await api.post<AuthResponse>('/auth/signup', {
        name: credentials.name,
        email: credentials.email,
        password: credentials.password
      });

      const { user, token } = response.data;

      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      setUser(user);
      toast.success('Account created successfully!');
      navigate('/profile/create');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [navigate, setUser, setIsLoading]);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    navigate('/login');
    toast.success('Logged out successfully');
  }, [navigate, setUser]);

  const updateProfile = useCallback(async (data: Partial<User>) => {
    try {
      setIsLoading(true);
      const response = await api.put<{ user: User }>('/users/profile', data);
      setUser(response.data.user);
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  }, [setUser, setIsLoading]);

  const changePassword = useCallback(async (oldPassword: string, newPassword: string) => {
    try {
      setIsLoading(true);
      await api.put('/auth/change-password', { oldPassword, newPassword });
      toast.success('Password changed successfully');
      navigate('/password-success');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setIsLoading(false);
    }
  }, [navigate, setIsLoading]);

  const refreshUser = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await api.get<{ user: User }>('/users/me');
      setUser(response.data.user);
    } catch (error) {
      localStorage.removeItem('token');
      setUser(null);
      navigate('/login');
    } finally {
      setIsLoading(false);
    }
  }, [navigate, setUser, setIsLoading]);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    updateProfile,
    changePassword,
    refreshUser
  };
};
