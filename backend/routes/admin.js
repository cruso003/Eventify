const express = require("express");
const User = require("../model/User");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { upload } = require("../multer");
const sendToken = require("../utilities/jwtToken");
const { isAuthenticated } = require("../middleware/admin");
const config = require("config");
const sendActivationEmail = require("../utilities/sendActivationEmail");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

// Use the middleware before your route handler
router.post("/create-admin", upload.none(), async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if the required fields are provided
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email, and password",
      });
    }

    // Check if the admin already exists
    const existingAdmin = await User.findOne({ email, role: "admin" });

    if (existingAdmin) {
      return res
        .status(400)
        .json({ success: false, message: "Admin already exists" });
    }

    // Create the admin user
    const admin = await User.create({
      name,
      email,
      password,
      role: "admin", // Set the role explicitly
    });

    const activationToken = createActivationToken(admin);

    const activationUrl = `http://localhost:3000/activation/${activationToken}`;

    try {
      await sendActivationEmail(admin.email, activationUrl);
      return res.status(201).json({
        success: true,
        message: `Please check your email:- ${admin.email} to activate your account`,
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
});

// create activation token
const createActivationToken = (admin) => {
  const payload = {
    id: admin.id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
  };
  return jwt.sign(
    payload,
    process.env.ACTIVATION_SECRET || config.get("ACTIVATION_SECRET"),
    {
      expiresIn: "5m",
    }
  );
};

// activate admin
router.post(
  "/activation/:activationToken",
  catchAsyncErrors(async (req, res) => {
    try {
      const { activationToken } = req.params;

      try {
        const decoded = jwt.verify(
          activationToken,
          process.env.ACTIVATION_SECRET || config.get("ACTIVATION_SECRET")
        );

        const { id, name, email, role } = decoded;

        let admin = await User.findById(id);

        if (!admin) {
          return res
            .status(400)
            .json({ success: false, message: "User not found" });
        }

        if (admin.role !== "admin") {
          return res
            .status(400)
            .json({ success: false, message: "Invalid user role" });
        }

        if (admin.isActivated) {
          return res
            .status(400)
            .json({ success: false, message: "Account already activated" });
        }

        // Update the user's status to activated
        admin.isActivated = true;
        await admin.save();

        // Respond with a success message, but no new token
        return res.status(200).json({
          success: true,
          message: "Account activated successfully",
        });
      } catch (error) {
        if (
          error.name === "JsonWebTokenError" &&
          error.message === "jwt expired"
        ) {
          // Token has expired
          return res
            .status(400)
            .json({ success: false, message: "Activation token expired" });
        } else {
          // Other token verification errors
          throw error;
        }
      }
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  })
);

// login admin
router.post(
  "/login-admin",
  catchAsyncErrors(async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Please enter both email and password",
        });
      }
      const admin = await User.findOne({ email }).select("+password");

      if (!admin) {
        return res
          .status(400)
          .json({ success: false, message: "Admin does not exist" });
      }

      const isPasswordValid = await admin.comparePassword(password);

      if (!isPasswordValid) {
        return res
          .status(403)
          .json({ success: false, message: "Incorrect Email or Password" });
      }

      sendToken(admin, 201, res);
    } catch (error) {
      return res
        .status(400)
        .json({ success: false, message: "Something went wrong" });
    }
  })
);

// get admin
router.get(
  "/getadmin",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const admin = await User.findById(req.admin.id);
      if (!admin) {
        return res
          .status(404)
          .json({ success: false, message: "No such admin found" });
      }
      res.status(200).json({
        success: true,
        admin,
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  })
);

// log out admin
router.get(
  "/logout",
  catchAsyncErrors(async (req, res, next) => {
    try {
      res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });
      res.status(201).json({
        success: true,
        message: "Log out successful!",
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  })
);

module.exports = router;
