const jwt = require("jsonwebtoken")
const httpStatus = require("http-status")
const config = require("../config/config")
const ApiError = require("../utils/ApiError")


const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization

  if (!token) {
    return next(new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized"))
  }

  try {
    const verified = jwt.verify(token, config.jwt.secret)
    req.user = verified;
    next()
  }
  catch (error) {
    return next(new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized"))
  }
}

module.exports = verifyToken;
