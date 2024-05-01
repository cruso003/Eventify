import client from "./client";

const endpoint = "/categories";

const getCategories = () => client.get(endpoint);

export const addCategory = (categoryData) => {
  return client.post(endpoint, categoryData);
};

export default {
  addCategory,
  getCategories,
};
