const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  content: String,
  author: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
  map: {type: mongoose.Schema.Types.ObjectId, ref: "Map"},
});

module.exports = mongoose.model("Review", reviewSchema);
