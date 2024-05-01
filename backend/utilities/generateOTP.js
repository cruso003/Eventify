// utilities/generateOTP.js
const generateOTP = () => {
  // For simplicity, let's assume a function that generates a random 6-digit OTP
  return Math.floor(100000 + Math.random() * 900000).toString();
};

module.exports = generateOTP;
