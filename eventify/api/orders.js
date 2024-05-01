import client from "./client";

const endpoint = "/orders";

const placeOrder = (orderDetails) =>
  client.post(`${endpoint}/place-order`, orderDetails);
const getOrders = (orders) => client.get(`${endpoint}/get-orders`, orders);
const cancelOrder = (id) => client.delete(`${endpoint}/cancel-order/${id}`);
const userOrders = () => client.get(`${endpoint}/user-orders/`);
const storeOrders = () => client.get(`${endpoint}/store-orders`, storeOrders);
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
