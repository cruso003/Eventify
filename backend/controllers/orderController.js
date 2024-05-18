const Event = require("../model/Events");
const Order = require("../model/Orders");
const User = require("../model/User");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

// Controller for handling order-related operations

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const order = new Order(req.body);
    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Controller to fetch names of users by their IDs
exports.getUsersByIds = catchAsyncErrors(async (req, res) => {
  console.log(req);
  const { userIds } = req.body;
  console.log(req.body, "req.body");
  console.log(userIds, "userIds");
  try {
    // Fetch users with the given IDs
    const users = await User.find({ _id: { $in: userIds } });
    console.log(users, "users");
    // Extract and return user names
    const userNames = users.map((user) => user.name);
    console.log(userNames, "userNames");
    res.json(userNames);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// Get order by QR identifier
exports.getOrderbyQRIdentifier = async (req, res) => {
  const qrIdentifier = req.params.qrIdentifier;

  try {
    // Find the event by QR identifier
    const event = await Event.findOne({ "tickets.qrIdentifier": qrIdentifier });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Find the ticket within the event
    const ticket = event.tickets.find((t) => t.qrIdentifier === qrIdentifier);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Find the order that contains the ticket
    const order = await Order.findOne({ "tickets.ticketId": ticket._id });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get orders for a specific user
exports.getOrdersByUserId = async (req, res) => {
  const userId = req.params.userId;

  try {
    const orders = await Order.find({ user: userId });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an order by ID
exports.updateOrderById = async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(updatedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete an order by ID
exports.deleteOrderById = async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
