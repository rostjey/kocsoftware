const express = require("express");
const multer = require("multer");
const cloudinary = require("../lib/cloudinary");
const authMiddleware = require("../middlewares/auth.middleware");
const asyncHandler = require("../middlewares/asyncHandler");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "Dosya bulunamadı" });
    }

    const buffer = req.file.buffer;
    const base64 = `data:${req.file.mimetype};base64,${buffer.toString("base64")}`;

    const result = await cloudinary.uploader.upload(base64, {
      folder: "cafe-products",
    });

    res.json({ secure_url: result.secure_url });
  })
);

module.exports = router;
