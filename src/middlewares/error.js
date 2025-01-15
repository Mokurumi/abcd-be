const mongoose = require("mongoose");
const httpStatus = require("http-status");
const config = require("../config/config");
const logger = require("../config/logger");
const ApiError = require("../utils/ApiError");

const errorConverter = (err, req, res, next) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    const statusCode =
      error.statusCode || error instanceof mongoose.Error
        ? 400
        : 500;
    const message = error.message || httpStatus[statusCode];
    error = new ApiError(statusCode, message, false, err.stack);
  }
  next(error);
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;
  if (config.env === "prod" && !err.isOperational) {
    statusCode = 500;
    message = 'Internal server error';
  }

  res.locals.errorMessage = err.message;

  const response = {
    code: statusCode,
    message,
    ...(config.env === "dev" && { stack: err.stack }),
  };

  if (config.env === "dev") {
    logger.error(err);
  }

  res.status(statusCode).send(response);
};

module.exports = {
  errorConverter,
  errorHandler,
};
