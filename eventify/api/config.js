import client from "./client";

const getApiKey = (ApiKey) => client.get("/v2/config", ApiKey);

export default {
  getApiKey,
};
