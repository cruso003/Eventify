const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");

// Routes for cart-related operations

// Get user's cart
router.get("/", cartController.getUserCart);

// Add item to user's cart
router.post("/add", cartController.addItemToCart);

// Remove item from user's cart
router.delete("/remove/:itemId", cartController.removeItemFromCart);

module.exports = router;
