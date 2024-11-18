const bcrypt = require("bcryptjs");
const speakeasy = require("speakeasy");
const qrcode = require("qrcode");
const User = require("../models/user");
const GoogleAuth = require("../models/google-auth");
const { generateTokens } = require("../utils/jwt");

class AuthService {
  async validateUser(username, password) {
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return null;
    }
    return user;
  }

  async login(username, password) {
    const user = await this.validateUser(username, password);
    if (!user) {
      throw new Error("用户名或密码错误");
    }

    // 检查用户是否启用了谷歌验证器
    const googleAuth = await GoogleAuth.findOne({ userId: user._id });
    const needGoogleAuth = googleAuth && googleAuth.isEnabled;
    const needBindGoogle = !googleAuth;

    const userData = {
      userId: user._id,
      username: user.username,
      roles: user.roles,
      permissions: user.permissions,
      needGoogleAuth,
      needBindGoogle
    };

    if (!needGoogleAuth) {
      // 如果不需要谷歌验证，直接生成token
      const tokens = generateTokens(userData);
      return {
        ...tokens,
        user: userData,
        needGoogleAuth,
        needBindGoogle
      };
    }

    // 如果需要谷歌验证，返回状态信息
    return {
      user: userData,
      needGoogleAuth,
      needBindGoogle
    };
  }

  async generateGoogleAuth(username) {
    const user = await User.findOne({ username });
    if (!user) {
      throw new Error("用户不存在");
    }

    // 生成谷歌验证器密钥
    const secret = speakeasy.generateSecret({
      name: `PureAdmin(${username})`
    });

    // 生成二维码
    const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url);

    // 保存或更新谷歌验证器信息
    await GoogleAuth.findOneAndUpdate(
      { userId: user._id },
      {
        userId: user._id,
        username: user.username,
        secretKey: secret.base32,
        isEnabled: false
      },
      { upsert: true }
    );

    return {
      qrCodeUrl,
      secretKey: secret.base32
    };
  }

  async verifyGoogleCode(username, code) {
    const googleAuth = await GoogleAuth.findOne({ username });
    if (!googleAuth) {
      throw new Error("未绑定谷歌验证器");
    }

    const verified = speakeasy.totp.verify({
      secret: googleAuth.secretKey,
      encoding: "base32",
      token: code,
      window: 1
    });

    if (!verified) {
      throw new Error("验证码错误或已过期");
    }

    // 如果是首次验证，激活谷歌验证器
    if (!googleAuth.isEnabled) {
      googleAuth.isEnabled = true;
      await googleAuth.save();
    }

    const user = await User.findOne({ username });
    const tokens = generateTokens({
      userId: user._id,
      username: user.username,
      roles: user.roles,
      permissions: user.permissions
    });

    return tokens;
  }
}

module.exports = new AuthService();
