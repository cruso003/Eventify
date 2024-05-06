import client from "./client";

const endpoint = "/eventTypes";

const getEventtypes = () => client.get(endpoint);
const addEventTypes = (eventTypeData) => client.post(endpoint, eventTypeData);
export default {
  getEventtypes,
  addEventTypes,
};
