import axios from "axios";
import client from "./client";
import authStorage from "../auth/storage";

const endpoint = "/cart";

const addToCart = (data) => client.post(endpoint, data);
const deleteCartItem = (id) => client.delete(`${endpoint}/${id}`);
const removeCartItems = async (userId, itemIds) => {
  try {
    const url = `https://app.tick8plus.com/api/cart/user/${userId}/deleteMultiple`;

    // Make the DELETE request and return the response
    const response = await axios.delete(url, {
      data: { itemIds }, 
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": await authStorage.getToken(),
      },
    });

    // Return the response for the caller to handle
    return response;
  } catch (error) {
    console.error("Error clearing cart after order:", error);
    throw error;
  }
};

const getUserCartItems = (userId) => client.get(`${endpoint}/user/${userId}`);

export default {
  addToCart,
  deleteCartItem,
  removeCartItems,
  getUserCartItems,
};
