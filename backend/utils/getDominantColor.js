const axios = require("axios");
const ColorThief = require("color-thief-node");

function rgbToHex(r, g, b) {
  return (
    "#" +
    [r, g, b]
      .map((x) => x.toString(16).padStart(2, "0"))
      .join("")
      .toLowerCase()
  );
}

module.exports = async function getDominantColor(imageUrl) {
  try {
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    const buffer = Buffer.from(response.data, "binary");

    const [r, g, b] = await ColorThief.getColor(buffer);
    const hex = rgbToHex(r, g, b);

    console.log("🎨 Dominant renk (hex):", hex);
    return hex;
  } catch (err) {
    console.error("Dominant renk alınamadı:", err);
    return "#1f1f1f"; // fallback
  }
};

