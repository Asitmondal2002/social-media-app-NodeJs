import axios from '../utils/axiosConfig';
import { User } from '../types/user'; // Define User type in `types/user.ts`

const API_URL = '/auth'; // Base API path for authentication

/**
 * User Login
 * @param email - User email
 * @param password - User password
 */
export const login = async (email: string, password: string): Promise<User> => {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data)); // Save user session
  }
  return response.data;
};

/**
 * User Signup (Register)
 * @param name - User full name
 * @param email - User email
 * @param password - User password
 */
export const signup = async (name: string, email: string, password: string): Promise<User> => {
  const response = await axios.post(`${API_URL}/signup`, { name, email, password });
  return response.data;
};

/**
 * Logout user (Clear session)
 */
export const logout = (): void => {
  localStorage.removeItem('user');
};

/**
 * Get current user from local storage
 */
export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

/**
 * Reset Password
 * @param email - User email
 */
export const resetPassword = async (email: string): Promise<void> => {
  await axios.post(`${API_URL}/reset-password`, { email });
};

/**
 * Change Password
 * @param userId - ID of the user
 * @param oldPassword - Current password
 * @param newPassword - New password
 */
export const changePassword = async (userId: string, oldPassword: string, newPassword: string): Promise<void> => {
  await axios.post(`${API_URL}/change-password`, { userId, oldPassword, newPassword });
};
