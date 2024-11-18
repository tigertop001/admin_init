const ApiResponse = require("../utils/response");

const errorHandler = (err, req, res, _next) => {
  // 添加下划线前缀表示有意不使用
  console.error(err.stack);

  if (err.name === "ValidationError") {
    return res.status(400).json(ApiResponse.error(err.message, 400));
  }

  res.status(500).json(ApiResponse.error("服务器内部错误", 500));
};

module.exports = errorHandler;
