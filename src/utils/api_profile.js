import axios from "axios";
import { toast } from "sonner";
import { API_URL } from "../constants";

// get user profile
export const getUserProfile = async (userId, token) => {
  try {
    const response = await axios.get(API_URL + "/profiles/" + userId, {
      headers: { Authorization: "Bearer " + token },
    });

    return response.data;
  } catch (error) {
    toast.error(error.response.data.error);
  }
};

// update user profile
export const updateUserProfile = async (userId, updatedData, token) => {
  try {
    const response = await axios.put(
      API_URL + "/profiles/" + userId,
      updatedData,
      {
        headers: { Authorization: "Bearer " + token },
      }
    );

    return response.data;
  } catch (error) {
    toast.error(error.response.data.error);
  }
};
