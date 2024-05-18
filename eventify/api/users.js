import client from "./client";

const endpoint = "/user";

const registerUser = (user) => client.post(`${endpoint}/create-user`, user);
const uploadAvatar = (image) => client.post(`${endpoint}/uploadAvatar`, image);
const getUserById = (userId) => client.get(`${endpoint}/${userId}`);
const registerSeller = (seller) =>
  client.post(`${endpoint}/create-seller`, seller);
const loginUser = (credentials) =>
  client.post(`${endpoint}/login-user`, credentials);
const forgotPassword = (email) =>
  client.post(`${endpoint}/forgot-password`, { email });

const updateUserInterests = (userId, selectedInterests) =>
  client.put(`${endpoint}/${userId}/interests`, {
    interests: selectedInterests,
  });

const verifyOtpAndResetPassword = (email, securityCode, newPassword) =>
  client.post(`${endpoint}/verify-otp-and-reset-password`, {
    email,
    securityCode,
    newPassword,
  });

const updateUser = (userEmail, updatedUserData) =>
  client.patch(`${endpoint}/update/${userEmail}`, updatedUserData);

const resendSecurityCode = (email) =>
  client.post(`${endpoint}/resend-security-code`, { email });

export default {
  getUserById,
  registerUser,
  registerSeller,
  loginUser,
  forgotPassword,
  verifyOtpAndResetPassword,
  resendSecurityCode,
  updateUser,
  uploadAvatar,
  updateUserInterests,
};
