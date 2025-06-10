const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const Log = require("./model");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname)); // Serve index.html

mongoose
  .connect(
    "mongodb+srv://argovesta:Tirtayasa2024@argovesta.jqazjpd.mongodb.net/argovesta?retryWrites=true&w=majority&appName=argovesta",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  )
  .then(() => console.log("✅ MongoDB terkoneksi!"))
  .catch((err) => console.error("❌ Gagal konek MongoDB:", err));

app.post("/upload", async (req, res) => {
  try {
    const { latitude, longitude, photo } = req.body;
    const log = new Log({ latitude, longitude, photo });
    await log.save();
    res.send("✅ Data disimpan!");
  } catch (err) {
    console.error(err);
    res.status(500).send("❌ Gagal simpan");
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server jalan di http://localhost:${PORT}`);
});
