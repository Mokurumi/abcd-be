const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");
const config = require("../config/config");

const logoutAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return next(new ApiError(401, "No token provided"));
  }

  try {
    // Decode the token without checking expiration
    const decoded = jwt.verify(token, config.jwt.secret, { ignoreExpiration: true });
    req.user = decoded;
    next();
  }
  catch (err) {
    // if token is invalid, return success
    next();
  }
};

module.exports = logoutAuth;
