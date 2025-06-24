const express = require("express");
const router = express.Router();
const { signup, login,refreshTokenHandler, logout, googleLoginCallback } = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const passport = require("passport");
const Cafe = require("../models/cafe.model");


router.post("/signup", signup);
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
      });
  } catch (err) {
      console.error("Cafe verisi alınamadı", err);
      res.status(500).json({ error: "Sunucu hatası" });
  }
});


// Google Login-Signup? başlatma signupKey eklendi ama bu fonksiyon sadece google ile login yapanlar için mi yoksa hem login hem signup için mi kullanılacak?
router.get("/google", (req, res, next) => {
    const signupKey = req.query.signupKey;
  
    passport.authenticate("google", {
      scope: ["profile", "email"],
      session: false,
      state: signupKey || "no-key"
    })(req, res, next);
  });

// Google callback
router.get("/google/callback",
    passport.authenticate("google", { session: false, failureRedirect: "/login" }),
    googleLoginCallback
);

module.exports = router;