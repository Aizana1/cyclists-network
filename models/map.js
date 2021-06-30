const mongoose = require("mongoose");

const mapSchema = new mongoose.Schema({
  name: String,
  coords: Array,
  length: String,
  locality: String,
  rating: Array,
  description: String,
  author: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
});

module.exports = mongoose.model("Map", mapSchema);
