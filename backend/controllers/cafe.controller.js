const Cafe = require("../models/cafe.model");
const Product = require("../models/product.model");
const redis = require("../lib/redis");
const asyncHandler = require("../middlewares/asyncHandler");
const { getDominantColor } = require("../utils/getDominantColor");

const getMyCafe = asyncHandler(async (req, res) => {
  const cafe = await Cafe.findOne({ slug: req.user.cafeSlug });

  if (!cafe) {
    return res.status(404).json({ message: "Kafe bulunamadı" });
  }

  res.json({
    name: cafe.name,
    logo: cafe.logo,
    instagram: cafe.instagram,
  });
});

const updateCafe = asyncHandler(async (req, res) => {
  const slug = req.user.cafeSlug;
  const { name, logo, instagram } = req.body;

  const cafe = await Cafe.findOne({ slug });

  if (!cafe) {
    return res.status(404).json({ message: "Kafe bulunamadı" });
  }

  cafe.name = name || cafe.name;
  cafe.logo = logo || cafe.logo;
  cafe.instagram = instagram || cafe.instagram;

  await cafe.save();

  await redis.del(`public_menu:${slug}`);

  res.json({ message: "Kafe güncellendi", cafe });
});

const getPublicMenu = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const cached = await redis.get(`public_menu:${slug}`);
  if (cached) {
    return res.json(JSON.parse(cached));
  }

  const cafe = await Cafe.findOne({ slug });
  if (!cafe) {
    return res.status(404).json({ message: "Kafe bulunamadı" });
  }

  const products = await Product.find({ cafeSlug: slug });
  const categories = [...new Set(products.map(p => p.category))];

  let dominantColor = "#1f1f1f";
  if (cafe.logo) {
    try {
      const url = new URL(cafe.logo);
      const pathParts = url.pathname.split("/");
      const uploadIndex = pathParts.findIndex((p) => p === "upload");
      const publicIdParts = pathParts.slice(uploadIndex + 2);
      const publicId = publicIdParts.join("/").split(".")[0];

      dominantColor = await getDominantColor(publicId);
    } catch (err) {
      console.error("Dominant renk alınamadı:", err);
    }
  }

  const responseData = {
    cafe: {
      name: cafe.name,
      logo: cafe.logo,
      instagram: cafe.instagram,
      template: cafe.template || "scroll", // hangi şablon kullanılıyor
      dominantColor,
    },
    categories,
    products,
  };

  await redis.set(`public_menu:${slug}`, JSON.stringify(responseData), "EX", 3600);

  res.json(responseData);
});

const updateTemplate = asyncHandler(async (req, res) => {
  const { template } = req.body;
  const slug = req.user.cafeSlug;

  const allowedTemplates = ["scroll", "category", "horizontal"];
  if (!allowedTemplates.includes(template)) {
    return res.status(400).json({ message: "Geçersiz şablon" });
  }

  const cafe = await Cafe.findOne({ slug });
  if (!cafe) {
    return res.status(404).json({ message: "Kafe bulunamadı" });
  }

  cafe.template = template;
  await cafe.save();

  await redis.del(`public_menu:${slug}`); // cache'i temizle

  res.json({ message: "Şablon güncellendi", template });
});

const deleteAccount = asyncHandler(async (req, res) => {
  const cafeSlug = req.user.cafeSlug;

  const deletedCafe = await Cafe.findOneAndDelete({ slug: cafeSlug });

  if (!deletedCafe) {
    return res.status(404).json({ message: "Kafe bulunamadı." });
  }

  await Product.deleteMany({ cafeSlug }); // o kafenin tüm ürünlerini de sil

  await redis.del(`public_menu:${cafeSlug}`); // menü cache'ini de temizle

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  res.status(200).json({ message: "Hesap başarıyla silindi." });
});



module.exports = {
  getMyCafe,
  updateCafe,
  getPublicMenu,
  updateTemplate,
  deleteAccount
};
