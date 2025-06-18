const express = require("express");
const router = express.Router();
const { getMyCafe, updateCafe } = require("../controllers/cafe.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const { getPublicMenu } = require("../controllers/cafe.controller");
const Cafe = require("../models/cafe.model");

// ✅ Tüm kafe sluglarını döndür
router.get("/all-cafe-slugs", async (req, res) => {
    try {
      const cafes = await Cafe.find({}, "slug"); // sadece slug alanını getir
      const slugs = cafes.map((cafe) => ({ slug: cafe.slug }));
      res.json(slugs); // örnek: [{ slug: "retropol" }, { slug: "kafe-x" }]
    } catch (err) {
      console.error("Slugları getirirken hata:", err);
      res.status(500).json({ message: "Sluglar alınamadı." });
    }
});
  
router.get("/:slug", getPublicMenu); // Public menu
router.get("/me", authMiddleware, getMyCafe);
router.put("/:slug", authMiddleware, updateCafe);

module.exports = router;
