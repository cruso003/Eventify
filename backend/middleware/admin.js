const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../model/User");
const ErrorHandler = require("../utilities/ErrorHandler");
const config = require("config");

exports.isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler("Please login to continue", 401));
  }
  const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET_KEY || config.get("JWT_SECRET_KEY")
  );

  req.user = await User.findById(decoded.id);

  next();
});
