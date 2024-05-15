// API file
import client from "./client";

const endpoint = "/orders";

const placeOrder = (orderDetails) =>
  client.post(`${endpoint}/place-order`, orderDetails);

const getOrders = () => client.get(`${endpoint}`); // Adjusted endpoint

const cancelOrder = (id) => client.delete(`${endpoint}/cancel-order/${id}`);

const userOrders = (userId) => client.get(`${endpoint}/user/${userId}`); // Accept userId as parameter

const storeOrders = () => client.get(`${endpoint}/store-orders`);

const virtualOrder = (virtualOrder) =>
  client.post(`${endpoint}/place-virtual-order`, virtualOrder);

export default {
  placeOrder,
  getOrders,
  cancelOrder,
  userOrders,
  storeOrders,
  virtualOrder,
};
