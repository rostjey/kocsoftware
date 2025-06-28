const express = require("express");
const cloudinary = require("cloudinary");
require("dotenv").config();

const router = express.Router(); // ⬅️ express app değil, router objesi

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.get("/dominant-color", async (req, res) => {
  const { public_id } = req.query;

  try {
    const result = await cloudinary.v2.api.resource(public_id, {
      colors: true,
    });

    const [rgbArray] = result.colors;
    const rgb = rgbArray[0];

    res.json({ dominantColor: `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})` });
  } catch (err) {
    console.error("Dominant color API error:", err);
    res.status(500).json({ error: "Color fetch failed" });
  }
});

module.exports = router;
