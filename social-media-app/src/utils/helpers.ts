import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from './constants';

/**
 * Format date to a readable format (e.g., "January 1, 2025")
 */
export const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

/**
 * Save token to local storage
 */
export const saveAuthTokens = (accessToken: string, refreshToken?: string): void => {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
};

/**
 * Retrieve access token from local storage
 */
export const getAccessToken = (): string | null => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

/**
 * Remove authentication tokens from local storage (for logout)
 */
export const clearAuthTokens = (): void => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength (At least 8 characters, one uppercase, one lowercase, one number)
 */
export const isStrongPassword = (password: string): boolean => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

/**
 * Shorten text to a specified length and add "..." if it's too long
 */
export const truncateText = (text: string, maxLength: number): string => {
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

/**
 * Convert API response errors to a readable format
 */
export const extractErrorMessage = (error: any): string => {
  if (error.response && error.response.data && error.response.data.message) {
    return error.response.data.message;
  }
  return 'Something went wrong. Please try again later.';
};

/**
 * Capitalize the first letter of each word in a string
 */
export const capitalizeWords = (text: string): string => {
  return text.replace(/\b\w/g, (char) => char.toUpperCase());
};

/**
 * Convert a number to a more readable format (e.g., 1.2K, 10M)
 */
export const formatNumber = (num: number): string => {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
  if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
  return num.toString();
};

