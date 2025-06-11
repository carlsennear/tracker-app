const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

// Setup express
const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json({ limit: "25mb" })); // Penting untuk gambar base64
app.use(express.static(path.join(__dirname)));

// Koneksi ke MongoDB
const mongoURI = process.env.MONGODB_URI || "mongodb+srv://argovesta:Tirtayasa2024@argovesta.jqazjpd.mongodb.net/tracker?retryWrites=true&w=majority&appName=argovesta";

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Terhubung ke MongoDB"))
.catch((err) => console.error("❌ Gagal konek MongoDB:", err));

// Schema & Model
const logSchema = new mongoose.Schema({
  latitude: Number,
  longitude: Number,
  photo: String,
  timestamp: { type: Date, default: Date.now },
});

const Log = mongoose.model("Log", logSchema);

// Endpoint upload
app.post("/upload", async (req, res) => {
  console.log("📥 Data diterima:", req.body);

  try {
    const { latitude, longitude, photo } = req.body;

    if (!latitude || !longitude || !photo) {
      return res.status(400).send("Data tidak lengkap");
    }

    const newLog = new Log({ latitude, longitude, photo });
    await newLog.save();
    console.log("✅ Data berhasil disimpan ke MongoDB");

    res.send("Data berhasil disimpan");
  } catch (err) {
    console.error("❌ Gagal simpan data:", err);
    res.status(500).send("Server error");
  }
});

// Serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server jalan di http://localhost:${port}`);
});
