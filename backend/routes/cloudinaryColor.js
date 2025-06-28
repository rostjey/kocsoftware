const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary");
require("dotenv").config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.get("/api/dominant-color", async (req, res) => {
  const { public_id } = req.query;

  try {
    const result = await cloudinary.v2.api.resource(public_id, {
      colors: true,
    });

    const [dominant] = result.colors;
    const rgb = dominant[0]; // örn: [34, 56, 78]
    res.json({ dominantColor: `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})` });
  } catch (err) {
    console.error("Dominant color API error:", err);
    res.status(500).json({ error: "Color fetch failed" });
  }
});

module.exports = router;
