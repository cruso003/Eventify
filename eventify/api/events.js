import client from "./client";

const endpoint = "/events";

const getEvents = () => client.get(`${endpoint}`);
const getEventById = (eventId) => client.get(`${endpoint}/${eventId}`);
const createEvent = (eventData) => client.post(`${endpoint}`, eventData);

export default {
  getEvents,
  getEventById,
  createEvent,
};
