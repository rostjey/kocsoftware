const express = require("express");
const router = express.Router();
const { signup, login,refreshTokenHandler, logout } = require("../controllers/auth.controller");
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

module.exports = router;