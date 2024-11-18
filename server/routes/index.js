const { Router } = require("express");
const authRoutes = require("./auth.route");

const router = Router();

router.use("/auth", authRoutes);

// 测试路由
router.get("/test", (_req, res) => {
  res.json({ message: "API is working" });
});

module.exports = router;
