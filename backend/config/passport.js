const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const Cafe = require("../models/cafe.model");

passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://api.kocsoftware.net/api/admin/google/callback", // ✅ /admin ile eşleştirildi
    passReqToCallback: true // ✅ req.query.state kullanabilmek için
  },
  async (req, accessToken, refreshToken, profile, done) => {
    try {
      const signupKey = req.query.state; // ✅ signupKey burada geliyor

      // 1. Bu Google ID zaten varsa → doğrudan giriş
      let user = await Cafe.findOne({ googleId: profile.id });
      if (user) return done(null, user);

      // 2. Email kontrolü
      const email = profile.emails?.[0]?.value;
      if (!email) return done(null, false); // Email yoksa kayıt yapma

      // 3. Bu email ile önceden kayıt olmuş mu?
      const existingEmailUser = await Cafe.findOne({ email });
      if (existingEmailUser) {
        // Sadece googleId'yi ekle
        existingEmailUser.googleId = profile.id;
        existingEmailUser.provider = "google";
        await existingEmailUser.save();
        return done(null, existingEmailUser);
      }

      // 4. Kayıt işlemi için signupKey doğrulaması
      if (signupKey !== process.env.SIGNUP_KEY) {
        return done(null, false); // Key geçersiz → kayıt izni yok
      }

      // 5. Yeni kullanıcı oluşturulacak → slug üret
      const baseSlug = profile.displayName.toLowerCase().replace(/\s+/g, "-");
      let slug = baseSlug;
      let counter = 1;

      while (await Cafe.findOne({ slug })) {
        slug = `${baseSlug}-${counter++}`;
      }

      const newCafe = await Cafe.create({
        name: profile.displayName,
        slug,
        email,
        googleId: profile.id,
        provider: "google",
        avatar: profile.photos?.[0]?.value || ""
      });

      return done(null, newCafe);
    } catch (err) {
      return done(err, null);
    }
  }
));
