const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  latitude: String,
  longitude: String,
  photo: String, // base64 string
}, { timestamps: true });

module.exports = mongoose.model("Log", logSchema);
