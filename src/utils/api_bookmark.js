import axios from "axios";
import { toast } from "sonner";
import { API_URL } from "../constants";

// Get all bookmarks
export const getBookmarks = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/bookmarks?user=${userId}`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error || "Error fetching bookmarks.";
    toast.error(errorMessage);
    console.error("Error fetching bookmarks:", error);
  }
};

// Add bookmark
export const addBookmark = async (userId, productId) => {
  try {
    const response = await axios.post(`${API_URL}/bookmarks`, {
      user: userId,
      product: productId,
    });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error || "Error adding bookmark.";
    toast.error(errorMessage);
    console.error("Error adding bookmark:", error);
  }
};

// Remove a product from bookmarks
export const removeBookmark = async (userId, productId) => {
  try {
    const response = await axios.delete(`${API_URL}/bookmarks/${productId}?user=${userId}`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error || "Error removing bookmark.";
    toast.error(errorMessage);
    console.error("Error removing bookmark:", error);
  }
};
