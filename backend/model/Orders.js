const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  tickets: [
    {
      ticketId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ticket",
        required: true,
      },
      ticketName: {
        type: String,
      },
      ticketPrice: {
        type: String,
      },
      quantity: {
        type: Number,
        required: true,
      },
      totalAmount: {
        type: Number,
        required: true,
      },
      event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
      },
      eventName: String,
      eventCategory: String,
      owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  status: {
    type: String,
    default: "Success",
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
