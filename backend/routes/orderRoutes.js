const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

// Routes for order-related operations

// Get all orders
router.get("/", orderController.getAllOrders);

// Create a new order
router.post("/place-order", orderController.createOrder);

// Get a single order by ID
router.get("/:id", orderController.getOrderById);

// Get orders for a specific user
router.get("/user/:userId", orderController.getOrdersByUserId);

router.get("/qr/:qrIdentifier", orderController.getOrderbyQRIdentifier);

// Update an order by ID
router.put("/:id", orderController.updateOrderById);

// Route to fetch user names by their IDs
router.post("/getUsersByIds", orderController.getUsersByIds);

// Delete an order by ID
router.delete("/:id", orderController.deleteOrderById);

module.exports = router;
