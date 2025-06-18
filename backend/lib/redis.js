require("dotenv").config();
const Redis = require("ioredis");

const redis = new Redis(process.env.REDIS_URL, {
  tls: {}, // Upstash TLS bağlantı için gerekli
});

module.exports = redis;
