const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config(); // Optional, tapi tetap boleh kalau kamu develop lokal

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(express.static("public")); // Pastikan index.html ada di folder 'public'

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Terhubung ke MongoDB"))
  .catch((err) => console.error("❌ Gagal konek MongoDB:", err));

// Schema dan Model
const logSchema = new mongoose.Schema({
  latitude: Number,
  longitude: Number,
  photo: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Log = mongoose.model("Log", logSchema);

// Endpoint upload
app.post("/upload", async (req, res) => {
  try {
    const { latitude, longitude, photo } = req.body;
    console.log("📦 Data masuk:", { latitude, longitude, photo: photo?.slice(0, 30) + "..." });

    if (!latitude || !longitude || !photo) {
      console.log("⚠️ Data tidak lengkap!");
      return res.status(400).json({ message: "Data tidak lengkap" });
    }

    const newLog = new Log({ latitude, longitude, photo });
    await newLog.save();
    console.log("✅ Data disimpan ke MongoDB");
    res.status(200).json({ message: "Data disimpan!" });
  } catch (error) {
    console.error("❌ Error di /upload:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server jalan di port ${PORT}`);
});
