const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const Cafe = require("../models/cafe.model");
const redis = require("../lib/redis");

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
      const linkEmail = req.query.email; // 🌟 Google bağlama durumunda buradan geliyor
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

      // 🔁 1. Google ID ile zaten kayıtlı mı?
      let user = await Cafe.findOne({ googleId: profile.id });
      if (user) return done(null, user);

      // 🔁 2. Admin panelden gelen kullanıcı emailiyle eşleşme (Google bağlama)
      if (linkEmail && linkEmail === email) {
        const existing = await Cafe.findOne({ email: linkEmail });
        if (!existing) return done(null, false); // Güvenlik

        existing.googleId = profile.id;
        existing.provider = "google";
        await existing.save();
        return done(null, existing);
      }

      // 🔁 3. Email zaten kayıtlı mı?
      const existingByEmail = await Cafe.findOne({ email });
      if (existingByEmail) {
        // Eğer password yoksa → signup sayfasından gelen verileri kullan
        if (!existingByEmail.password && cached) {
          existingByEmail.password = password;
          existingByEmail.city = city;
        }
        existingByEmail.googleId = profile.id;
        existingByEmail.provider = "google";

        // 🆕 Avatar ekle (sadece boşsa)
        if (!existingByEmail.avatar && profile.photos?.[0]?.value) {
         existingByEmail.avatar = profile.photos[0].value;
        }

        await existingByEmail.save();
        await redis.del(redisKey);
        return done(null, existingByEmail);
      }

      // 🔐 4. Yeni kayıt için signupKey kontrolü
      if (signupKey !== process.env.SIGNUP_KEY) {
        return done(null, false);
      }

      // 🆕 5. Yeni kullanıcı oluştur
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

      await redis.del(redisKey);
      return done(null, newCafe);
    } catch (err) {
      return done(err, null);
    }
  }
));
