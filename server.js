const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public")); // untuk serve index.html dari folder public

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Mongoose Schema
const logSchema = new mongoose.Schema({
  latitude: Number,
  longitude: Number,
  photo: String,
  timestamp: { type: Date, default: Date.now },
});

const Log = mongoose.model("Log", logSchema);

// Upload endpoint
app.post("/upload", async (req, res) => {
  try {
    const { latitude, longitude, photo } = req.body;
    if (!latitude || !longitude || !photo) {
      return res.status(400).json({ message: "Data tidak lengkap" });
    }

    const newLog = new Log({ latitude, longitude, photo });
    await newLog.save();
    res.status(200).json({ message: "Data disimpan!" });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
