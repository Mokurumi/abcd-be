// middlewares/xssSanitize.ts
import { Request, Response, NextFunction } from "express";
import validator from "validator";

const xssSanitize = () => (req: Request, res: Response, next: NextFunction) => {
  // Sanitize request body
  if (req.body) {
    for (const key in req.body) {
      if (typeof req.body[key] === "string") {
        req.body[key] = validator.escape(req.body[key]);
      }
    }
  }

  // Sanitize request query
  if (req.query) {
    for (const key in req.query) {
      if (typeof req.query[key] === "string") {
        req.query[key] = validator.escape(req.query[key] as string);
      }
    }
  }

  // Sanitize request params
  if (req.params) {
    for (const key in req.params) {
      if (typeof req.params[key] === "string") {
        req.params[key] = validator.escape(req.params[key]);
      }
    }
  }

  next();
};

export default xssSanitize;
