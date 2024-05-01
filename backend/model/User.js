const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name!"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email!"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minLength: [4, "Password should be greater than 4 characters"],
    select: false,
  },
  phoneNumber: {
    type: String,
  },
  address: {
    type: String,
  },
  role: {
    type: String,
    default: "user",
  },
  businessName: {
    type: String,
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organizer",
  },
  avatar: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  resetPasswordToken: String,
  resetPasswordTime: Date,
  securityCode: String,
  securityCodeExpires: Date,
  sex: String,
  profession: String,
});

//  Hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
});

// jwt token
userSchema.methods.getJwtToken = function () {
  const JWT_SECRET_KEY = config.get("JWT_SECRET_KEY");
  const JWT_EXPIRES = config.get("JWT_EXPIRES");

  return jwt.sign({ id: this._id }, JWT_SECRET_KEY, {
    expiresIn: JWT_EXPIRES,
  });
};

// compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Update your user model to include the reset token and expiration time
userSchema.methods.generateResetToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Set token expiration time (e.g., 1 hour)
  this.resetPasswordTime = Date.now() + 3600000;

  // Save token in the user document
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  return resetToken;
};
module.exports = mongoose.model("User", userSchema);
