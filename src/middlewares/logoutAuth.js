const jwt = require("jsonwebtoken");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const config = require("../config/config");

const logoutAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return next(new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized"));
  }

  try {
    // Decode the token without checking expiration
    const decoded = jwt.verify(token, config.jwt.secret, { ignoreExpiration: true });
    req.user = decoded;
    next();
  } catch (err) {
    next(new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized"));
  }
};

module.exports = logoutAuth;
