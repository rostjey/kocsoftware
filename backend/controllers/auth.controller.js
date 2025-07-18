const Cafe = require("../models/cafe.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("../middlewares/asyncHandler");
const { generateAccessToken, generateRefreshToken } = require("../utils/generateTokens");
const redis = require("../lib/redis");
const sendEmail = require("../utils/sendEmail"); 
require("dotenv").config();

const refreshTokenHandler = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    return res.status(401).json({ message: "Giriş yapmanız gerekiyor" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const payload = { cafeId: decoded.cafeId, cafeSlug: decoded.cafeSlug };
    const newAccessToken = generateAccessToken(payload);

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    console.error("Refresh token hatası:", err);
    return res.status(401).json({ message: "Geçersiz token" });
  }
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const cafe = await Cafe.findOne({ email });
  if (!cafe) {
    return res.status(400).json({ message: "Kullanıcı bulunamadı" });
  }

  const isMatch = await bcrypt.compare(password, cafe.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Hatalı şifre" });
  }

  const payload = { cafeId: cafe._id, cafeSlug: cafe.slug };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  // Refresh token → cookie
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    domain: ".kocsoftware.net", // ← bu önemli: subdomain'leri de kapsar
    maxAge: 15 * 60 * 1000
  });
  
  // Refresh token → cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    domain: ".kocsoftware.net",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  

  // Access token → response
  res.json({
    message: "Giriş başarılı",
    accessToken,
    cafeSlug: cafe.slug
  });
});

const logout = asyncHandler(async (req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    domain: ".kocsoftware.net" // eklendi
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    domain: ".kocsoftware.net" // eklendi
  });
  
  res.json({ message: "Çıkış başarılı" });
});

const googleLoginCallback = asyncHandler(async (req, res) => {
  const cafe = req.user;

  // Redis’ten geçici veriyi al
  const redisKey = `signup:google:${req.ip}`;
  const cached = await redis.get(redisKey);
  let hashedPassword = "";

  if (cached) {
    const parsed = JSON.parse(cached);
    hashedPassword = parsed.password;

    // Cafe zaten varsa sadece login yap
    const existing = await Cafe.findOne({ email: cafe.email });
    if (!existing) {
      cafe.password = hashedPassword;
      cafe.city = parsed.city;
      await cafe.save();
    }

    await redis.del(redisKey);
  }

  const payload = { cafeId: cafe._id, cafeSlug: cafe.slug };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    domain: ".kocsoftware.net",
    maxAge: 15 * 60 * 1000
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    domain: ".kocsoftware.net",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.redirect(`https://kocsoftware.net/admin/dashboard/${cafe.slug}`);
});

// E-posta onay kodu gönderme
const requestVerificationCode = asyncHandler(async (req, res) => {
  const { name, slug, city ,email, password, signupKey } = req.body;

  if (signupKey !== process.env.SIGNUP_KEY) {
    return res.status(401).json({ message: "Geçersiz kayıt anahtarı" });
  }

  const existingCafe = await Cafe.findOne({ email });
  if (existingCafe) {
    return res.status(400).json({ message: "Bu e-posta zaten kayıtlı" });
  }

  // ✅ 6 haneli onay kodunu önce oluştur
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

  // Redis’e geçici kullanıcı verilerini kaydet (5 dakika süreyle)
  await redis.setex(
    `verify:${email}`,
    300, // saniye cinsinden (5 dakika)
    JSON.stringify({
      name,
      slug,
      email,
      password, // hashed yapma zaten yapılacak
      city,
      code: verificationCode,
    })
  );

  // Gmail gönderimi (gerçek SMTP ayarlarını kullanarak)
  await sendEmail(email, verificationCode);

  res.status(200).json({
    message: "Onay kodu e-posta adresinize gönderildi. Lütfen kontrol edin.",
  });
});


// Bu fonksiyon, onay kodunu doğrulamak için kullanılabilir
const verifyEmailCode = asyncHandler(async (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ message: "Email ve kod zorunludur" });
  }

  const redisKey = `verify:${email}`;
  const cachedData = await redis.get(redisKey);

  if (!cachedData) {
    return res.status(400).json({ message: "Bu email için bekleyen bir doğrulama yok" });
  }

  const parsed = JSON.parse(cachedData);

  // Kod uyuşmazsa hata döndür
  if (parsed.code !== code) {
    return res.status(401).json({ message: "Doğrulama kodu hatalı" });
  }

  // Email zaten kayıtlı mı kontrol et
  const existing = await Cafe.findOne({ email });
  if (existing) {
    return res.status(400).json({ message: "Bu email zaten kullanılıyor" });
  }

  // Kullanıcıyı oluştur
  const hashedPassword = await bcrypt.hash(parsed.password, 12);
  const newCafe = await Cafe.create({
    name: parsed.name,
    slug: parsed.slug,
    email: parsed.email,
    password: hashedPassword,
    city: parsed.city,
  });

  // Redis’ten kaldır
  await redis.del(redisKey);

  // Token üretimi ve cookie ayarları
  const payload = { cafeId: newCafe._id, cafeSlug: newCafe.slug };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    domain: ".kocsoftware.net",
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    domain: ".kocsoftware.net",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(201).json({
    message: "Kayıt tamamlandı",
    cafeSlug: newCafe.slug,
    accessToken,
  });
});

const preRegisterGoogle = asyncHandler(async (req, res) => {
  const { signupKey, city, password } = req.body;

  if (signupKey !== process.env.SIGNUP_KEY) {
    return res.status(401).json({ message: "Geçersiz kayıt anahtarı" });
  }

  if (!city || !password) {
    return res.status(400).json({ message: "Şehir ve şifre zorunludur" });
  }

  // Hash şifre
  const hashedPassword = await bcrypt.hash(password, 12);

  // Geçici verileri Redis’e kaydet (örnek: signup:google:ip)
  const redisKey = `signup:google:${req.ip}`;
  await redis.setex(redisKey, 600, JSON.stringify({ city, password: hashedPassword }));

  res.status(200).json({ message: "Bilgiler alındı, yönlendiriliyor..." });
});



module.exports = { login, refreshTokenHandler, logout, googleLoginCallback, requestVerificationCode, verifyEmailCode, preRegisterGoogle };