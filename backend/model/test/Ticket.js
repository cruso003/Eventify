const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  discount_price: Number,
  category: {
    type: mongoose.Schema.Types.String,
    ref: "Category",
    required: true,
  },
  variations: [
    {
      name: String,
      options: [String],
      price: String, // Price variation
    },
  ],
  qrCode: {
    type: String,
    required: true,
    unique: true,
  },
  total_sell: Number,
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

const Tickets = mongoose.model("Ticket", ticketSchema);

module.exports = Tickets;
