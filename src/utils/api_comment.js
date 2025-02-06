import axios from "axios";
import { toast } from "sonner";
import { API_URL } from "../constants";

// get comments 
export const getComments = async (productId) => {
  try {
    const response = await axios.get(API_URL + "/comments/product/" + productId);
    return response.data; 
  } catch (error) {
    toast.error(error.response.data.error);
  }
};

// add comment
export const addComment = async (
  productId, 
  userId, 
  comment, 
  token
) => {
  try {
    const response = await axios.post(
      API_URL + "/comments", 
      { 
        product: productId,
        user: userId, 
        comment: comment },
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

// update comment 
export const editComment = async (
  commentId, 
  comment, 
  token
) => {
  try {
    const response = await axios.put(
      API_URL + "/comments/" + commentId,
      { 
        comment: comment 
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

// delete comment 
export const deleteComment = async (commentId, token) => {
  try {
    const response = await axios.delete(API_URL + `/comments/${commentId}`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    return response.data; 
  } catch (error) {
    toast.error(error.response.data.error);
  }
};