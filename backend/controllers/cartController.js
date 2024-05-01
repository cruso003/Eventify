const Cart = require("../model/Cart");

// Controller for handling cart-related operations

// Get user's cart
exports.getUserCart = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming user ID is available in the request object
    const cart = await Cart.findOne({ user: userId }).populate("items.ticket");
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add item to user's cart
exports.addItemToCart = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming user ID is available in the request object
    const { ticketId, qty, selectedVariations } = req.body;

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      // If user doesn't have a cart, create one
      cart = new Cart({ user: userId, items: [] });
    }

    // Check if the item already exists in the cart
    const existingItemIndex = cart.items.findIndex(
      (item) => String(item.ticket._id) === ticketId
    );

    if (existingItemIndex !== -1) {
      // If the item already exists, update its quantity
      cart.items[existingItemIndex].qty += qty;
    } else {
      // If the item doesn't exist, add it to the cart
      cart.items.push({ ticket: ticketId, qty, selectedVariations });
    }

    await cart.save();

    res.status(201).json(cart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Remove item from user's cart
exports.removeItemFromCart = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming user ID is available in the request object
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Filter out the item to be removed
    cart.items = cart.items.filter((item) => String(item._id) !== itemId);

    await cart.save();

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
