const mongoose = require("mongoose");

const eventTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: String,
  categories: [
    {
      name: String,
    },
  ],
});

const EventType = mongoose.model("EventType", eventTypeSchema);

module.exports = EventType;
