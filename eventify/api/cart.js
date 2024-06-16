import axios from "axios";
import client from "./client";
import authStorage from "../auth/storage";

const endpoint = "/cart";

const addToCart = (data) => client.post(endpoint, data);
const deleteCartItem = (id) => client.delete(`${endpoint}/${id}`);
const removeCartItems = async (userId, itemIds) => {
  try {
    const url = `http://54.158.28.163:8080//api/cart/user/${userId}/deleteMultiple`;

    // Make the DELETE request and return the response
    const response = await axios.delete(url, {
      data: { itemIds }, // Include the request body
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": await authStorage.getToken(), // Include authentication token
      },
    });

    // Return the response for the caller to handle
    return response;
  } catch (error) {
    console.error("Error clearing cart after order:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
};

const getUserCartItems = (userId) => client.get(`${endpoint}/user/${userId}`);

export default {
  addToCart,
  deleteCartItem,
  removeCartItems, // Export the new function
  getUserCartItems,
};
