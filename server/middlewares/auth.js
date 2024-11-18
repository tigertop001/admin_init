const { verifyToken } = require("../utils/jwt");
const ApiResponse = require("../utils/response");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json(ApiResponse.error("未授权访问", 401));
  }

  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json(ApiResponse.error("Token无效或已过期", 401));
  }

  req.user = decoded;
  next();
};

module.exports = authMiddleware;
