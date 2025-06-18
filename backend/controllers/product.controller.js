const Product = require("../models/product.model");
const redis = require("../lib/redis");
const asyncHandler = require("../middlewares/asyncHandler");

const createProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, category, featured } = req.body;
  const cafeSlug = req.user.cafeSlug;

  if (!name || !price || !category) {
    return res.status(400).json({ message: "Zorunlu alanlar eksik." });
  }

  const newProduct = await Product.create({
    name,
    price,
    description,
    image,
    category,
    featured: featured || false,
    cafeSlug
  });

  await redis.del(`menu:${cafeSlug}`);
  await redis.del(`admin_products:${cafeSlug}`);

  res.status(201).json({ message: "Ürün başarıyla eklendi", product: newProduct });
});

const getProductsByCafe = asyncHandler(async (req, res) => {
    console.log("🧠 Authenticated user:", req.user); // %%%%%
    console.log("🔐 cafeSlug backendte:", req.user.cafeSlug); //%%%%%
  const cafeSlug = req.user.cafeSlug;
  const cacheKey = `admin_products:${cafeSlug}`;

  const cached = await redis.get(cacheKey);
  if (cached) {
    return res.json(JSON.parse(cached));
  }

  const products = await Product.find({ cafeSlug });
  console.log("📦 ürün sayısı:", products.length); //%%%%%
  await redis.set(cacheKey, JSON.stringify(products), "EX", 60);

  await redis.del(`public_menu:${cafeSlug}`);

  res.json(products);
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const cafeSlug = req.user.cafeSlug;

  const product = await Product.findOne({ _id: id, cafeSlug });
  if (!product) {
    return res.status(404).json({ message: "Ürün bulunamadı" });
  }

  await Product.deleteOne({ _id: id });

  await redis.del(`menu:${cafeSlug}`);
  await redis.del(`admin_products:${cafeSlug}`);
  await redis.del(`public_menu:${cafeSlug}`);


  res.json({ message: "Ürün silindi" });
});

const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const cafeSlug = req.user.cafeSlug;
  const { name, price, description, image, category, featured } = req.body;

  const product = await Product.findOne({ _id: id, cafeSlug });
  if (!product) {
    return res.status(404).json({ message: "Ürün bulunamadı" });
  }

  product.name = name || product.name;
  product.price = price || product.price;
  product.description = description || product.description;
  product.image = image || product.image;
  product.category = category || product.category;
  product.featured = featured ?? product.featured;

  await product.save();

  await redis.del(`menu:${cafeSlug}`);
  await redis.del(`admin_products:${cafeSlug}`);
  await redis.del(`public_menu:${cafeSlug}`);


  res.json({ message: "Ürün güncellendi", product });
});

const toggleFeatured = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const cafeSlug = req.user.cafeSlug;

  const product = await Product.findOne({ _id: id, cafeSlug });
  if (!product) {
    return res.status(404).json({ message: "Ürün bulunamadı" });
  }

  product.featured = !product.featured;
  await product.save();

  await redis.del(`menu:${cafeSlug}`);
  await redis.del(`admin_products:${cafeSlug}`);
  await redis.del(`public_menu:${cafeSlug}`);


  res.json({
    message: product.featured
      ? "Ürün öne çıkarıldı"
      : "Ürün öne çıkanlardan çıkarıldı",
    product
  });
});

module.exports = {
  createProduct,
  getProductsByCafe,
  deleteProduct,
  updateProduct,
  toggleFeatured,
};
