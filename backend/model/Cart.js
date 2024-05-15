const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  items: [
    {
      event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
        required: true,
      },
      qty: {
        type: Number,
        default: 1,
      },

      checked: {
        type: Boolean,
        default: true,
      },
      salePrice: {
        type: Number,
        required: true,
      },
      ticketName: {
        type: String,
        required: true,
      },
      ticketId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ticket",
        required: true,
      },
    },
  ],
});

const Cart = mongoose.model("Cart", CartSchema);

module.exports = Cart;
