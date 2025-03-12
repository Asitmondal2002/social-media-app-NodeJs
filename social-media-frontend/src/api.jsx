// In your frontend api.js file
const API_BASE_URL = "http://localhost:5000/api"; // Add the /api prefix

// Example axios instance
import axios from "axios";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Your API calls will now use the correct path
export const getUserProfile = async (userId) => {
  try {
    // This will call /api/users/:userId
    return await api.get(`/users/${userId}`);
  } catch (error) {
    console.error("API error response:", error.response?.status, error.message);
    throw error;
  }
};

export const getUserSuggestions = async () => {
  try {
    // This will call /api/users/suggestions
    return await api.get("/users/suggestions");
  } catch (error) {
    console.error("API error response:", error.message);
    throw error;
  }
};
