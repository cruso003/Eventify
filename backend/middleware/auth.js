// auth.js - Modified for token-based authentication

const ErrorHandler = require("../utilities/ErrorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../model/user");
const config = require("config");

exports.isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const token = req.header("x-auth-token"); // Modify this line to get the token from headers

  if (!token) {
    return next(new ErrorHandler("Please login to continue", 401));
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY || config.get("JWT_SECRET_KEY")
    );
    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    res.status(400).send({ error: "Invalid token." });
  }
});
