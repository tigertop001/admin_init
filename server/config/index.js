require("dotenv").config();

module.exports = {
  port: process.env.PORT || 3000,
  mongodb: {
    uri: "mongodb://localhost:27017/pure-admin"
  },
  jwt: {
    secret: process.env.JWT_SECRET || "your-jwt-secret-key",
    accessExpiresIn: "24h",
    refreshExpiresIn: "7d"
  },
  cors: {
    origin: process.env.CORS_ORIGIN || "http://192.168.9.129:8848", // 前端地址
    credentials: true
  }
};
