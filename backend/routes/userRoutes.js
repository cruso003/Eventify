const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Routes for user-related operations

router.post("/uploadAvatar", userController.uploadAvatar);
router.get("/count", userController.getUserCount);
router.post("/create-user", userController.createUser);
router.post("/login-user", userController.loginUser);
router.get("/", userController.getAllUsers);
router.get("/:userId", userController.getUserById);
router.post("/create-organizer", userController.createOrganizer);
router.patch("/update/:email", userController.updateUserByEmail);
router.post("/forgot-password", userController.forgotPassword);
router.post(
  "/verify-otp-and-reset-password",
  userController.verifyOtpAndResetPassword
);
router.post("/resend-security-code", userController.resendSecurityCode);
router.delete("/:email", userController.deleteUserByEmail);

module.exports = router;
