import { useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import toast from "react-hot-toast";

export const useAuth = () => {
  const navigate = useNavigate();
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  const { user, setUser, isLoading, setIsLoading } = context;

  const login = useCallback(
    async (credentials) => {
      try {
        setIsLoading(true);
        const response = await api.post("/auth/login", credentials);
        const { user, token } = response.data;

        localStorage.setItem("token", token);
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        setUser(user);
        toast.success("Welcome back!");
        navigate("/");
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Login failed. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    },
    [navigate, setUser, setIsLoading]
  );

  const signup = useCallback(
    async (credentials) => {
      try {
        setIsLoading(true);
        if (credentials.password !== credentials.confirmPassword) {
          throw new Error("Passwords do not match");
        }

        const response = await api.post("/auth/signup", {
          name: credentials.name,
          email: credentials.email,
          password: credentials.password,
        });

        const { user, token } = response.data;

        localStorage.setItem("token", token);
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        setUser(user);
        toast.success("Account created successfully!");
        navigate("/profile/create");
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Signup failed. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    },
    [navigate, setUser, setIsLoading]
  );

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
    navigate("/login");
    toast.success("Logged out successfully");
  }, [navigate, setUser]);

  const updateProfile = useCallback(
    async (data) => {
      try {
        setIsLoading(true);
        const response = await api.put("/users/profile", data);
        setUser(response.data.user);
        toast.success("Profile updated successfully");
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to update profile"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [setUser, setIsLoading]
  );

  const changePassword = useCallback(
    async (oldPassword, newPassword) => {
      try {
        setIsLoading(true);
        await api.put("/auth/change-password", { oldPassword, newPassword });
        toast.success("Password changed successfully");
        navigate("/password-success");
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to change password"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [navigate, setIsLoading]
  );

  const refreshUser = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const response = await api.get("/users/me");
      setUser(response.data.user);
    } catch (error) {
      localStorage.removeItem("token");
      setUser(null);
      navigate("/login");
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
    refreshUser,
  };
};
