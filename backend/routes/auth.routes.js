const express = require("express");
const router = express.Router();
const { signup, login,refreshTokenHandler, logout, googleLoginCallback } = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");


router.post("/signup", signup);
router.post("/login", login);
router.post("/refresh-token", refreshTokenHandler);
router.post("/logout", logout);

router.get("/me", authMiddleware, (req, res) => {
    res.json({
        message: "Yetkili erişim başarılı",
        cafeSlug: req.user.cafeSlug
    });
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