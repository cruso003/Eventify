const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  tickets: [
    {
      ticket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ticket",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      selectedVariations: {
        type: Object,
      },
      totalAmount: {
        type: Number,
        required: true,
      },
      event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
      },
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  status: {
    type: String,
    default: "Pending",
    // You can use an enum to restrict possible values if needed
    enum: ["Pending", "Success", "Failed"],
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
  payment: {
    amount: Number,
    transactionId: {
      type: String,
      default: require("uuid").v4,
    },
  },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
