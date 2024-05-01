import client from "./client";

const endpoint = "/events";

const getEvents = () => client.get(`${endpoint}`);
const createEvent = (eventData) => client.post(`${endpoint}`, eventData);

export default {
  getEvents,
  createEvent,
};
