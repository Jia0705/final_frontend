import axios from "axios";
import { toast } from "sonner";
import { API_URL } from "../constants";

// get bookmarks 
export const getBookmarks = async (userId, token) => {
  try {
    const response = await axios.get(API_URL + "/bookmarks?user=" + userId, {
      headers: {
        Authorization: "Bearer " + token, 
      },
    });
    return response.data; 
  } catch (error) {
    toast.error(error.response.data.error);
  }
};

// add bookmark
export const addBookmark = async (userId, productId, token) => {
  try {
    const response = await axios.post(
      API_URL + "/bookmarks",
      { 
        user: userId, 
        product: productId
      },
      {
        headers: {
          Authorization: "Bearer " + token, 
        },
      }
    );
    return response.data; 
  } catch (error) {
    toast.error(error.response.data.error);
  }
};

// remove bookmark
export const removeBookmark = async (
  userId,
  productId,
  token
  ) => {
  try {
    const response = await axios.delete(API_URL + "/bookmarks/" + productId, {
      headers: {
        Authorization: "Bearer " + token, 
      },
      data: { user: userId }, // Pass userId in the request body (for DELETE)
    });
    return response.data; 
  } catch (error) {
    toast.error(error.response.data.error);
  }
};
