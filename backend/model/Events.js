const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  type: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "EventType",
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.String,
    ref: "Category",
    required: true,
  },
  title: String,
  startingTime: Date,
  image: String,
  description: String,
  tickets: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
    },
  ],
});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
