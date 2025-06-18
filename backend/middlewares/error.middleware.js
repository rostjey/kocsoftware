const errorMiddleware = (err, req, res, next) => {
    console.error("❌ Global Hata:", err.message);
  
    res.status(500).json({
      message: err.message || "Sunucu hatası",
    });
  };
  
  module.exports = errorMiddleware;
  