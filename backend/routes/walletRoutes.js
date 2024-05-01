// walletRoutes.js
const express = require("express");
const router = express.Router();
const walletController = require("../controllers/walletController");

// Define routes
router.post("/create-wallet", walletController.createWallet);
router.get("/balance/:userId", walletController.getWalletBalance);
router.post("/update-balance/:userId", walletController.updateWalletBalance);
router.get("/transactions/:userId", walletController.getTransactionHistory); // Add this route

module.exports = router;
