const getColors = require("get-image-colors");

module.exports = async function getDominantColor(imageUrl) {
  try {
    const colors = await getColors(imageUrl);
    return colors[0].hex(); // En baskın renk
  } catch (err) {
    console.error("Dominant renk alınamadı:", err);
    return "#1f1f1f"; // fallback
  }
};
