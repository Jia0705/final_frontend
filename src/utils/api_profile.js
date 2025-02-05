import axios from "axios";
import { toast } from "sonner";
import { API_URL } from "../constants";

// ✅ Get user profile by ID
export const getUserProfile = async (userId, token) => {
  try {
    console.log(`🔍 Fetching profile for user ID: ${userId}`);

    const response = await axios.get(`${API_URL}/profile/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("✅ User Profile Response:", response.data);
    return response.data.user || null;
  } catch (error) {
    console.error("❌ Error fetching user profile:", error?.response?.data || error);
    toast.error(error?.response?.data?.error || "Failed to load user profile.");
    return null;
  }
};

// ✅ Update user profile (name, email)
export const updateUserProfile = async (userId, updatedData, token) => {
  try {
    console.log(`🔍 Sending PUT request to: ${API_URL}/profile/${userId}`);

    const response = await axios.put(
      `${API_URL}/profile/${userId}`, // ✅ Corrected API endpoint
      updatedData,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log("✅ User profile updated:", response.data);
    return response.data.updatedUser;
  } catch (error) {
    console.error("❌ Error updating profile:", error?.response?.data || error);
    toast.error(error?.response?.data?.error || "Failed to update profile.");
    return null;
  }
};
