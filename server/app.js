const express = require("express");
const cors = require("cors");
const config = require("./config");
const connectDB = require("./config/database");
const routes = require("./routes");

const app = express();

// 连接数据库
connectDB();

// 中间件
app.use(cors(config.cors));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 路由 - 注意这里不需要加 /api 前缀，因为已经在路由文件中包含了
app.use("/api", routes);

const PORT = config.port || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
