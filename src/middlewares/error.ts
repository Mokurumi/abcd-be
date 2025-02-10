import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import httpStatus from "http-status";
import config from "../config";
import logger from "../config/logger";
import ApiError from "../utils/ApiError";

// Error converter middleware
const errorConverter = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode: any =
      error.statusCode || (error instanceof mongoose.Error ? 400 : 500);
    const message =
      error.message || httpStatus[statusCode as keyof typeof httpStatus];
    error = new ApiError(statusCode, message, false, err.stack);
  }

  next(error);
};

// Error handler middleware
const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let { statusCode, message } = err;

  if (config.env === "prod" && !err.isOperational) {
    statusCode = 500;
    message = "Internal server error";
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

export { errorConverter, errorHandler };
