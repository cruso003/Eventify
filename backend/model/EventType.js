const mongoose = require("mongoose");

const eventTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: String,
  // Add other fields as needed
});

const EventType = mongoose.model("EventType", eventTypeSchema);

module.exports = EventType;
