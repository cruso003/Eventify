// controllers/cartItems.js
const CartItem = require("../model/Cart");

const getCartItems = async (req, res) => {
  try {
    const cartItems = await CartItem.find({ user: req.params.userId });
    res.json(cartItems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createCartItem = async (req, res) => {
  const cartItem = new CartItem({
    user: req.body.user,
    event: req.body.event,
    ticketName: req.body.ticket.name,
    ticketId: req.body.ticketId,
    salePrice: req.body.salePrice,
  });

  try {
    const newCartItem = await cartItem.save();
    res.status(201).json(newCartItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteCartItem = async (req, res) => {
  try {
    await CartItem.findByIdAndRemove(req.params.id);
    res.json({ message: "Cart item deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteCartItems = async (req, res) => {
  try {
    const itemIds = req.body.itemIds; // Assuming the client sends an array of item IDs to delete

    // Find and delete multiple cart items
    await CartItem.deleteMany({ _id: { $in: itemIds } });

    res.json({ message: "Cart items deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getCartItems,
  createCartItem,
  deleteCartItem,
  deleteCartItems,
};
