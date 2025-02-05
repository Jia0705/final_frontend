import axios from "axios";
import { toast } from "sonner";
import { API_URL } from "../constants";

// (public api)
export const getCategories = async () => {
  try {
    const response = await axios.get(API_URL + "/categories");
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const addNewCategory = async (name, token) => {
  try {
    const response = await axios.post(
      API_URL + "/categories",
      {
        name,
      },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    return response.data;
  } catch (error) {
    toast.error(error.message);
  }
};

export const updateCategory = async (_id, name, token) => {
  try {
    const response = await axios.put(
      API_URL + `/categories/${_id}`,
      {
        name,
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

export const deleteCategory = async (_id, token) => {
  try {
    const response = await axios.delete(API_URL + `/categories/${_id}`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    return response.data;
  } catch (error) {
    toast.error(error.response.data.error);
  }
};
