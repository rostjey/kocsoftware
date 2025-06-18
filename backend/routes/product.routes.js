const express = require("express");
const router = express.Router();
const { createProduct, getProductsByCafe, deleteProduct, updateProduct, toggleFeatured } = require("../controllers/product.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// Ürün ekleme (sadece giriş yapmış admin)
router.post("/", authMiddleware, createProduct);

// Ürün listeleme (sadece giriş yapmış admin)
router.get("/", authMiddleware, getProductsByCafe);

router.delete("/:id", authMiddleware, deleteProduct);

router.put("/:id", authMiddleware, updateProduct);

router.patch("/:id/toggle-featured", authMiddleware, toggleFeatured);

module.exports = router;
