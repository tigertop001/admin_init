const { Router } = require("express");
const router = Router();
const googleAuthService = require("../services/googleAuth.service");

// 生成谷歌验证器
router.post("/google/generate", async (req, res) => {
  try {
    const { username } = req.body;
    const result = await googleAuthService.generateSecret(username);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
