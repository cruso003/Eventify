import client from "./client";

const endpoint = "./organizer";
const organizerEndpoint = "./organizer/organizerName";

const getOrganizerByName = (organizer) =>
  client.get(`${storeEndpoint}/${organizer}`);
const getOrganizerById = (organizerId) =>
  client.get(`${endpoint}/${organizerId}`);

export default {
  getOrganizerByName,
  getOrganizerById,
};
