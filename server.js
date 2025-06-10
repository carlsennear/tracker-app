const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const Log = require("./model");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname)); // Serve index.html dari root folder

// Koneksi MongoDB Atlas
mongoose
  .connect(
    "mongodb+srv://argovesta:Tirtayasa2024@argovesta.jqazjpd.mongodb.net/argovesta?retryWrites=true&w=majority&appName=argovesta",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("✅ MongoDB terkoneksi!"))
  .catch((err) => console.error("❌ Gagal konek MongoDB:", err));

// Endpoint POST untuk simpan data
app.post("/upload", async (req, res) => {
  try {
    console.log("📥 Request body:", req.body); // Log data masuk

    const { latitude, longitude, photo } = req.body;

    // Validasi data
    if (!latitude || !longitude || !photo) {
      console.warn("⚠️ Data tidak lengkap:", { latitude, longitude, photo });
      return res.status(400).send("❌ Data tidak lengkap");
    }

    const log = new Log({ latitude, longitude, photo });
    await log.save();

    console.log("✅ Data berhasil disimpan ke MongoDB!");
    res.send("✅ Data disimpan!");
  } catch (err) {
    console.error("❌ Gagal simpan ke MongoDB:", err);
    res.status(500).send("❌ Gagal simpan");
  }
});

// Serve file HTML
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Jalankan server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server jalan di http://localhost:${PORT}`);
});
