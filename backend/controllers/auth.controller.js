const Cafe = require("../models/cafe.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("../middlewares/asyncHandler");
const { generateAccessToken, generateRefreshToken } = require("../utils/generateTokens");
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


const signup = asyncHandler(async (req, res) => {
  const { name, slug, email, password, signupKey } = req.body;
  console.log("Signup key from env:", process.env.SIGNUP_KEY);

  if (signupKey !== process.env.SIGNUP_KEY) {
    return res.status(401).json({ message: "Geçersiz kayıt anahtarı" });
  }

  const existingCafe = await Cafe.findOne({ email });
  if (existingCafe) {
    return res.status(400).json({ message: "Bu e-posta zaten kullanılıyor" });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const newCafe = await Cafe.create({
    name,
    slug,
    email,
    password: hashedPassword,
  });

  const payload = { cafeId: newCafe._id, cafeSlug: newCafe.slug };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,      //process.env.NODE_ENV === "production",
    sameSite: "none",       //"Strict",
    maxAge: 15 * 60 * 1000 // 15 dakika
  });


  // Refresh token → cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true, // prod: true
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  // Access token → response
  res.status(201).json({
    message: "Kafe başarıyla oluşturuldu",
    accessToken,
    cafeSlug: newCafe.slug,
  });
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

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,      //process.env.NODE_ENV === "production",
    sameSite: "none",       //"Strict",
    maxAge: 15 * 60 * 1000 // 15 dakika
  });

  // Refresh token → cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true, // production'da true olmalı
    sameSite: "none", // cross-site cookie için
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 gün
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
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  
  res.json({ message: "Çıkış başarılı" });
});

module.exports = { signup, login, refreshTokenHandler, logout };