// Banner.js (models/Banner.js)
const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  linkedProducts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
});

const Banner = mongoose.model("Banner", bannerSchema);

module.exports = Banner;
