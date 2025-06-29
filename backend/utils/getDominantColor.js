const axios = require("axios");
const getColors = require("get-image-colors");

module.exports = async function getDominantColor(imageUrl) {
  try {
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    const buffer = Buffer.from(response.data, "binary");

    // PNG/JPEG dosyaları için MIME tipi tahmini
    const extension = imageUrl.split(".").pop();
    const mimeType = extension === "png" ? "image/png" : "image/jpeg";

    const colors = await getColors(buffer, mimeType);
    return colors[0].hex();
  } catch (err) {
    console.error("Dominant renk alınamadı:", err);
    return "#1f1f1f";
  }
};
