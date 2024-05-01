const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  name: String,
  description: String,
  images: [String],
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
      price: Number, // Price variation
    },
  ],
  condition: String,
  store: {
    type: mongoose.Schema.Types.String,
    ref: "Organizer",
    required: true,
  },
  qrCode: {
    type: String,
    required: true,
    unique: true,
  },
  ratings: [
    {
      user: String,
      rating: Number,
      comment: String,
    },
  ],
  featured: Boolean,
  total_sell: Number,
  stock: Number,
  brand: String,
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

const Ticket = mongoose.model("Ticket", ticketSchema);

module.exports = Ticket;
