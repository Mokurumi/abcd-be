// middlewares/xssSanitize.ts
import { Request, Response, NextFunction } from "express";
import validator from "validator";

const unescapeObject = (obj: any, depth = 0): any => {
  // Prevent deep recursion
  if (depth > 50) return obj;

  if (typeof obj === "string") {
    return validator.unescape(obj);
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => unescapeObject(item, depth + 1));
  }
  if (obj !== null && typeof obj === "object" && obj.constructor === Object) {
    const unescaped: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        unescaped[key] = unescapeObject(obj[key], depth + 1);
      }
    }
    return unescaped;
  }
  return obj;
};

const xssSanitize = () => (req: Request, res: Response, next: NextFunction) => {
  // Sanitize request body (escape for XSS protection)
  if (req.body) {
    for (const key in req.body) {
      if (req.body.hasOwnProperty(key) && typeof req.body[key] === "string") {
        req.body[key] = validator.escape(req.body[key]);
      }
    }
    // Then unescape to store original text in database
    try {
      req.body = unescapeObject(req.body);
    } catch (error) {
      console.error("Error unescaping request body:", error);
    }
  }

  // Sanitize request query (escape for XSS protection)
  if (req.query) {
    for (const key in req.query) {
      if (req.query.hasOwnProperty(key) && typeof req.query[key] === "string") {
        req.query[key] = validator.escape(req.query[key] as string);
      }
    }
    // Then unescape
    try {
      req.query = unescapeObject(req.query);
    } catch (error) {
      console.error("Error unescaping request query:", error);
    }
  }

  // Sanitize request params (escape for XSS protection)
  if (req.params) {
    for (const key in req.params) {
      if (
        req.params.hasOwnProperty(key) &&
        typeof req.params[key] === "string"
      ) {
        req.params[key] = validator.escape(req.params[key]);
      }
    }
    // Then unescape
    try {
      req.params = unescapeObject(req.params);
    } catch (error) {
      console.error("Error unescaping request params:", error);
    }
  }

  // Override res.json to unescape the response data
  const originalJson = res.json.bind(res);
  res.json = function (body: any) {
    try {
      const unescapedBody = unescapeObject(body);
      return originalJson(unescapedBody);
    } catch (error) {
      // If unescaping fails, return original body
      console.error("Error unescaping response:", error);
      return originalJson(body);
    }
  };

  next();
};

export default xssSanitize;
