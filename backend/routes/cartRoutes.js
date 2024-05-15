const express = require("express");
const router = express.Router();
const Cart = require("../model/Cart");

router.get("/user/:userId", async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.params.userId }).populate(
      "items.event"
    );
    if (cart) {
      res.json(cart.items);
    } else {
      res.json([]); // Return an empty array if cart does not exist
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  const { user, ticketName, ticketId, salePrice, event } = req.body;
  try {
    let cart = await Cart.findOne({ user });
    if (!cart) {
      // If cart doesn't exist for the user, create a new one
      cart = new Cart({
        user,
        items: [
          {
            ticketName,
            ticketId,
            salePrice,
            event,
          },
        ],
      });
    } else {
      // If cart exists, add the new item to the items array
      cart.items.push({
        event,
        salePrice,
        ticketName,
        ticketId,
      });
    }

    const updatedCart = await cart.save();
    res.status(201).json(updatedCart.items);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
// Delete a cart item
router.delete("/:id", async (req, res) => {
  try {
    const itemId = req.params.id;

    const updatedCart = await Cart.findOneAndUpdate(
      { "items._id": itemId }, // Find the cart item with the given ID within the items array
      { $pull: { items: { _id: itemId } } }, // Pull (remove) the item from the items array
      { new: true } // Return the updated document
    );

    if (!updatedCart) {
      console.log("Cart item not found");
      return res.status(404).json({ message: "Cart item not found" });
    }

    res.json({ message: "Cart item deleted" });
  } catch (err) {
    console.error("Error deleting cart item:", err);
    res.status(500).json({ message: err.message });
  }
});

router.delete("/user/:userId/deleteMultiple", async (req, res) => {
  try {
    const userId = req.params.userId;
    const itemIds = req.body.itemIds;

    // Find the user's cart based on the user ID
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Remove the items with the specified IDs from the cart
    cart.items = cart.items.filter(
      (item) => !itemIds.includes(item._id.toString())
    );

    // Save the updated cart
    const updatedCart = await cart.save();

    res.json({ message: "Cart items deleted" });
  } catch (err) {
    console.error("Error deleting cart items:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
