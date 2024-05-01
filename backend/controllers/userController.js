const express = require("express");
const User = require("../model/User");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendToken = require("../utilities/jwtToken");
const sendSecurityCode = require("../utilities/sendSecurityCode");
const generateOTP = require("../utilities/generateOTP");
const Organizer = require("../model/Organizer");
const cloudinary = require("cloudinary").v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: "dl43pywkr",
  api_key: "541348946389798",
  api_secret: "v3V36QAwudb1yX-MwBypg5xBowQ",
});

// Endpoint to handle image uploads to Cloudinary
const uploadAvatar = catchAsyncErrors(async (req, res) => {
  try {
    // Access the uploaded file using req.file
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "User Avatars",
    });

    // Delete the temporary file created by multer
    fs.unlinkSync(req.file.path);

    res.json({ imageUrl: result.secure_url });
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get the user count
const getUserCount = catchAsyncErrors(async (req, res) => {
  const userCount = await User.countDocuments();
  res.json({ count: userCount });
});

// Create a new user
const createUser = catchAsyncErrors(async (req, res) => {
  const { name, email, password } = req.body;
  const userEmail = await User.findOne({ email });

  if (userEmail) {
    return res
      .status(400)
      .json({ success: false, message: "User already exists" });
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  sendToken(user, 201, res);
});

// Login user
const loginUser = catchAsyncErrors(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please enter both email and password",
    });
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return res
      .status(400)
      .json({ success: false, message: "User does not exist" });
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    return res
      .status(403)
      .json({ success: false, message: "Incorrect Email or Password" });
  }

  sendToken(user, 201, res);
});

// Get all users
const getAllUsers = catchAsyncErrors(async (req, res) => {
  const users = await User.find();
  res.status(200).json({ success: true, data: users });
});

// Get user by id
const getUserById = catchAsyncErrors(async (req, res) => {
  const users = await User.findById(req.params.userId);
  res.status(200).json({ success: true, data: users });
});

// Create organizer
const createOrganizer = catchAsyncErrors(async (req, res) => {
  const {
    name,
    email,
    password,
    businessName,
    phoneNumber,
    address,
    city,
    state,
  } = req.body;

  const userEmail = await User.findOne({ email });

  if (userEmail) {
    return res
      .status(400)
      .json({ success: false, message: "User already exists" });
  }

  const organizer = await User.create({
    name,
    email,
    password,
    businessName,
    phoneNumber,
    address,
    city,
    state,
    role: "organizer",
  });

  // Create a store for the seller
  const newOrganizer = new Organizer({
    name: name,
    owner: organizer._id,
    businessName: businessName, // Add the missing field
    phoneNumber: phoneNumber, // Add the missing field
    email: email,
    address: address,
    city: city,
    state: state,
    events: [],
    // Add other store-related fields as needed
  });

  await newOrganizer.save();

  sendToken(organizer, 201, res);
});

// Update user by email
const updateUserByEmail = catchAsyncErrors(async (req, res) => {
  const userEmail = req.params.email;
  const {
    name,
    password,
    businessName,
    phoneNumber,
    address,
    city,
    state,
    sex,
    profession,
    avatar,
  } = req.body;

  let user = await User.findOne({ email: userEmail });

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  // Update user fields if provided
  if (name) user.name = name;
  if (password) user.password = password;
  if (businessName) user.businessName = businessName;
  if (phoneNumber) user.phoneNumber = phoneNumber;
  if (address) user.address = address;
  if (city) user.city = city;
  if (state) user.state = state;
  if (avatar) user.avatar = avatar;
  if (sex) user.sex = sex;
  if (profession) user.profession = profession;

  await user.save();

  res.status(200).json({
    success: true,
    message: "User updated successfully",
    data: user,
  });
});

// Forgot password route
const forgotPassword = catchAsyncErrors(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  // Generate security code
  const securityCode = generateOTP();

  // Save security code and set expiration time to 30 minutes
  user.securityCode = securityCode;
  user.securityCodeExpires = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

  await user.save();

  // Send security code email
  await sendSecurityCode(user.email, securityCode);

  res.status(200).json({
    success: true,
    message: "Security code sent to your email",
  });
});

// OTP verification and password reset route
const verifyOtpAndResetPassword = catchAsyncErrors(async (req, res) => {
  const { email, securityCode, newPassword } = req.body;

  // Find the user by email
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  // Check if the security code is correct and not expired
  if (
    user.securityCode.trim() !== securityCode.trim() ||
    user.securityCodeExpires < Date.now()
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid or expired security code",
    });
  }

  // Update the user's password
  user.password = newPassword;
  await user.save();

  // Return a success response
  res
    .status(200)
    .json({ success: true, message: "Password reset successfully" });
});

// Resend security code route
const resendSecurityCode = catchAsyncErrors(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  // Check if the previous security code is still valid
  if (user.securityCode && user.securityCodeExpires > Date.now()) {
    return res.status(400).json({
      success: false,
      message: "Security code still valid. Please use the existing code.",
    });
  }

  // Generate a new security code
  const newSecurityCode = generateOTP();

  // Save the new security code and expiration time in the user document
  user.securityCode = newSecurityCode;
  user.securityCodeExpires = Date.now() + 30 * 60 * 1000; // 30 minutes

  await user.save();

  // Resend the new security code
  await sendSecurityCode(user.email, newSecurityCode);

  res.status(200).json({
    success: true,
    message: "New security code sent to your email",
  });
});

// Delete user by email
const deleteUserByEmail = catchAsyncErrors(async (req, res) => {
  const userEmail = req.params.email;

  const user = await User.findOne({ email: userEmail });

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  await user.deleteOne();

  res.status(200).json({ success: true, message: "User deleted successfully" });
});

module.exports = {
  uploadAvatar,
  getUserCount,
  createUser,
  loginUser,
  getAllUsers,
  getUserById,
  createOrganizer,
  updateUserByEmail,
  forgotPassword,
  verifyOtpAndResetPassword,
  resendSecurityCode,
  deleteUserByEmail,
};
