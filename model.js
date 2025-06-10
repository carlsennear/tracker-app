const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  latitude: Number,
  longitude: Number,
  photo: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Log", logSchema);
