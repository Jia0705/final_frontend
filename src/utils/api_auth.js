import axios from "axios";
import { toast } from "sonner";
import { API_URL } from "../constants";

// ✅ User Login
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    return response.data;
  } catch (error) {
    toast.error(error?.response?.data?.error || "Login failed. Please try again.");
    return null;
  }
};

// ✅ User Signup
export const signup = async (name, email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/signup`, { name, email, password });
    return response.data;
  } catch (error) {
    toast.error(error?.response?.data?.error || "Signup failed. Please try again.");
    return null;
  }
};

// ✅ Get Current User from Cookies
export const getCurrentUser = (cookies) => {
  return cookies?.currentUser || null;
};

// ✅ Check if a User is Logged In
export const isUserLoggedIn = (cookies) => {
  return Boolean(getCurrentUser(cookies));
};

// ✅ Check if User is an Admin
export const isAdmin = (cookies) => {
  const currentUser = getCurrentUser(cookies);
  return currentUser?.role === "admin";
};

// ✅ Get User Token from Cookies
export const getUserToken = (cookies) => {
  return getCurrentUser(cookies)?.token || "";
};

// ✅ Logout User (Remove User from Cookies)
export const logout = (setCookies) => {
  setCookies("currentUser", "", { path: "/", expires: new Date(0) });
  toast.success("Logged out successfully!");
};

// ✅ Get User Profile (Newly Added)
export const getUserProfile = async (userId, token) => {
  try {
    const response = await axios.get(`${API_URL}/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    toast.error(error?.response?.data?.error || "Failed to fetch user profile.");
    return null;
  }
};

// ✅ Update User Profile (Newly Added)
export const updateUserProfile = async (userId, formData, token) => {
  try {
    const response = await axios.put(`${API_URL}/users/${userId}`, formData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    toast.success("Profile updated successfully!");
    return response.data;
  } catch (error) {
    toast.error(error?.response?.data?.error || "Failed to update profile.");
    return null;
  }
};

// ✅ Change User Password (Newly Added)
export const changeUserPassword = async (userId, oldPassword, newPassword, token) => {
  try {
    const response = await axios.put(
      `${API_URL}/users/${userId}/change-password`,
      { oldPassword, newPassword },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    toast.success("Password changed successfully!");
    return response.data;
  } catch (error) {
    toast.error(error?.response?.data?.error || "Incorrect old password.");
    return null;
  }
};
