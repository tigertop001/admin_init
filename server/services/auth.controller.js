const authService = require("../services/auth.service");
const ApiResponse = require("../utils/response");

class AuthController {
  async login(req, res, next) {
    try {
      const { username, password } = req.body;
      const result = await authService.login(username, password);

      res.json(ApiResponse.success(result));
    } catch (error) {
      next(error);
    }
  }

  async generateGoogleAuth(req, res, next) {
    try {
      const { username } = req.body;
      const result = await authService.generateGoogleAuth(username);

      res.json(ApiResponse.success(result));
    } catch (error) {
      next(error);
    }
  }

  async verifyGoogleCode(req, res, next) {
    try {
      const { username, code } = req.body;
      const result = await authService.verifyGoogleCode(username, code);

      res.json(ApiResponse.success(result));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
