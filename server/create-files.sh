#!/bin/bash

# 配置文件
echo "Creating config files..."
mkdir -p config

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

# 路由文件
echo "Creating route files..."
mkdir -p routes

cat > routes/index.js << 'EOF'
const express = require('express');
const router = express.Router();

router.get('/test', (req, res) => {
  res.json({ message: 'API is working' });
});

module.exports = router;
EOF

# 中间件文件
echo "Creating middleware files..."
mkdir -p middlewares

cat > middlewares/error.js << 'EOF'
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error'
  });
};

module.exports = errorHandler;
EOF

# 主应用文件
echo "Creating main app file..."
cat > app.js << 'EOF'
const express = require('express');
const cors = require('cors');
const config = require('./config');
const connectDB = require('./config/database');
const routes = require('./routes');
const errorHandler = require('./middlewares/error');

// 创建Express应用
const app = express();

// 连接数据库
connectDB();

// 中间件
app.use(cors(config.cors));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 路由
app.use('/api', routes);

// 错误处理
app.use(errorHandler);

// 启动服务器
const PORT = config.port || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
EOF

# 其他必需的目录
mkdir -p controllers models services utils

# 环境配置文件
cat > .env << 'EOF'
PORT=3000
MONGODB_URI=mongodb://localhost:27017/pure-admin
JWT_SECRET=your-super-secret-jwt-key
CORS_ORIGIN=http://localhost:5173
EOF

echo "All files created successfully!"