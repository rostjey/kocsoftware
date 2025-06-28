const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/product.routes");
const cafeRoutes = require("./routes/cafe.routes");
const uploadRoutes = require("./routes/upload.routes");
const errorMiddleware = require("./middlewares/error.middleware");
require("dotenv").config();
const passport = require("passport");
require("./config/passport"); // passport.js dosyasını çalıştır

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.FRONTEND_URL_WWW
];
  
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS hatası: Bu origin izinli değil."));
    }
  },
  credentials: true
}));

app.use(passport.initialize()); // Passport.js'i başlat

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("Backend çalışıyor!");
});

const PORT = process.env.PORT || 5050;

app.use("/api/admin", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cafe", cafeRoutes);
app.use("/api/upload", uploadRoutes);

app.use(errorMiddleware); // Global error handler en sonda olmalı

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB bağlantısı başarılı");
        app.listen(PORT, () => {
            console.log(`Server ${PORT} portunda çalışıyor`);
        });
    })
    .catch((err) => console.log("Mongo bağlantı hatası:", err));
