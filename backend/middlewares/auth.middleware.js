const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  console.log("🍪 Access Token:", req.cookies.accessToken); // 🔍 LOG BURADA

  const token = req.cookies.accessToken;

  if (!token) {
    console.log("❌ Token bulunamadı.");
    return res.status(401).json({ message: "Giriş yapmanız gerekiyor" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token çözüldü:", decoded); // 🔍 LOG BURADA

    req.user = {
      cafeId: decoded.cafeId,
      cafeSlug: decoded.cafeSlug,
    };

    next();
  } catch (err) {
    console.log("❌ Token doğrulanamadı.");
    return res.status(401).json({ message: "Geçersiz token" });
  }
};

module.exports = authMiddleware;
