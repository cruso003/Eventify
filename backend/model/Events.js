const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const ticketSchema = new mongoose.Schema({
  name: String,
  price: Number,
  qrIdentifier: {
    type: String,
    unique: true,
    default: uuidv4, // Automatically generate UUID for QR identifier
  },
});

const eventSchema = new mongoose.Schema({
  eventType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "EventType",
    required: true,
  },
  category: String,
  owner: {
    type: mongoose.Schema.Types.String,
    ref: "Organizer",
    required: true,
  },
  name: String,
  startingTime: Date,
  imageUrl: {
    type: String,
    required: true,
  },
  description: String,
  tickets: [ticketSchema],
  // Add fields for storing coordinates
  location: {
    type: { type: String },
    coordinates: [],
  },
});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
