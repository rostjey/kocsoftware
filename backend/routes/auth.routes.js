const express = require("express");
const router = express.Router();
const { login,refreshTokenHandler, logout, googleLoginCallback, requestVerificationCode, verifyEmailCode, preRegisterGoogle} = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const passport = require("passport");
const Cafe = require("../models/cafe.model");


router.post("/login", login);
router.post("/refresh-token", refreshTokenHandler);
router.post("/logout", logout);

router.get("/me", authMiddleware, async (req, res) => {
  try {
      const cafe = await Cafe.findOne({ slug: req.user.cafeSlug });

      if (!cafe) {
          return res.status(404).json({ error: "Kafe bulunamadı" });
      }

      res.json({
          name: cafe.name,
          logo: cafe.logo,
          instagram: cafe.instagram,
          template: cafe.template,
          slug: cafe.slug,
          avatar: cafe.avatar, // fallback avatar ımage içinde tanımlandı ve passport.js içinde boş dönülüyor belki burada da boş döndürmek gereksiz olabilir öyle zaten
          email: cafe.email,
          provider: cafe.provider,
      });
  } catch (err) {
      console.error("Cafe verisi alınamadı", err);
      res.status(500).json({ error: "Sunucu hatası" });
  }
});

// Google pre-register endpoint önkayıt callbacden önce
router.post("/google/pre-register", preRegisterGoogle);
// Google callback
router.get("/google/callback",
    passport.authenticate("google", { session: false,failureRedirect: "https://kocsoftware.net/admin/login"
    }),
    googleLoginCallback
);

// Google Login-Signup? başlatma signupKey eklendi ama bu fonksiyon sadece google ile login yapanlar için mi yoksa hem login hem signup için mi kullanılacak?
router.get("/google", (req, res, next) => {
    const signupKey = req.query.signupKey;
  
    passport.authenticate("google", {
      scope: ["profile", "email"],
      session: false,
      state: signupKey || "no-key"
    })(req, res, next);
});

// onay kodu gönderme
router.post("/request-verification-code", requestVerificationCode);
// E-posta onay kodunu doğrulama
router.post("/verify-email", verifyEmailCode);

module.exports = router;