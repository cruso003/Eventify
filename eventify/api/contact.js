import client from "./client";

const sendMail = ({ name, email, message }) =>
  client.post("/contact", { name, email, message });

export default {
  sendMail,
};
