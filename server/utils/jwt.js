const jwt = require("jsonwebtoken");
const config = require("../config");

const generateTokens = payload => {
  const token = jwt.sign({ ...payload, type: "access" }, config.jwt.secret, {
    expiresIn: config.jwt.accessExpiresIn
  });

  const refreshToken = jwt.sign(
    { ...payload, type: "refresh" },
    config.jwt.secret,
    { expiresIn: config.jwt.refreshExpiresIn }
  );

  return { token, refreshToken };
};

const verifyToken = token => {
  try {
    return jwt.verify(token, config.jwt.secret);
  } catch {
    return null;
  }
};

module.exports = {
  generateTokens,
  verifyToken
};
