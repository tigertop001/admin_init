#!/bin/bash

# 确保在server目录下
# 创建必要的目录
mkdir -p config
mkdir -p controllers
mkdir -p models
mkdir -p routes
mkdir -p middlewares
mkdir -p services
mkdir -p utils
mkdir -p tests

# 创建配置文件
cat > config/database.js << 'EOF'
const mongoose = require('mongoose');
const config = require('./index');

const connectDB = async () => {
  try {
    await mongoose.connect(config.mongodb.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB Connected Successfully!');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
EOF

cat > config/index.js << 'EOF'
require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  mongodb: {
    uri: 'mongodb://localhost:27017/pure-admin'
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-jwt-secret-key',
    accessExpiresIn: '24h',
    refreshExpiresIn: '7d'
  },
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true
  }
};
EOF

# 创建主应用文件
cat > app.js << 'EOF'
const express = require('express');
const cors = require('cors');
const config = require('./config');
const connectDB = require('./config/database');

// 创建Express应用
const app = express();

// 连接数据库
connectDB();

// 中间件
app.use(cors(config.cors));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 基础路由
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working' });
});

// 启动服务器
const PORT = config.port || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
EOF

# 创建.env文件
cat > .env << 'EOF'
PORT=3000
MONGODB_URI=mongodb://localhost:27017/pure-admin
JWT_SECRET=your-super-secret-jwt-key
CORS_ORIGIN=http://localhost:5173
EOF

# 创建基础路由文件
cat > routes/index.js << 'EOF'
const express = require('express');
const router = express.Router();

router.get('/test', (req, res) => {
  res.json({ message: 'Router is working' });
});

module.exports = router;
EOF

# 创建package.json（如果不存在）
if [ ! -f package.json ]; then
  cat > package.json << 'EOF'
{
  "name": "pure-admin-server",
  "version": "1.0.0",
  "description": "Pure Admin Backend Server",
  "main": "app.js",
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js",
    "test": "jest"
  },
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "express": "^4.18.2",
    "express-validator": "^7.0.1",
    "jsonwebtoken": "^9.0.0",
    "mongoose": "^7.0.3",
    "qrcode": "^1.5.3",
    "speakeasy": "^2.0.0"
  },
  "devDependencies": {
    "nodemon": "^2.0.22"
  }
}
EOF
fi