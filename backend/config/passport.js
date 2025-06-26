const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const Cafe = require("../models/cafe.model");
const redis = require("../lib/redis"); // 🔥 Redis eklendi

passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://api.kocsoftware.net/api/admin/google/callback",
    passReqToCallback: true,
  },
  async (req, accessToken, refreshToken, profile, done) => {
    try {
      const signupKey = req.query.state;

      const email = profile.emails?.[0]?.value;
      if (!email) return done(null, false);

      const redisKey = `signup:google:${req.ip}`;
      const cached = await redis.get(redisKey);
      let password = "";
      let city = "";

      if (cached) {
        const parsed = JSON.parse(cached);
        password = parsed.password;
        city = parsed.city;
      }

      // 🔁 Eğer bu Google ID zaten varsa → direkt login
      let user = await Cafe.findOne({ googleId: profile.id });
      if (user) return done(null, user);

      // 🔁 Email kayıtlı mı?
      let existingEmailUser = await Cafe.findOne({ email });
      if (existingEmailUser) {
        // Eğer şifre boşsa → yeni kayıt gibi işle (Google ile ilk defa kaydediliyorsa)
        if (!existingEmailUser.password && cached) {
          existingEmailUser.password = password;
          existingEmailUser.city = city;
        }
        existingEmailUser.googleId = profile.id;
        existingEmailUser.provider = "google";
        await existingEmailUser.save();
        await redis.del(redisKey); // Redis temizliği
        return done(null, existingEmailUser);
      }

      // 🔐 signupKey doğrulaması
      if (signupKey !== process.env.SIGNUP_KEY) {
        return done(null, false);
      }

      // 🆕 Yeni kullanıcı oluştur
      const baseSlug = profile.displayName.toLowerCase().replace(/\s+/g, "-");
      let slug = baseSlug;
      let counter = 1;
      while (await Cafe.findOne({ slug })) {
        slug = `${baseSlug}-${counter++}`;
      }

      const avatar = profile.photos?.[0]?.value || "/default-avatar.png";

      const newCafe = await Cafe.create({
        name: profile.displayName,
        slug,
        email,
        password,
        city,
        googleId: profile.id,
        provider: "google",
        avatar,
      });

      await redis.del(redisKey); // Redis temizliği

      return done(null, newCafe);
    } catch (err) {
      return done(err, null);
    }
  }
));
