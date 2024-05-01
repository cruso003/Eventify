// /backend/db/database.js
const mongoose = require("mongoose");
const config = require("config");

const connectToDatabase = async () => {
  try {
    const dbUri = config.get("dbUri");

    await mongoose.connect(dbUri);

    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
  }
};

// Export the connectToDatabase function
module.exports = { connectToDatabase };
