// backend/routes/cloudinaryColor.js

import cloudinary from "cloudinary";
require("dotenv").config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.get("/api/dominant-color", async (req, res) => {
  const { public_id } = req.query;

  try {
    const result = await cloudinary.v2.api.resource(public_id, {
      colors: true,
    });

    const [rgbArray] = result.colors; // örnek: [[32,32,94], 0.9]
    const rgb = rgbArray[0];

    res.json({ dominantColor: `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})` });
  } catch (err) {
    console.error("Dominant color API error:", err);
    res.status(500).json({ error: "Color fetch failed" });
  }
});
