/**
 * Validate an email address format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate a strong password
 * Must be at least 8 characters long, contain one uppercase letter, one lowercase letter, and one number.
 */
export const isStrongPassword = (password: string): boolean => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

/**
 * Validate a username
 * Must be 3-20 characters, only letters, numbers, underscores allowed
 */
export const isValidUsername = (username: string): boolean => {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
};

/**
 * Validate post content
 * Ensures post is not empty and within character limit (max 500 chars)
 */
export const isValidPostContent = (content: string): boolean => {
  return content.trim().length > 0 && content.trim().length <= 500;
};

/**
 * Validate comment content
 * Ensures comment is not empty and within character limit (max 300 chars)
 */
export const isValidComment = (comment: string): boolean => {
  return comment.trim().length > 0 && comment.trim().length <= 300;
};

/**
 * Validate a URL format (for profile picture, links, etc.)
 */
export const isValidURL = (url: string): boolean => {
  const urlRegex = /^(https?:\/\/)[^\s$.?#].[^\s]*$/;
  return urlRegex.test(url);
};

/**
 * Validate a bio (Max 150 characters)
 */
export const isValidBio = (bio: string): boolean => {
  return bio.length <= 150;
};

/**
 * Validate phone number format (10-digit numbers only)
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone);
};
