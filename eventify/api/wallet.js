// walletApi.js
import client from "./client";

const endpoint = "/wallet";

const createWallet = (userId) =>
  client.post(`${endpoint}/create-wallet`, { userId });
const getWalletBalance = (userId) =>
  client.get(`${endpoint}/balance/${userId}`);
const updateWalletBalance = (userId, amount) =>
  client.post(`${endpoint}/update-balance/${userId}`, { amount });

const transactions = (userId) =>
  client.get(`${endpoint}/transactions/${userId}`);

export default {
  createWallet,
  getWalletBalance,
  updateWalletBalance,
  transactions,
};
