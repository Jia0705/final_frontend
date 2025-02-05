import axios from "axios";
import { toast } from "sonner";
import { API_URL } from "../constants";

// ✅ Get all comments for a product
export const getComments = async (productId) => {
  try {
    const response = await axios.get(`${API_URL}/comments/product/${productId}`);
    return response.data.comments || []; // Ensure we always return an array
  } catch (error) {
    console.error("Error fetching comments:", error?.response?.data || error);
    toast.error(error?.response?.data?.error || "Failed to load comments.");
    return []; // Return an empty array on failure
  }
};

// ✅ Add a new comment
export const addComment = async (productId, userId, comment, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/comments`, 
      { product: productId, user: userId, comment },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    if (response.data.success) {
      toast.success("Comment added successfully!");
      return response.data.newComment; // Only return the new comment object
    } else {
      throw new Error("Unexpected response format.");
    }
  } catch (error) {
    console.error("Error adding comment:", error?.response?.data || error);
    toast.error(error?.response?.data?.error || "Failed to add comment.");
  }
};

// ✅ Update an existing comment
export const updateComment = async (commentId, comment, token) => {
  try {
    const response = await axios.put(
      `${API_URL}/comments/${commentId}`,
      { comment },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.updatedComment || null; // Ensure null is returned on failure
  } catch (error) {
    console.error("Error updating comment:", error?.response?.data || error);
    toast.error(error?.response?.data?.error || "Failed to update comment.");
    return null; // Explicitly return null to prevent frontend crashes
  }
};

// ✅ Delete a comment
export const deleteComment = async (commentId, token) => {
  try {
    console.log(`API CALL: DELETE /comments/${commentId}`); // Debugging

    const response = await axios.delete(`${API_URL}/comments/${commentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-User-Role": "admin", // ✅ Send userRole in headers (Backend will read this)
      },
    });

    if (response.data.success) {
      toast.success(response.data.message || "Comment deleted successfully.");
      return true; // ✅ Indicate success
    } else {
      console.error("Delete API failed:", response.data);
      throw new Error("Unexpected API response");
    }
  } catch (error) {
    console.error("Error deleting comment:", error?.response?.data || error);
    toast.error(error?.response?.data?.error || "Failed to delete comment.");
    return false; // ✅ Indicate failure
  }
};

