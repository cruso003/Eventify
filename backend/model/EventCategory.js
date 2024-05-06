const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  eventType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "EventType",
    required: true,
  },
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
